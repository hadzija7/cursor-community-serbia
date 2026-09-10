import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { parseGitHubRepoUrl } from '@/lib/github-repo'
import { assertCheckedIn } from '@/lib/hackathon-checkin'
import {
  type ProjectSubmissionInput,
  validateProjectSubmissionFields,
} from '@/lib/project-submission'

export const dynamic = 'force-dynamic'

export type ExistingProjectSubmission = {
  id: string
  projectTitle: string
  projectDescription: string
  githubUrl: string
  demoRecordingUrl: string
  liveDemoUrl: string
  teammateEmails: string[]
  submittedAt: string
  updatedAt: string
}

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
}

type SubmissionRow = {
  id: string
  project_title: string
  project_description: string
  github_url: string
  demo_recording_url: string
  live_demo_url: string
  teammate_emails: string[] | null
  submitted_at: string
  updated_at: string
}

function mapSubmission(row: SubmissionRow): ExistingProjectSubmission {
  return {
    id: row.id,
    projectTitle: row.project_title,
    projectDescription: row.project_description,
    githubUrl: row.github_url,
    demoRecordingUrl: row.demo_recording_url,
    liveDemoUrl: row.live_demo_url,
    teammateEmails: Array.isArray(row.teammate_emails) ? row.teammate_emails : [],
    submittedAt:
      typeof row.submitted_at === 'string'
        ? row.submitted_at
        : new Date(row.submitted_at).toISOString(),
    updatedAt:
      typeof row.updated_at === 'string'
        ? row.updated_at
        : new Date(row.updated_at).toISOString(),
  }
}

/** Prefill helper: return the caller's existing submission, or null. */
export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return toError('Not authenticated', 401)
  }

  const email = session.user.email.trim().toLowerCase()
  const denied = await assertCheckedIn(
    email,
    'Check in at the event first before submitting your project',
  )
  if (denied) return denied

  const db = getDb()
  if (!db) {
    return toError('Project submissions are not configured.', 503)
  }

  try {
    const rows = (await db`
      SELECT
        id,
        project_title,
        project_description,
        github_url,
        demo_recording_url,
        live_demo_url,
        teammate_emails,
        submitted_at,
        updated_at
      FROM hackathon_project_submissions
      WHERE email = ${email}
      LIMIT 1
    `) as SubmissionRow[]

    const row = rows[0]
    return NextResponse.json({
      ok: true,
      submission: row ? mapSubmission(row) : null,
    })
  } catch (err) {
    console.error('Failed to load project submission:', err)
    return toError('Could not load project submission.', 500)
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return toError('Not authenticated', 401)
  }

  const email = session.user.email.trim().toLowerCase()
  const name = session.user.name?.trim() || null

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return toError('Invalid request body.', 400)
  }

  const validated = validateProjectSubmissionFields(payload as ProjectSubmissionInput, {
    submitterEmail: email,
  })
  if (!validated.ok) {
    return toError(validated.message, 400)
  }

  const denied = await assertCheckedIn(
    email,
    'Check in at the event first before submitting your project',
  )
  if (denied) return denied

  const parsedGithub = parseGitHubRepoUrl(validated.data.githubUrl)
  if (!parsedGithub) {
    return toError(
      'GitHub URL must be a repository link (https://github.com/owner/repo).',
      400,
    )
  }

  const db = getDb()
  if (!db) {
    return toError('Project submissions are not configured.', 503)
  }

  try {
    const rows = await db`
      INSERT INTO hackathon_project_submissions (
        email,
        name,
        project_title,
        project_description,
        github_url,
        demo_recording_url,
        live_demo_url,
        teammate_emails
      )
      VALUES (
        ${email},
        ${name},
        ${validated.data.projectTitle},
        ${validated.data.projectDescription},
        ${parsedGithub.canonicalUrl},
        ${validated.data.demoRecordingUrl},
        ${validated.data.liveDemoUrl},
        ${validated.data.teammateEmails}
      )
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        project_title = EXCLUDED.project_title,
        project_description = EXCLUDED.project_description,
        github_url = EXCLUDED.github_url,
        demo_recording_url = EXCLUDED.demo_recording_url,
        live_demo_url = EXCLUDED.live_demo_url,
        teammate_emails = EXCLUDED.teammate_emails,
        updated_at = now()
      RETURNING id, submitted_at, updated_at
    `

    const row = rows[0] as
      | { id: string; submitted_at: string; updated_at: string }
      | undefined

    return NextResponse.json({
      ok: true,
      message: 'Project submitted successfully.',
      id: row?.id,
      submittedAt: row?.submitted_at,
      updatedAt: row?.updated_at,
    })
  } catch (err) {
    console.error('Failed to save project submission:', err)
    return toError('Could not save project submission.', 500)
  }
}

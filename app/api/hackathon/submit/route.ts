import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { assertPublicGitHubRepo } from '@/lib/github-repo'
import { assertCheckedIn } from '@/lib/hackathon-checkin'
import { validateProjectSubmissionFields } from '@/lib/project-submission'

export const dynamic = 'force-dynamic'

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
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

  const validated = validateProjectSubmissionFields(
    (payload ?? {}) as Record<string, string | undefined>,
  )
  if (!validated.ok) {
    return toError(validated.message, 400)
  }

  const denied = await assertCheckedIn(
    email,
    'Check in at the event first before submitting your project',
  )
  if (denied) return denied

  const githubCheck = await assertPublicGitHubRepo(validated.data.githubUrl)
  if (!githubCheck.ok) {
    switch (githubCheck.reason) {
      case 'invalid_url':
        return toError(
          'GitHub URL must be a public repository (https://github.com/owner/repo).',
          400,
        )
      case 'not_found':
        return toError(
          'GitHub repository not found. Make sure the repo exists and is public.',
          400,
        )
      case 'private':
        return toError(
          'GitHub repository must be public / open-source for judging.',
          400,
        )
      case 'api_error':
        return toError(
          'Could not verify the GitHub repository right now. Try again in a moment.',
          502,
        )
      default: {
        const _exhaustive: never = githubCheck.reason
        return toError(`Unexpected GitHub check failure: ${_exhaustive}`, 500)
      }
    }
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
        live_demo_url
      )
      VALUES (
        ${email},
        ${name},
        ${validated.data.projectTitle},
        ${validated.data.projectDescription},
        ${githubCheck.canonicalUrl},
        ${validated.data.demoRecordingUrl},
        ${validated.data.liveDemoUrl}
      )
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        project_title = EXCLUDED.project_title,
        project_description = EXCLUDED.project_description,
        github_url = EXCLUDED.github_url,
        demo_recording_url = EXCLUDED.demo_recording_url,
        live_demo_url = EXCLUDED.live_demo_url,
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

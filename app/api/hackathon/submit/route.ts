import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { parseGitHubRepoUrl } from '@/lib/github-repo'
import { assertCheckedIn } from '@/lib/hackathon-checkin'
import {
  type ProjectSubmissionInput,
  validateProjectSubmissionFields,
} from '@/lib/project-submission'
import {
  describeTeamConflict,
  pickMembershipRow,
  teamMemberEmails,
  teamRole,
  teammateEmailsOf,
  teammateNamesOf,
  teammatesForSave,
  zipTeammateColumns,
  type Teammate,
  type TeamRow,
} from '@/lib/project-team'

export const dynamic = 'force-dynamic'

export type ExistingProjectSubmission = {
  id: string
  projectTitle: string
  projectDescription: string
  githubUrl: string
  demoRecordingUrl: string
  liveDemoUrl: string
  teammates: Teammate[]
  role: 'submitter' | 'teammate'
  submitterName: string | null
  submittedAt: string
  updatedAt: string
}

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
}

type SubmissionRow = {
  id: string
  email: string
  name: string | null
  project_title: string
  project_description: string
  github_url: string
  demo_recording_url: string
  live_demo_url: string
  teammate_emails: string[] | null
  teammate_names: string[] | null
  submitted_at: string
  updated_at: string
}

function toTeamRow(row: SubmissionRow): TeamRow {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    projectTitle: row.project_title,
    githubUrl: row.github_url,
    teammateEmails: Array.isArray(row.teammate_emails) ? row.teammate_emails : [],
  }
}

function mapSubmission(row: SubmissionRow, viewerEmail: string): ExistingProjectSubmission {
  return {
    id: row.id,
    projectTitle: row.project_title,
    projectDescription: row.project_description,
    githubUrl: row.github_url,
    demoRecordingUrl: row.demo_recording_url,
    liveDemoUrl: row.live_demo_url,
    teammates: zipTeammateColumns(row.teammate_emails, row.teammate_names),
    role: teamRole(viewerEmail, row.email),
    submitterName: row.name,
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

function postgresErrorCode(err: unknown): string | null {
  if (typeof err !== 'object' || err === null) return null
  if ('code' in err && typeof (err as { code: unknown }).code === 'string') {
    return (err as { code: string }).code
  }
  if ('cause' in err) {
    return postgresErrorCode((err as { cause: unknown }).cause)
  }
  return null
}

/** Prefill helper: return the caller's team row (submitter or listed teammate), or null. */
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
        email,
        name,
        project_title,
        project_description,
        github_url,
        demo_recording_url,
        live_demo_url,
        teammate_emails,
        teammate_names,
        submitted_at,
        updated_at
      FROM hackathon_project_submissions
      WHERE email = ${email}
         OR ${email} = ANY(teammate_emails)
      ORDER BY CASE WHEN email = ${email} THEN 0 ELSE 1 END, submitted_at ASC
      LIMIT 2
    `) as SubmissionRow[]

    const row = pickMembershipRow(email, rows.map(toTeamRow))
    const full = row ? rows.find((candidate) => candidate.id === row.id) : null
    return NextResponse.json({
      ok: true,
      submission: full ? mapSubmission(full, email) : null,
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
    const membershipRows = (await db`
      SELECT
        id,
        email,
        name,
        project_title,
        project_description,
        github_url,
        demo_recording_url,
        live_demo_url,
        teammate_emails,
        teammate_names,
        submitted_at,
        updated_at
      FROM hackathon_project_submissions
      WHERE email = ${email}
         OR ${email} = ANY(teammate_emails)
      ORDER BY CASE WHEN email = ${email} THEN 0 ELSE 1 END, submitted_at ASC
      LIMIT 2
    `) as SubmissionRow[]

    const myRow = pickMembershipRow(email, membershipRows.map(toTeamRow))
    const myFull = myRow
      ? membershipRows.find((row) => row.id === myRow.id)
      : undefined
    const ownerEmail = myRow?.email ?? email
    const storedCallerName = zipTeammateColumns(
      myFull?.teammate_emails,
      myFull?.teammate_names,
    ).find((teammate) => teammate.email === email)?.name
    const saved = teammatesForSave({
      callerEmail: email,
      callerName: name || storedCallerName || null,
      ownerEmail,
      formTeammates: validated.data.teammates,
    })
    if (!saved.ok) {
      return toError(saved.message, 400)
    }

    const memberEmails = teamMemberEmails(ownerEmail, teammateEmailsOf(saved.teammates))
    const githubUrl = parsedGithub.canonicalUrl

    const conflictRows = (myRow
      ? await db`
          SELECT
            id,
            email,
            name,
            project_title,
            github_url,
            teammate_emails
          FROM hackathon_project_submissions
          WHERE id IS DISTINCT FROM ${myRow.id}::uuid
            AND (
              email = ANY(${memberEmails})
              OR teammate_emails && ${memberEmails}
              OR lower(github_url) = lower(${githubUrl})
            )
          LIMIT 5
        `
      : await db`
          SELECT
            id,
            email,
            name,
            project_title,
            github_url,
            teammate_emails
          FROM hackathon_project_submissions
          WHERE
            email = ANY(${memberEmails})
            OR teammate_emails && ${memberEmails}
            OR lower(github_url) = lower(${githubUrl})
          LIMIT 5
        `) as Array<{
      id: string
      email: string
      name: string | null
      project_title: string
      github_url: string
      teammate_emails: string[] | null
    }>

    const conflict = conflictRows[0]
    if (conflict) {
      const described = describeTeamConflict({
        callerEmail: email,
        proposedGithubUrl: githubUrl,
        proposedMemberEmails: memberEmails,
        conflict: {
          id: conflict.id,
          email: conflict.email,
          name: conflict.name,
          projectTitle: conflict.project_title,
          githubUrl: conflict.github_url,
          teammateEmails: Array.isArray(conflict.teammate_emails)
            ? conflict.teammate_emails
            : [],
        },
      })
      return toError(described.message, 409, { code: described.code })
    }

    const teammateEmails = teammateEmailsOf(saved.teammates)
    const teammateNames = teammateNamesOf(saved.teammates)

    if (myRow) {
      const keepOwnerName = myRow.email === email ? name : myRow.name
      const rows = await db`
        UPDATE hackathon_project_submissions SET
          name = ${keepOwnerName},
          project_title = ${validated.data.projectTitle},
          project_description = ${validated.data.projectDescription},
          github_url = ${githubUrl},
          demo_recording_url = ${validated.data.demoRecordingUrl},
          live_demo_url = ${validated.data.liveDemoUrl},
          teammate_emails = ${teammateEmails},
          teammate_names = ${teammateNames},
          updated_at = now()
        WHERE id = ${myRow.id}::uuid
        RETURNING id, submitted_at, updated_at
      `
      const row = rows[0] as
        | { id: string; submitted_at: string; updated_at: string }
        | undefined
      return NextResponse.json({
        ok: true,
        message: 'Project updated successfully.',
        id: row?.id,
        submittedAt: row?.submitted_at,
        updatedAt: row?.updated_at,
      })
    }

    const rows = await db`
      INSERT INTO hackathon_project_submissions (
        email,
        name,
        project_title,
        project_description,
        github_url,
        demo_recording_url,
        live_demo_url,
        teammate_emails,
        teammate_names
      )
      VALUES (
        ${email},
        ${name},
        ${validated.data.projectTitle},
        ${validated.data.projectDescription},
        ${githubUrl},
        ${validated.data.demoRecordingUrl},
        ${validated.data.liveDemoUrl},
        ${teammateEmails},
        ${teammateNames}
      )
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
    if (postgresErrorCode(err) === '23505') {
      return toError(
        'This project conflicts with an existing submission (same person or the same GitHub repo).',
        409,
        { code: 'conflict' },
      )
    }
    console.error('Failed to save project submission:', err)
    return toError('Could not save project submission.', 500)
  }
}

import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { isHackathonAdmin } from '@/lib/hackathon-judges'
import { submissionsAreOpen } from '@/lib/hackathon-submissions'

export const dynamic = 'force-dynamic'

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
}

async function readGate(db: NonNullable<ReturnType<typeof getDb>>): Promise<boolean> {
  try {
    const rows = (await db`
      SELECT closed FROM hackathon_submissions_gate WHERE id = 1
    `) as { closed: boolean }[]
    return submissionsAreOpen(rows[0]?.closed)
  } catch (err) {
    console.warn('hackathon_submissions_gate unavailable:', err)
    return true
  }
}

/** Public: whether the submit form is open, plus whether this viewer is an admin. */
export async function GET() {
  const session = await auth()
  const email = session?.user?.email?.trim().toLowerCase() ?? null
  const db = getDb()
  if (!db) {
    return NextResponse.json({
      ok: true,
      submissionsOpen: true,
      isAdmin: isHackathonAdmin(email),
    })
  }

  const submissionsOpen = await readGate(db)
  return NextResponse.json({
    ok: true,
    submissionsOpen,
    isAdmin: isHackathonAdmin(email),
  })
}

/** Admin-only: close or reopen project submissions. */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return toError('Not authenticated', 401)
  }

  const email = session.user.email.trim().toLowerCase()
  if (!isHackathonAdmin(email)) {
    return toError('Only admins can close or reopen submissions.', 403)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return toError('Invalid request body.', 400)
  }

  const closed = (payload as { closed?: unknown }).closed === true
  const db = getDb()
  if (!db) {
    return toError('Submissions gate is not configured.', 503)
  }

  try {
    await db`
      INSERT INTO hackathon_submissions_gate (id, closed, updated_by, updated_at)
      VALUES (1, ${closed}, ${email}, now())
      ON CONFLICT (id) DO UPDATE SET
        closed = ${closed},
        updated_by = ${email},
        updated_at = now()
    `
    return NextResponse.json({
      ok: true,
      message: closed ? 'Submissions closed.' : 'Submissions reopened.',
      closed,
      submissionsOpen: !closed,
    })
  } catch (err) {
    console.error('Failed to update submissions gate:', err)
    return toError('Could not update submissions gate.', 500)
  }
}

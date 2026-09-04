import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { isHackathonJudge } from '@/lib/hackathon-judges'
import { validateJudgeScore } from '@/lib/project-gallery'

export const dynamic = 'force-dynamic'

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
}

/** Upsert a judge score (1–10) for a submission. Judge emails gated by HACKATHON_JUDGE_EMAILS. */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return toError('Not authenticated', 401)
  }

  const email = session.user.email.trim().toLowerCase()
  if (!isHackathonJudge(email)) {
    return toError('Only judges can leave project scores.', 403)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return toError('Invalid request body.', 400)
  }

  const body = (payload ?? {}) as { submissionId?: unknown; score?: unknown }
  const submissionId =
    typeof body.submissionId === 'string' ? body.submissionId.trim() : ''

  if (!submissionId) {
    return toError('submissionId is required.', 400)
  }

  const scoreCheck = validateJudgeScore(body.score)
  if (!scoreCheck.ok) {
    return toError(scoreCheck.message, 400)
  }

  const db = getDb()
  if (!db) {
    return toError('Project reviews are not configured.', 503)
  }

  try {
    const existing = await db`
      SELECT id FROM hackathon_project_submissions WHERE id = ${submissionId}::uuid LIMIT 1
    `
    if (!existing[0]) {
      return toError('Project not found.', 404)
    }

    const rows = await db`
      INSERT INTO hackathon_project_reviews (submission_id, judge_email, score)
      VALUES (${submissionId}::uuid, ${email}, ${scoreCheck.score})
      ON CONFLICT (judge_email, submission_id) DO UPDATE SET
        score = EXCLUDED.score,
        updated_at = now()
      RETURNING id, score, updated_at
    `

    const row = rows[0] as { id: string; score: number; updated_at: string } | undefined

    return NextResponse.json({
      ok: true,
      message: 'Score saved.',
      id: row?.id,
      score: row?.score ?? scoreCheck.score,
      updatedAt: row?.updated_at,
    })
  } catch (err) {
    console.error('Failed to save project review:', err)
    return toError('Could not save score.', 500)
  }
}

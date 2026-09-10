import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { isHackathonAdmin, isHackathonJudge } from '@/lib/hackathon-judges'
import { judgeHasScoredAll } from '@/lib/project-gallery'

export const dynamic = 'force-dynamic'

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
}

type ReviewRow = { submission_id: string; judge_email: string }

/**
 * Judge: mark own scoring finished (scores freeze).
 * Admin: unlock a judge with { finished: false, judgeEmail }.
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return toError('Not authenticated', 401)
  }

  const actor = session.user.email.trim().toLowerCase()
  const actorIsJudge = isHackathonJudge(actor)
  const actorIsAdmin = isHackathonAdmin(actor)
  if (!actorIsJudge && !actorIsAdmin) {
    return toError('Only judges or admins can change scoring finish state.', 403)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return toError('Invalid request body.', 400)
  }

  const body = (payload ?? {}) as { finished?: unknown; judgeEmail?: unknown }
  const finished = body.finished === true
  const requestedEmail =
    typeof body.judgeEmail === 'string' ? body.judgeEmail.trim().toLowerCase() : ''

  const db = getDb()
  if (!db) {
    return toError('Scoring finish is not configured.', 503)
  }

  if (!finished) {
    if (!actorIsAdmin) {
      return toError('Only admins can reopen a judge’s scoring.', 403)
    }
    const target = requestedEmail || actor
    if (!target) {
      return toError('judgeEmail is required to reopen scoring.', 400)
    }
    try {
      await db`DELETE FROM hackathon_judge_locks WHERE judge_email = ${target}`
      return NextResponse.json({
        ok: true,
        message: 'Scoring reopened.',
        finished: false,
        judgeEmail: target,
      })
    } catch (err) {
      console.error('Failed to reopen judge scoring:', err)
      return toError('Could not reopen scoring.', 500)
    }
  }

  if (!actorIsJudge) {
    return toError('Only judges can mark scoring finished.', 403)
  }

  try {
    const submissions = (await db`
      SELECT id FROM hackathon_project_submissions
    `) as { id: string }[]
    const projectIds = submissions.map((row) => row.id)

    if (projectIds.length === 0) {
      return toError('There are no projects to finish scoring.', 409, {
        code: 'SCORES_INCOMPLETE',
      })
    }

    const reviews = (await db`
      SELECT submission_id, judge_email
      FROM hackathon_project_reviews
      WHERE judge_email = ${actor}
    `) as ReviewRow[]

    const scoredAll = judgeHasScoredAll({
      judgeEmail: actor,
      projectIds,
      reviews: reviews.map((row) => ({
        judgeEmail: row.judge_email,
        submissionId: row.submission_id,
      })),
    })

    if (!scoredAll) {
      return toError('Score every project before marking scoring finished.', 409, {
        code: 'SCORES_INCOMPLETE',
      })
    }

    await db`
      INSERT INTO hackathon_judge_locks (judge_email, finished_at)
      VALUES (${actor}, now())
      ON CONFLICT (judge_email) DO UPDATE SET finished_at = now()
    `

    return NextResponse.json({
      ok: true,
      message: 'Scoring marked finished.',
      finished: true,
      judgeEmail: actor,
    })
  } catch (err) {
    console.error('Failed to mark scoring finished:', err)
    return toError('Could not mark scoring finished.', 500)
  }
}

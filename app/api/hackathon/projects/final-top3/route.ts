import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { canManageJudgeFinalTop3, getJudgeEmails } from '@/lib/hackathon-judges'
import {
  formatConvexTop3Credits,
  isJudgingComplete,
  validateFinalTop3Ids,
  type JudgeAwardPlace,
} from '@/lib/project-gallery'

export const dynamic = 'force-dynamic'

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
}

type ReviewRow = { submission_id: string; judge_email: string }

/**
 * Confirm or override the final judge-panel top 3.
 * Allowed for HACKATHON_JUDGE_EMAILS or HACKATHON_ADMIN_EMAILS only after
 * every configured judge has scored every project (strict all-rated).
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return toError('Not authenticated', 401)
  }

  const email = session.user.email.trim().toLowerCase()
  if (!canManageJudgeFinalTop3(email)) {
    return toError('Only judges or admins can set the final top 3.', 403)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return toError('Invalid request body.', 400)
  }

  const body = (payload ?? {}) as {
    firstId?: unknown
    secondId?: unknown
    thirdId?: unknown
  }

  const check = validateFinalTop3Ids(body.firstId, body.secondId, body.thirdId)
  if (!check.ok) {
    return toError(check.message, 400)
  }

  const db = getDb()
  if (!db) {
    return toError('Final top 3 is not configured.', 503)
  }

  try {
    const submissions = (await db`
      SELECT id FROM hackathon_project_submissions
    `) as { id: string }[]

    const projectIds = new Set(submissions.map((s) => s.id))
    for (const place of check.places) {
      if (!projectIds.has(place.submissionId)) {
        return toError('One or more selected projects were not found.', 404)
      }
    }

    const reviewRows = (await db`
      SELECT submission_id, judge_email FROM hackathon_project_reviews
    `) as ReviewRow[]

    const allRated = isJudgingComplete({
      judgeEmails: getJudgeEmails(),
      projectIds,
      reviews: reviewRows.map((r) => ({
        judgeEmail: r.judge_email,
        submissionId: r.submission_id,
      })),
    })

    if (!allRated) {
      return toError(
        'Final top 3 can only be set after every configured judge has scored every project.',
        409,
        { code: 'JUDGING_INCOMPLETE' },
      )
    }

    // Replace the singleton final ranking in one transaction-ish sequence.
    await db`DELETE FROM hackathon_judge_final_top3`

    for (const place of check.places) {
      await db`
        INSERT INTO hackathon_judge_final_top3 (place, submission_id, set_by_email)
        VALUES (${place.place}, ${place.submissionId}::uuid, ${email})
      `
    }

    const top3 = check.places.map((place) => ({
      place: place.place as JudgeAwardPlace,
      id: place.submissionId,
      awardLabel: formatConvexTop3Credits(place.place),
    }))

    return NextResponse.json({
      ok: true,
      message: 'Final top 3 saved.',
      top3,
    })
  } catch (err) {
    console.error('Failed to save final top 3:', err)
    return toError('Could not save final top 3.', 500)
  }
}

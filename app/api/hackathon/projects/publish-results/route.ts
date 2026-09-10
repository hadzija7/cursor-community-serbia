import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { getJudgeEmails, isHackathonAdmin } from '@/lib/hackathon-judges'
import {
  analyzeJudgeAggregate,
  areAllJudgesFinished,
  averageJudgeScore,
  canPublishJudgeResults,
  type JudgeScoredProject,
} from '@/lib/project-gallery'

export const dynamic = 'force-dynamic'

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
}

type ReviewRow = { submission_id: string; judge_email: string; score: number }
type LockRow = { judge_email: string }
type FinalRow = { place: number }

/**
 * Admin-only: publish or unpublish judge winners on the public gallery.
 * Publish requires every judge finished and a unique top 3 (clear averages or saved final).
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return toError('Not authenticated', 401)
  }

  const email = session.user.email.trim().toLowerCase()
  if (!isHackathonAdmin(email)) {
    return toError('Only admins can publish judge results.', 403)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return toError('Invalid request body.', 400)
  }

  const published = (payload as { published?: unknown }).published === true

  const db = getDb()
  if (!db) {
    return toError('Publishing is not configured.', 503)
  }

  if (!published) {
    try {
      await db`
        INSERT INTO hackathon_judge_results_publish (id, published, published_by, published_at)
        VALUES (1, false, ${email}, now())
        ON CONFLICT (id) DO UPDATE SET
          published = false,
          published_by = ${email},
          published_at = now()
      `
      return NextResponse.json({
        ok: true,
        message: 'Judge results unpublished.',
        published: false,
      })
    } catch (err) {
      console.error('Failed to unpublish judge results:', err)
      return toError('Could not unpublish results.', 500)
    }
  }

  try {
    const submissions = (await db`
      SELECT id, project_title FROM hackathon_project_submissions
    `) as { id: string; project_title: string }[]
    const projectIds = submissions.map((row) => row.id)

    const reviewRows = (await db`
      SELECT submission_id, judge_email, score FROM hackathon_project_reviews
    `) as ReviewRow[]

    let lockRows: LockRow[] = []
    try {
      lockRows = (await db`
        SELECT judge_email FROM hackathon_judge_locks
      `) as LockRow[]
    } catch (err) {
      console.warn('hackathon_judge_locks unavailable:', err)
      lockRows = []
    }

    const reviews = reviewRows.map((row) => ({
      judgeEmail: row.judge_email,
      submissionId: row.submission_id,
    }))

    const allFinished = areAllJudgesFinished({
      judgeEmails: getJudgeEmails(),
      lockedEmails: lockRows.map((row) => row.judge_email),
      projectIds,
      reviews,
    })

    const scoresById = new Map<string, number[]>()
    for (const row of reviewRows) {
      const list = scoresById.get(row.submission_id) ?? []
      list.push(row.score)
      scoresById.set(row.submission_id, list)
    }

    const scoredProjects: JudgeScoredProject[] = submissions
      .map((row) => {
        const averageScore = averageJudgeScore(scoresById.get(row.id) ?? [])
        if (averageScore == null) return null
        return { id: row.id, title: row.project_title, averageScore }
      })
      .filter((row): row is JudgeScoredProject => row != null)

    const aggregate = analyzeJudgeAggregate(scoredProjects, {
      judgingComplete: allFinished,
    })

    let finalRows: FinalRow[] = []
    try {
      finalRows = (await db`
        SELECT place FROM hackathon_judge_final_top3
      `) as FinalRow[]
    } catch (err) {
      console.warn('hackathon_judge_final_top3 unavailable:', err)
      finalRows = []
    }
    const finalConfirmed = [1, 2, 3].every((place) =>
      finalRows.some((row) => row.place === place),
    )

    const aggregateStatus =
      aggregate.status === 'clear' || aggregate.status === 'needs_decision'
        ? aggregate.status
        : 'incomplete'

    if (
      !canPublishJudgeResults({
        allFinished,
        finalConfirmed,
        aggregateStatus,
      })
    ) {
      return toError(
        allFinished
          ? 'Resolve the final top 3 before publishing (averages are tied).'
          : 'Every judge must mark scoring finished before results can be published.',
        409,
        { code: allFinished ? 'NEEDS_DECISION' : 'JUDGES_NOT_FINISHED' },
      )
    }

    await db`
      INSERT INTO hackathon_judge_results_publish (id, published, published_by, published_at)
      VALUES (1, true, ${email}, now())
      ON CONFLICT (id) DO UPDATE SET
        published = true,
        published_by = ${email},
        published_at = now()
    `

    return NextResponse.json({
      ok: true,
      message: 'Judge results published.',
      published: true,
    })
  } catch (err) {
    console.error('Failed to publish judge results:', err)
    return toError('Could not publish results.', 500)
  }
}

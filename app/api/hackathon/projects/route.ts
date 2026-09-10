import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import {
  canManageJudgeFinalTop3,
  getJudgeEmails,
  isHackathonAdmin,
  isHackathonJudge,
} from '@/lib/hackathon-judges'
import {
  analyzeJudgeAggregate,
  averageJudgeScore,
  formatConvexTop3Cash,
  isJudgingComplete,
  MAX_FAVORITES_PER_USER,
  type JudgeAwardPlace,
  type JudgeScoredProject,
} from '@/lib/project-gallery'

export const dynamic = 'force-dynamic'

export type ProjectGalleryItem = {
  id: string
  title: string
  description: string
  githubUrl: string
  demoRecordingUrl: string
  liveDemoUrl: string
  submitterName: string | null
  teammateEmails: string[]
  submittedAt: string
  /**
   * Mean of all judge scores — only populated for judges/admins after all-rated,
   * or never for the public. Non-privileged clients always get null (privacy).
   */
  averageScore: number | null
  /** Review count — same privacy gate as averageScore (always 0 when gated). */
  reviewCount: number
  favoriteCount: number
  favoritedByMe: boolean
  /** Only the viewer's own judge score (never peers). */
  myScore: number | null
  /** Final confirmed place 1–3, or clear auto top-3 once judging complete. */
  awardPlace: JudgeAwardPlace | null
  /** Convex credit label for awardPlace when set. */
  awardLabel: string | null
}

export type JudgePanelSummary = {
  /** Strict: every HACKATHON_JUDGE_EMAILS address scored every project. */
  allRated: boolean
  judgeCount: number
  projectCount: number
  /** Projects this judge has scored (viewer-only progress). */
  myRatedCount: number
  /** Aggregates visible only to judges/admins when allRated. */
  aggregateStatus: 'hidden' | 'incomplete' | 'clear' | 'needs_decision'
  aggregateReason: string | null
  /** Ranked averages — only when canSeeAggregates. */
  ranked: Array<{
    id: string
    title: string
    averageScore: number
    competitionRank: number
  }>
  /** Provisional or confirmed top 3 for judges/admins (or public confirmed awards via cards). */
  top3: Array<{
    place: JudgeAwardPlace
    id: string
    title: string
    averageScore: number | null
    source: 'clear' | 'manual'
    awardLabel: string
  }> | null
  needsDecision: boolean
  canSetFinalTop3: boolean
  finalConfirmed: boolean
}

type SubmissionRow = {
  id: string
  name: string | null
  project_title: string
  project_description: string
  github_url: string
  demo_recording_url: string
  live_demo_url: string
  teammate_emails: string[] | null
  submitted_at: string
}

type ReviewRow = {
  submission_id: string
  judge_email: string
  score: number
}

type FavoriteAggRow = {
  submission_id: string
  favorite_count: string | number
}

type MyFavoriteRow = { submission_id: string }

type FinalTop3Row = {
  place: number
  submission_id: string
}

function emptyJudgePanel(partial?: Partial<JudgePanelSummary>): JudgePanelSummary {
  return {
    allRated: false,
    judgeCount: 0,
    projectCount: 0,
    myRatedCount: 0,
    aggregateStatus: 'hidden',
    aggregateReason: null,
    ranked: [],
    top3: null,
    needsDecision: false,
    canSetFinalTop3: false,
    finalConfirmed: false,
    ...partial,
  }
}

export async function GET() {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Project gallery is not configured.',
        projects: [],
        judgePanel: emptyJudgePanel(),
      },
      { status: 503 },
    )
  }

  const session = await auth()
  const viewerEmail = session?.user?.email?.trim().toLowerCase() ?? null
  const viewerIsJudge = isHackathonJudge(viewerEmail)
  const viewerIsAdmin = isHackathonAdmin(viewerEmail)
  const canManageFinal = canManageJudgeFinalTop3(viewerEmail)
  const configuredJudges = getJudgeEmails()

  try {
    const submissions = (await db`
      SELECT
        id,
        name,
        project_title,
        project_description,
        github_url,
        demo_recording_url,
        live_demo_url,
        teammate_emails,
        submitted_at
      FROM hackathon_project_submissions
      ORDER BY submitted_at DESC
    `) as SubmissionRow[]

    const favoriteAggs = (await db`
      SELECT submission_id, COUNT(*)::int AS favorite_count
      FROM hackathon_project_favorites
      GROUP BY submission_id
    `) as FavoriteAggRow[]

    const favoritesById = new Map<string, number>()
    for (const row of favoriteAggs) {
      favoritesById.set(row.submission_id, Number(row.favorite_count) || 0)
    }

    const myFavorites = new Set<string>()
    const myScores = new Map<string, number>()
    let myFavoriteCount = 0

    if (viewerEmail) {
      const favRows = (await db`
        SELECT submission_id
        FROM hackathon_project_favorites
        WHERE user_email = ${viewerEmail}
      `) as MyFavoriteRow[]
      myFavoriteCount = favRows.length
      for (const row of favRows) {
        myFavorites.add(row.submission_id)
      }
    }

    let reviewRows: ReviewRow[] = []
    if (submissions.length > 0) {
      reviewRows = (await db`
        SELECT submission_id, judge_email, score
        FROM hackathon_project_reviews
      `) as ReviewRow[]
    }

    if (viewerIsJudge && viewerEmail) {
      for (const row of reviewRows) {
        if (row.judge_email.trim().toLowerCase() === viewerEmail) {
          myScores.set(row.submission_id, row.score)
        }
      }
    }

    const scoresById = new Map<string, number[]>()
    for (const row of reviewRows) {
      const list = scoresById.get(row.submission_id) ?? []
      list.push(row.score)
      scoresById.set(row.submission_id, list)
    }

    const projectIds = submissions.map((s) => s.id)
    const allRated = isJudgingComplete({
      judgeEmails: configuredJudges,
      projectIds,
      reviews: reviewRows.map((r) => ({
        judgeEmail: r.judge_email,
        submissionId: r.submission_id,
      })),
    })

    const scoredProjects: JudgeScoredProject[] = submissions
      .map((row) => {
        const scores = scoresById.get(row.id) ?? []
        const averageScore = averageJudgeScore(scores)
        if (averageScore == null) return null
        return {
          id: row.id,
          title: row.project_title,
          averageScore,
        }
      })
      .filter((p): p is JudgeScoredProject => p != null)

    const aggregate = analyzeJudgeAggregate(scoredProjects, {
      judgingComplete: allRated,
    })

    let finalRows: FinalTop3Row[] = []
    try {
      finalRows = (await db`
        SELECT place, submission_id
        FROM hackathon_judge_final_top3
        ORDER BY place ASC
      `) as FinalTop3Row[]
    } catch (err) {
      // Table may not exist until db:setup on older deploys — treat as empty.
      console.warn('hackathon_judge_final_top3 unavailable:', err)
      finalRows = []
    }

    const finalByPlace = new Map<JudgeAwardPlace, string>()
    const finalBySubmission = new Map<string, JudgeAwardPlace>()
    for (const row of finalRows) {
      if (row.place === 1 || row.place === 2 || row.place === 3) {
        const place = row.place as JudgeAwardPlace
        finalByPlace.set(place, row.submission_id)
        finalBySubmission.set(row.submission_id, place)
      }
    }
    const finalConfirmed = finalByPlace.size === 3

    // Effective awards: manual final wins; else clear auto top-3 once all-rated.
    const effectiveAwards = new Map<string, JudgeAwardPlace>()
    if (finalConfirmed) {
      for (const [id, place] of finalBySubmission) {
        effectiveAwards.set(id, place)
      }
    } else if (aggregate.status === 'clear') {
      aggregate.top3.forEach((entry, index) => {
        effectiveAwards.set(entry.id, (index + 1) as JudgeAwardPlace)
      })
    }

    const canSeeAggregates = (viewerIsJudge || viewerIsAdmin) && allRated

    const titleById = new Map(submissions.map((s) => [s.id, s.project_title]))
    const averageById = new Map(scoredProjects.map((p) => [p.id, p.averageScore]))

    let judgeTop3: JudgePanelSummary['top3'] = null
    if (canSeeAggregates || finalConfirmed) {
      if (finalConfirmed) {
        judgeTop3 = ([1, 2, 3] as JudgeAwardPlace[]).map((place) => {
          const id = finalByPlace.get(place)!
          return {
            place,
            id,
            title: titleById.get(id) ?? id,
            averageScore: canSeeAggregates ? (averageById.get(id) ?? null) : null,
            source: 'manual' as const,
            awardLabel: formatConvexTop3Cash(place),
          }
        })
      } else if (aggregate.status === 'clear' && canSeeAggregates) {
        judgeTop3 = aggregate.top3.map((entry, index) => {
          const place = (index + 1) as JudgeAwardPlace
          return {
            place,
            id: entry.id,
            title: entry.title,
            averageScore: entry.averageScore,
            source: 'clear' as const,
            awardLabel: formatConvexTop3Cash(place),
          }
        })
      }
    }

    const projects: ProjectGalleryItem[] = submissions.map((row) => {
      const scores = scoresById.get(row.id) ?? []
      const awardPlace = effectiveAwards.get(row.id) ?? null
      // Confirmed final top 3 stays visible even if judging later reopens
      // (late submission / new judge). Clear auto ranking still needs allRated.
      const publicMaySeeAward =
        awardPlace != null &&
        (finalConfirmed || (aggregate.status === 'clear' && allRated))

      return {
        id: row.id,
        title: row.project_title,
        description: row.project_description,
        githubUrl: row.github_url,
        demoRecordingUrl: row.demo_recording_url,
        liveDemoUrl: row.live_demo_url,
        submitterName: row.name,
        teammateEmails: Array.isArray(row.teammate_emails) ? row.teammate_emails : [],
        submittedAt:
          typeof row.submitted_at === 'string'
            ? row.submitted_at
            : new Date(row.submitted_at).toISOString(),
        averageScore: canSeeAggregates ? averageJudgeScore(scores) : null,
        reviewCount: canSeeAggregates ? scores.length : 0,
        favoriteCount: favoritesById.get(row.id) ?? 0,
        favoritedByMe: myFavorites.has(row.id),
        myScore: myScores.get(row.id) ?? null,
        awardPlace: publicMaySeeAward || canSeeAggregates ? awardPlace : null,
        awardLabel:
          (publicMaySeeAward || canSeeAggregates) && awardPlace
            ? formatConvexTop3Cash(awardPlace)
            : null,
      }
    })

    const myRatedCount = viewerIsJudge ? myScores.size : 0

    let aggregateStatus: JudgePanelSummary['aggregateStatus'] = 'hidden'
    let aggregateReason: string | null = null
    let ranked: JudgePanelSummary['ranked'] = []
    let needsDecision = false

    if (canSeeAggregates) {
      if (aggregate.status === 'incomplete') {
        aggregateStatus = 'incomplete'
        aggregateReason = aggregate.reason
      } else if (aggregate.status === 'clear') {
        aggregateStatus = 'clear'
        ranked = aggregate.ranked
      } else {
        aggregateStatus = 'needs_decision'
        aggregateReason = aggregate.reason
        ranked = aggregate.ranked
        needsDecision = !finalConfirmed
      }
    }

    const judgePanel = emptyJudgePanel({
      allRated,
      judgeCount: configuredJudges.size,
      projectCount: submissions.length,
      myRatedCount,
      aggregateStatus,
      aggregateReason,
      ranked: canSeeAggregates ? ranked : [],
      top3: judgeTop3,
      needsDecision,
      canSetFinalTop3: canManageFinal && allRated,
      finalConfirmed,
    })

    return NextResponse.json({
      ok: true,
      projects,
      viewer: {
        email: viewerEmail,
        isJudge: viewerIsJudge,
        isAdmin: viewerIsAdmin,
        favoriteCount: myFavoriteCount,
        maxFavorites: MAX_FAVORITES_PER_USER,
      },
      judgePanel,
    })
  } catch (err) {
    console.error('Failed to list hackathon projects:', err)
    return NextResponse.json(
      {
        ok: false,
        message: 'Could not load projects.',
        projects: [],
        judgePanel: emptyJudgePanel(),
      },
      { status: 500 },
    )
  }
}

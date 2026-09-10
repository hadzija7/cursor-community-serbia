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
  areAllJudgesFinished,
  averageJudgeScore,
  canEditJudgeScore,
  canPublishJudgeResults,
  formatConvexTop3Cash,
  isJudgeScoringFinished,
  isJudgingComplete,
  MAX_FAVORITES_PER_USER,
  type JudgeAwardPlace,
  type JudgeScoredProject,
} from '@/lib/project-gallery'
import { galleryTeamPresentation, zipTeammateColumns } from '@/lib/project-team'

export const dynamic = 'force-dynamic'

export type ProjectGalleryItem = {
  id: string
  title: string
  description: string
  githubUrl: string
  demoRecordingUrl: string
  liveDemoUrl: string
  submitterName: string | null
  /** Display names only — never emails. */
  teammateNames: string[]
  /** Judge/admin only; omitted for the public gallery. */
  teammateEmails?: string[]
  submittedAt: string
  /**
   * Mean of all judge scores — only populated for judges/admins after all judges
   * finish. Public clients always get null (even after results are published).
   */
  averageScore: number | null
  /** Review count — same privacy gate as averageScore (always 0 when gated). */
  reviewCount: number
  favoriteCount: number
  favoritedByMe: boolean
  /** Only the viewer's own judge score (never peers). */
  myScore: number | null
  /** Judge-only: whether this viewer may still change their score on this card. */
  canEditScore: boolean
  /** Final confirmed place 1–3, or clear auto top-3 once judging complete. */
  awardPlace: JudgeAwardPlace | null
  /** Convex credit label for awardPlace when set. */
  awardLabel: string | null
}

export type JudgePeerVote = {
  submissionId: string
  title: string
  averageScore: number | null
  scores: Array<{ judgeEmail: string; score: number | null }>
}

export type JudgePanelSummary = {
  /** Strict: every HACKATHON_JUDGE_EMAILS address scored every project. */
  allRated: boolean
  /** Every configured judge scored every project and marked scoring finished. */
  allFinished: boolean
  /** This judge has marked scoring finished (and still covers every current project). */
  myFinished: boolean
  /** How many configured judges have marked scoring finished. */
  finishedCount: number
  canFinishScoring: boolean
  resultsPublished: boolean
  canPublishResults: boolean
  judgeCount: number
  projectCount: number
  /** Projects this judge has scored (viewer-only progress). */
  myRatedCount: number
  /** Aggregates visible only to judges/admins after all judges finish. */
  aggregateStatus: 'hidden' | 'incomplete' | 'clear' | 'needs_decision'
  aggregateReason: string | null
  /** Ranked averages — only when canSeeJudgeOutcome. */
  ranked: Array<{
    id: string
    title: string
    averageScore: number
    competitionRank: number
  }>
  /** Per-judge scores — only after all judges finish. */
  peerVotes: JudgePeerVote[] | null
  /** Provisional or confirmed top 3 for judges/admins. */
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
  teammate_names: string[] | null
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
    allFinished: false,
    myFinished: false,
    finishedCount: 0,
    canFinishScoring: false,
    resultsPublished: false,
    canPublishResults: false,
    judgeCount: 0,
    projectCount: 0,
    myRatedCount: 0,
    aggregateStatus: 'hidden',
    aggregateReason: null,
    ranked: [],
    peerVotes: null,
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
        teammate_names,
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
    const reviews = reviewRows.map((r) => ({
      judgeEmail: r.judge_email,
      submissionId: r.submission_id,
    }))

    const allRated = isJudgingComplete({
      judgeEmails: configuredJudges,
      projectIds,
      reviews,
    })

    let lockEmails: string[] = []
    try {
      const lockRows = (await db`
        SELECT judge_email FROM hackathon_judge_locks
      `) as { judge_email: string }[]
      lockEmails = lockRows.map((row) => row.judge_email)
    } catch (err) {
      console.warn('hackathon_judge_locks unavailable:', err)
      lockEmails = []
    }

    let resultsPublished = false
    try {
      const publishRows = (await db`
        SELECT published FROM hackathon_judge_results_publish WHERE id = 1
      `) as { published: boolean }[]
      resultsPublished = Boolean(publishRows[0]?.published)
    } catch (err) {
      console.warn('hackathon_judge_results_publish unavailable:', err)
      resultsPublished = false
    }

    const allFinished = areAllJudgesFinished({
      judgeEmails: configuredJudges,
      lockedEmails: lockEmails,
      projectIds,
      reviews,
    })

    const myFinished = Boolean(
      viewerIsJudge &&
        viewerEmail &&
        isJudgeScoringFinished({
          judgeEmail: viewerEmail,
          lockedEmails: lockEmails,
          projectIds,
          reviews,
        }),
    )

    const finishedCount = [...configuredJudges].filter((judge) =>
      isJudgeScoringFinished({
        judgeEmail: judge,
        lockedEmails: lockEmails,
        projectIds,
        reviews,
      }),
    ).length

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
      judgingComplete: allFinished,
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

    // Effective awards: manual final wins; else clear auto top-3 once all finished.
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

    const privileged = viewerIsJudge || viewerIsAdmin
    const canSeeJudgeOutcome = privileged && allFinished

    const titleById = new Map(submissions.map((s) => [s.id, s.project_title]))
    const averageById = new Map(scoredProjects.map((p) => [p.id, p.averageScore]))

    let judgeTop3: JudgePanelSummary['top3'] = null
    if (canSeeJudgeOutcome) {
      if (finalConfirmed) {
        judgeTop3 = ([1, 2, 3] as JudgeAwardPlace[]).map((place) => {
          const id = finalByPlace.get(place)!
          return {
            place,
            id,
            title: titleById.get(id) ?? id,
            averageScore: averageById.get(id) ?? null,
            source: 'manual' as const,
            awardLabel: formatConvexTop3Cash(place),
          }
        })
      } else if (aggregate.status === 'clear') {
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

    const sortedJudges = [...configuredJudges].sort()
    const peerVotes: JudgePanelSummary['peerVotes'] = canSeeJudgeOutcome
      ? submissions.map((row) => {
          const scores = sortedJudges.map((judgeEmail) => {
            const match = reviewRows.find(
              (review) =>
                review.submission_id === row.id &&
                review.judge_email.trim().toLowerCase() === judgeEmail,
            )
            return { judgeEmail, score: match?.score ?? null }
          })
          return {
            submissionId: row.id,
            title: row.project_title,
            averageScore: averageById.get(row.id) ?? null,
            scores,
          }
        })
      : null

    const canSeeTeamEmails = privileged
    const aggregateStatusForPublish =
      aggregate.status === 'clear' || aggregate.status === 'needs_decision'
        ? aggregate.status
        : 'incomplete'

    const projects: ProjectGalleryItem[] = submissions.map((row) => {
      const scores = scoresById.get(row.id) ?? []
      const awardPlace = effectiveAwards.get(row.id) ?? null
      const publicMaySeeAward = resultsPublished && awardPlace != null
      const team = galleryTeamPresentation(
        row.name,
        zipTeammateColumns(row.teammate_emails, row.teammate_names),
        canSeeTeamEmails,
      )
      const canEditScore =
        viewerIsJudge && viewerEmail
          ? canEditJudgeScore({
              judgeEmail: viewerEmail,
              submissionId: row.id,
              lockedEmails: lockEmails,
              projectIds,
              reviews,
            })
          : false

      return {
        id: row.id,
        title: row.project_title,
        description: row.project_description,
        githubUrl: row.github_url,
        demoRecordingUrl: row.demo_recording_url,
        liveDemoUrl: row.live_demo_url,
        submitterName: team.submitterName,
        teammateNames: team.teammateNames,
        ...(canSeeTeamEmails ? { teammateEmails: team.teammateEmails } : {}),
        submittedAt:
          typeof row.submitted_at === 'string'
            ? row.submitted_at
            : new Date(row.submitted_at).toISOString(),
        averageScore: canSeeJudgeOutcome ? averageJudgeScore(scores) : null,
        reviewCount: canSeeJudgeOutcome ? scores.length : 0,
        favoriteCount: favoritesById.get(row.id) ?? 0,
        favoritedByMe: myFavorites.has(row.id),
        myScore: myScores.get(row.id) ?? null,
        canEditScore,
        awardPlace: publicMaySeeAward || canSeeJudgeOutcome ? awardPlace : null,
        awardLabel:
          (publicMaySeeAward || canSeeJudgeOutcome) && awardPlace
            ? formatConvexTop3Cash(awardPlace)
            : null,
      }
    })

    const myRatedCount = viewerIsJudge ? myScores.size : 0

    let aggregateStatus: JudgePanelSummary['aggregateStatus'] = 'hidden'
    let aggregateReason: string | null = null
    let ranked: JudgePanelSummary['ranked'] = []
    let needsDecision = false

    if (canSeeJudgeOutcome) {
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

    const judgePanel = privileged
      ? emptyJudgePanel({
          allRated,
          allFinished,
          myFinished,
          finishedCount,
          canFinishScoring:
            viewerIsJudge &&
            Boolean(viewerEmail) &&
            !myFinished &&
            myRatedCount === submissions.length &&
            submissions.length > 0,
          resultsPublished,
          canPublishResults:
            viewerIsAdmin &&
            canPublishJudgeResults({
              allFinished,
              finalConfirmed,
              aggregateStatus: aggregateStatusForPublish,
            }),
          judgeCount: configuredJudges.size,
          projectCount: submissions.length,
          myRatedCount,
          aggregateStatus,
          aggregateReason,
          ranked: canSeeJudgeOutcome ? ranked : [],
          peerVotes,
          top3: judgeTop3,
          needsDecision,
          canSetFinalTop3: canManageFinal && allFinished,
          finalConfirmed,
        })
      : emptyJudgePanel({ resultsPublished })

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

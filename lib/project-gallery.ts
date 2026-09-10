/** Validation and aggregate helpers for the hackathon projects gallery. */

export const MAX_FAVORITES_PER_USER = 3
export const MIN_JUDGE_SCORE = 1
export const MAX_JUDGE_SCORE = 10
/** How many community-vote slots the Projects leaderboard shows. */
export const COMMUNITY_LEADERBOARD_SIZE = 3

export type ScoreValidation =
  | { ok: true; score: number }
  | { ok: false; message: string }

export type CommunityLeaderboardInput = {
  id: string
  title: string
  favoriteCount: number
  /** ISO timestamp; earlier submissions win ties. */
  submittedAt?: string
}

export type CommunityLeaderboardEntry = {
  id: string
  title: string
  favoriteCount: number
  /** 1-based slot after tie-break (exactly one project per slot). */
  rank: number
}

/** Validate a judge score is an integer from 1–10. */
export function validateJudgeScore(raw: unknown): ScoreValidation {
  if (typeof raw === 'string' && raw.trim() !== '') {
    const parsed = Number(raw)
    return validateJudgeScore(parsed)
  }

  if (typeof raw !== 'number' || !Number.isFinite(raw)) {
    return { ok: false, message: 'Score must be a number from 1 to 10.' }
  }

  if (!Number.isInteger(raw)) {
    return { ok: false, message: 'Score must be a whole number from 1 to 10.' }
  }

  if (raw < MIN_JUDGE_SCORE || raw > MAX_JUDGE_SCORE) {
    return {
      ok: false,
      message: `Score must be between ${MIN_JUDGE_SCORE} and ${MAX_JUDGE_SCORE}.`,
    }
  }

  return { ok: true, score: raw }
}

/**
 * Public aggregate: arithmetic mean of judge scores.
 * Returns null when there are no reviews yet.
 * Rounded to one decimal place for display.
 */
export function averageJudgeScore(scores: number[]): number | null {
  if (scores.length === 0) return null
  const sum = scores.reduce((acc, score) => acc + score, 0)
  return Math.round((sum / scores.length) * 10) / 10
}

export function favoriteCapMessage(max = MAX_FAVORITES_PER_USER): string {
  return `You can favorite at most ${max} projects. Unfavorite one before adding another.`
}

/**
 * Rank projects for the community vote leaderboard.
 * Primary: favoriteCount DESC. Ties: earlier submittedAt, then title A–Z.
 * Returns up to `limit` slots (default 3) with dense ranks 1…n after tie-break.
 */
export function rankCommunityLeaderboard(
  projects: CommunityLeaderboardInput[],
  limit = COMMUNITY_LEADERBOARD_SIZE,
): CommunityLeaderboardEntry[] {
  if (limit < 1 || projects.length === 0) return []

  const sorted = [...projects].sort((a, b) => {
    if (b.favoriteCount !== a.favoriteCount) {
      return b.favoriteCount - a.favoriteCount
    }
    const aTime = a.submittedAt ? Date.parse(a.submittedAt) : Number.POSITIVE_INFINITY
    const bTime = b.submittedAt ? Date.parse(b.submittedAt) : Number.POSITIVE_INFINITY
    if (aTime !== bTime) return aTime - bTime
    return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
  })

  return sorted.slice(0, limit).map((project, index) => ({
    id: project.id,
    title: project.title,
    favoriteCount: project.favoriteCount,
    rank: index + 1,
  }))
}

/** How many slots the judge-panel final ranking fills. */
export const JUDGE_TOP3_SIZE = 3

/**
 * Convex credits for the final judge-panel top 3 (1st / 2nd / 3rd).
 * Display amounts; optional claim codes live in CREDIT_CODE_CONVEX_{1ST,2ND,3RD}.
 */
export const CONVEX_TOP3_CREDITS = {
  1: 80_000,
  2: 50_000,
  3: 20_000,
} as const

export type JudgeAwardPlace = 1 | 2 | 3

export const CONVEX_TOP3_CREDIT_ENV: Record<JudgeAwardPlace, string> = {
  1: 'CREDIT_CODE_CONVEX_1ST',
  2: 'CREDIT_CODE_CONVEX_2ND',
  3: 'CREDIT_CODE_CONVEX_3RD',
}

export function formatConvexTop3Credits(place: JudgeAwardPlace): string {
  const amount = CONVEX_TOP3_CREDITS[place]
  return `${amount.toLocaleString('de-DE')} Convex credits`
}

export function getConvexTop3CreditCode(place: JudgeAwardPlace): string | null {
  const envKey = CONVEX_TOP3_CREDIT_ENV[place]
  return process.env[envKey]?.trim() || null
}

export type JudgeScoredProject = {
  id: string
  title: string
  /** Mean of all judge scores for this project (1–10). */
  averageScore: number
}

export type JudgeRankingEntry = JudgeScoredProject & {
  /** Competition rank by average only (ties share the same rank). */
  competitionRank: number
}

export type JudgeAggregateResult =
  | {
      status: 'incomplete'
      ranked: JudgeRankingEntry[]
      reason: string
    }
  | {
      /** Unique 1st/2nd/3rd by strict average gaps — safe to treat as final without override. */
      status: 'clear'
      ranked: JudgeRankingEntry[]
      top3: [JudgeRankingEntry, JudgeRankingEntry, JudgeRankingEntry]
    }
  | {
      /** Ties block a unique top 3; do not invent winners. */
      status: 'needs_decision'
      ranked: JudgeRankingEntry[]
      reason: string
    }

/**
 * Strict “all rated” rule:
 * every configured judge email has submitted a score for every project.
 * Empty judge list or empty project list → not complete.
 */
export function isJudgingComplete(args: {
  judgeEmails: Iterable<string>
  projectIds: Iterable<string>
  /** Pairs of (judgeEmail lowercase, submissionId) that have a score. */
  reviews: Iterable<{ judgeEmail: string; submissionId: string }>
}): boolean {
  const judges = [...new Set([...args.judgeEmails].map((e) => e.trim().toLowerCase()).filter(Boolean))]
  const projects = [...new Set([...args.projectIds])]
  if (judges.length === 0 || projects.length === 0) return false

  const scored = new Set(
    [...args.reviews].map(
      (r) => `${r.judgeEmail.trim().toLowerCase()}::${r.submissionId}`,
    ),
  )

  for (const judge of judges) {
    for (const projectId of projects) {
      if (!scored.has(`${judge}::${projectId}`)) return false
    }
  }
  return true
}

/** Competition ranks: equal averages share a rank; next rank skips (1,2,2,4…). */
export function rankByJudgeAverage(projects: JudgeScoredProject[]): JudgeRankingEntry[] {
  const sorted = [...projects].sort((a, b) => {
    if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore
    return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
  })

  let lastScore: number | null = null
  let lastRank = 0
  return sorted.map((project, index) => {
    if (lastScore === null || project.averageScore !== lastScore) {
      lastRank = index + 1
      lastScore = project.averageScore
    }
    return { ...project, competitionRank: lastRank }
  })
}

/**
 * Decide whether averages alone yield a unique top 3.
 * Clear iff avg(1st) > avg(2nd) > avg(3rd) and (no 4th or avg(3rd) > avg(4th)).
 * Title sort is display-only and never breaks ties for final placement.
 */
export function analyzeJudgeAggregate(
  projects: JudgeScoredProject[],
  opts?: { judgingComplete?: boolean },
): JudgeAggregateResult {
  const ranked = rankByJudgeAverage(projects)

  if (opts?.judgingComplete === false) {
    return {
      status: 'incomplete',
      ranked,
      reason: 'Not every configured judge has scored every project yet.',
    }
  }

  if (ranked.length < JUDGE_TOP3_SIZE) {
    return {
      status: 'needs_decision',
      ranked,
      reason: `Need at least ${JUDGE_TOP3_SIZE} scored projects for a top 3.`,
    }
  }

  const first = ranked[0]!
  const second = ranked[1]!
  const third = ranked[2]!
  const fourth = ranked[3]

  const strictGaps =
    first.averageScore > second.averageScore &&
    second.averageScore > third.averageScore &&
    (fourth == null || third.averageScore > fourth.averageScore)

  if (strictGaps) {
    return {
      status: 'clear',
      ranked,
      top3: [
        { ...first, competitionRank: 1 },
        { ...second, competitionRank: 2 },
        { ...third, competitionRank: 3 },
      ],
    }
  }

  return {
    status: 'needs_decision',
    ranked,
    reason:
      'Average scores are tied in a way that blocks a unique 1st / 2nd / 3rd. Judges must set the final top 3.',
  }
}

export type FinalTop3Validation =
  | { ok: true; places: { place: JudgeAwardPlace; submissionId: string }[] }
  | { ok: false; message: string }

/** Validate three distinct submission IDs for manual final top 3. */
export function validateFinalTop3Ids(
  firstId: unknown,
  secondId: unknown,
  thirdId: unknown,
): FinalTop3Validation {
  const ids = [firstId, secondId, thirdId].map((raw) =>
    typeof raw === 'string' ? raw.trim() : '',
  )

  if (ids.some((id) => !id)) {
    return { ok: false, message: 'firstId, secondId, and thirdId are required.' }
  }

  if (new Set(ids).size !== 3) {
    return { ok: false, message: 'Final top 3 projects must be three distinct submissions.' }
  }

  return {
    ok: true,
    places: [
      { place: 1, submissionId: ids[0]! },
      { place: 2, submissionId: ids[1]! },
      { place: 3, submissionId: ids[2]! },
    ],
  }
}

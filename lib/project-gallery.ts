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
 * Convex cash prize for the final judge-panel top 3 (1st / 2nd / 3rd), in RSD.
 * Display only — not claimable CREDIT_CODE_* promo codes.
 */
export const CONVEX_TOP3_CASH_RSD = {
  1: 80_000,
  2: 50_000,
  3: 20_000,
} as const

export type JudgeAwardPlace = 1 | 2 | 3

export function formatConvexTop3Cash(place: JudgeAwardPlace): string {
  const amount = CONVEX_TOP3_CASH_RSD[place]
  return `${amount.toLocaleString('de-DE')} RSD`
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

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function emailSet(emails: Iterable<string>): Set<string> {
  return new Set([...emails].map(normalizeEmail).filter(Boolean))
}

function reviewKey(judgeEmail: string, submissionId: string): string {
  return `${normalizeEmail(judgeEmail)}::${submissionId}`
}

export function judgeHasScoredAll(args: {
  judgeEmail: string
  projectIds: Iterable<string>
  reviews: Iterable<{ judgeEmail: string; submissionId: string }>
}): boolean {
  return isJudgingComplete({
    judgeEmails: [args.judgeEmail],
    projectIds: args.projectIds,
    reviews: args.reviews,
  })
}

/** Locked and has a score for every current project. */
export function isJudgeScoringFinished(args: {
  judgeEmail: string
  lockedEmails: Iterable<string>
  projectIds: Iterable<string>
  reviews: Iterable<{ judgeEmail: string; submissionId: string }>
}): boolean {
  const email = normalizeEmail(args.judgeEmail)
  if (!email || !emailSet(args.lockedEmails).has(email)) return false
  return judgeHasScoredAll(args)
}

/** Every configured judge has marked scoring finished (and scored every project). */
export function areAllJudgesFinished(args: {
  judgeEmails: Iterable<string>
  lockedEmails: Iterable<string>
  projectIds: Iterable<string>
  reviews: Iterable<{ judgeEmail: string; submissionId: string }>
}): boolean {
  const judges = [...emailSet(args.judgeEmails)]
  const projects = [...new Set([...args.projectIds])]
  if (judges.length === 0 || projects.length === 0) return false
  if (!isJudgingComplete(args)) return false
  const locks = emailSet(args.lockedEmails)
  return judges.every((judge) => locks.has(judge))
}

/**
 * After a judge marks finished, existing scores freeze.
 * A late new project can still be scored (lock no longer covers the full set).
 */
export function canEditJudgeScore(args: {
  judgeEmail: string
  submissionId: string
  lockedEmails: Iterable<string>
  projectIds: Iterable<string>
  reviews: Iterable<{ judgeEmail: string; submissionId: string }>
}): boolean {
  const email = normalizeEmail(args.judgeEmail)
  if (!email) return false
  if (isJudgeScoringFinished(args)) return false

  const locked = emailSet(args.lockedEmails).has(email)
  if (!locked) return true

  const scored = new Set(
    [...args.reviews].map((r) => reviewKey(r.judgeEmail, r.submissionId)),
  )
  return !scored.has(reviewKey(email, args.submissionId))
}

/** Admin may publish only after every judge finished, and a unique top 3 exists. */
export function canPublishJudgeResults(args: {
  allFinished: boolean
  finalConfirmed: boolean
  aggregateStatus: 'clear' | 'needs_decision' | 'incomplete' | 'hidden'
}): boolean {
  if (!args.allFinished) return false
  if (args.finalConfirmed) return true
  return args.aggregateStatus === 'clear'
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
      'Average scores are tied in a way that blocks a unique 1st / 2nd / 3rd. An admin must set the final top 3.',
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

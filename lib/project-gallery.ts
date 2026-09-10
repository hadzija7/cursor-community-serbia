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

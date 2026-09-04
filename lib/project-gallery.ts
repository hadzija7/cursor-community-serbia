/** Validation and aggregate helpers for the hackathon projects gallery. */

export const MAX_FAVORITES_PER_USER = 3
export const MIN_JUDGE_SCORE = 1
export const MAX_JUDGE_SCORE = 10

export type ScoreValidation =
  | { ok: true; score: number }
  | { ok: false; message: string }

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

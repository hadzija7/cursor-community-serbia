/** Judge gate for hackathon project reviews. */

/**
 * Parse `HACKATHON_JUDGE_EMAILS` (comma-separated, case-insensitive).
 * Empty / unset → no judges can score.
 */
export function parseJudgeEmails(raw: string | undefined | null): Set<string> {
  if (!raw?.trim()) return new Set()

  const emails = raw
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 0 && part.includes('@'))

  return new Set(emails)
}

export function getJudgeEmails(): Set<string> {
  return parseJudgeEmails(process.env.HACKATHON_JUDGE_EMAILS)
}

export function isHackathonJudge(email: string | null | undefined): boolean {
  if (!email?.trim()) return false
  return getJudgeEmails().has(email.trim().toLowerCase())
}

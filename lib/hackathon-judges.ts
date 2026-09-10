/** Judge / admin gates for hackathon project reviews. */

/**
 * Parse a comma-separated email allowlist (case-insensitive).
 * Empty / unset → empty set.
 */
export function parseEmailAllowlist(raw: string | undefined | null): Set<string> {
  if (!raw?.trim()) return new Set()

  const emails = raw
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 0 && part.includes('@'))

  return new Set(emails)
}

/** @deprecated Prefer parseEmailAllowlist — kept for existing call sites. */
export function parseJudgeEmails(raw: string | undefined | null): Set<string> {
  return parseEmailAllowlist(raw)
}

export function getJudgeEmails(): Set<string> {
  return parseEmailAllowlist(process.env.HACKATHON_JUDGE_EMAILS)
}

export function getAdminEmails(): Set<string> {
  return parseEmailAllowlist(process.env.HACKATHON_ADMIN_EMAILS)
}

export function isHackathonJudge(email: string | null | undefined): boolean {
  if (!email?.trim()) return false
  return getJudgeEmails().has(email.trim().toLowerCase())
}

export function isHackathonAdmin(email: string | null | undefined): boolean {
  if (!email?.trim()) return false
  return getAdminEmails().has(email.trim().toLowerCase())
}

/** Judges and admins may manage final top-3 after voting is complete. */
export function canManageJudgeFinalTop3(email: string | null | undefined): boolean {
  return isHackathonJudge(email) || isHackathonAdmin(email)
}

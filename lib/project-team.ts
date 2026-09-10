/** Team membership helpers for hackathon project submissions. */

import { MAX_TEAMMATE_EMAILS } from '@/lib/project-submission'

export const MAX_TEAM_SIZE = 1 + MAX_TEAMMATE_EMAILS

export type Teammate = {
  email: string
  name: string
}

export type TeamRow = {
  id: string
  email: string
  name: string | null
  projectTitle: string
  githubUrl: string
  teammateEmails: string[]
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function zipTeammateColumns(
  emails: string[] | null | undefined,
  names: string[] | null | undefined,
): Teammate[] {
  const emailList = Array.isArray(emails) ? emails : []
  const nameList = Array.isArray(names) ? names : []
  return emailList.map((email, index) => ({
    email: normalizeEmail(email),
    name: nameList[index]?.trim() ?? '',
  }))
}

export function teammateEmailsOf(teammates: Teammate[]): string[] {
  return teammates.map((teammate) => teammate.email)
}

export function teammateNamesOf(teammates: Teammate[]): string[] {
  return teammates.map((teammate) => teammate.name)
}

export function publicTeammateNames(teammates: Teammate[]): string[] {
  return teammates.map((teammate) => teammate.name.trim()).filter(Boolean)
}

export function isMemberOfTeam(
  viewerEmail: string,
  row: Pick<TeamRow, 'email' | 'teammateEmails'>,
): boolean {
  const viewer = normalizeEmail(viewerEmail)
  if (!viewer) return false
  if (normalizeEmail(row.email) === viewer) return true
  return row.teammateEmails.some((email) => normalizeEmail(email) === viewer)
}

export function teamRole(
  viewerEmail: string,
  ownerEmail: string,
): 'submitter' | 'teammate' {
  return normalizeEmail(viewerEmail) === normalizeEmail(ownerEmail)
    ? 'submitter'
    : 'teammate'
}

/**
 * Prefer the caller's own submitter row when legacy duplicates exist,
 * otherwise the earliest membership match.
 */
export function pickMembershipRow<T extends Pick<TeamRow, 'email' | 'teammateEmails'>>(
  callerEmail: string,
  rows: T[],
): T | null {
  const caller = normalizeEmail(callerEmail)
  const own = rows.find((row) => normalizeEmail(row.email) === caller)
  if (own) return own
  return rows.find((row) => isMemberOfTeam(caller, row)) ?? null
}

/**
 * Build the teammate list to persist.
 * The original submitter stays owner; they are never stored in teammate_emails.
 * A listed teammate who updates is always kept on the team.
 */
export function teammatesForSave(args: {
  callerEmail: string
  callerName: string | null
  ownerEmail: string
  formTeammates: Teammate[]
}): { ok: true; teammates: Teammate[] } | { ok: false; message: string } {
  const owner = normalizeEmail(args.ownerEmail)
  const caller = normalizeEmail(args.callerEmail)
  const byEmail = new Map<string, string>()

  for (const teammate of args.formTeammates) {
    const email = normalizeEmail(teammate.email)
    if (!email || email === owner) continue
    byEmail.set(email, teammate.name.trim())
  }

  if (caller !== owner) {
    const existingName = byEmail.get(caller)
    byEmail.set(caller, existingName || args.callerName?.trim() || '')
  }

  const teammates = [...byEmail.entries()].map(([email, name]) => ({ email, name }))
  if (teammates.length > MAX_TEAMMATE_EMAILS) {
    return {
      ok: false,
      message: `Teams are 1–${MAX_TEAM_SIZE} people — add at most ${MAX_TEAMMATE_EMAILS} teammates.`,
    }
  }

  for (const teammate of teammates) {
    if (!teammate.name) {
      return {
        ok: false,
        message: 'Each teammate needs a display name (shown on the gallery) and an email.',
      }
    }
  }

  return { ok: true, teammates }
}

export function githubUrlsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function teamMemberEmails(ownerEmail: string, teammateEmails: string[]): string[] {
  const emails = [normalizeEmail(ownerEmail), ...teammateEmails.map(normalizeEmail)]
  return [...new Set(emails.filter(Boolean))]
}

export function describeTeamConflict(args: {
  callerEmail: string
  proposedGithubUrl: string
  proposedMemberEmails: string[]
  conflict: TeamRow
}): { message: string; code: 'membership' | 'github' } {
  if (githubUrlsMatch(args.conflict.githubUrl, args.proposedGithubUrl)) {
    return {
      code: 'github',
      message: `This GitHub repo was already submitted as “${args.conflict.projectTitle}”.`,
    }
  }

  const caller = normalizeEmail(args.callerEmail)
  if (isMemberOfTeam(caller, args.conflict)) {
    return {
      code: 'membership',
      message: `You're already on “${args.conflict.projectTitle}”. Open Submit to update that entry — one project per team.`,
    }
  }

  const conflictMembers = teamMemberEmails(args.conflict.email, args.conflict.teammateEmails)
  const colliding = args.proposedMemberEmails.find((email) =>
    conflictMembers.includes(normalizeEmail(email)),
  )
  const who = colliding && colliding !== caller ? colliding : 'A teammate'

  return {
    code: 'membership',
    message: `${who} is already on “${args.conflict.projectTitle}”. Each person can only be on one project.`,
  }
}

export function galleryTeamPresentation(
  submitterName: string | null,
  teammates: Teammate[],
  includeEmails: boolean,
): {
  submitterName: string | null
  teammateNames: string[]
  teammateEmails?: string[]
} {
  const names = publicTeammateNames(teammates)
  if (!includeEmails) {
    return {
      submitterName: submitterName?.trim() || null,
      teammateNames: names,
    }
  }
  return {
    submitterName: submitterName?.trim() || null,
    teammateNames: names,
    teammateEmails: teammateEmailsOf(teammates),
  }
}

/** Validation helpers for hackathon project submissions. */

const HTTP_URL_PATTERN = /^https?:\/\/.+/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Submitter + teammates; form allows at most this many teammate emails. */
export const MAX_TEAMMATE_EMAILS = 2

const TEAMMATE_NAME_MAX = 80

export type TeammateFields = {
  email: string
  name: string
}

export type ProjectSubmissionInput = {
  projectTitle?: string
  projectDescription?: string
  githubUrl?: string
  demoRecordingUrl?: string
  liveDemoUrl?: string
  /** Optional teammates (max {@link MAX_TEAMMATE_EMAILS}). */
  teammates?: unknown
  /** @deprecated Prefer {@link teammates}. Emails-only payload; names required. */
  teammateEmails?: unknown
}

export type ValidatedProjectSubmission = {
  projectTitle: string
  projectDescription: string
  githubUrl: string
  demoRecordingUrl: string
  liveDemoUrl: string
  teammates: TeammateFields[]
}

export type ValidationFailure = { ok: false; message: string }
export type ValidationSuccess = { ok: true; data: ValidatedProjectSubmission }

const TITLE_MAX = 120
const DESCRIPTION_MAX = 5000

export function isHttpUrl(value: string): boolean {
  if (!HTTP_URL_PATTERN.test(value)) return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isEmailAddress(value: string): boolean {
  return EMAIL_PATTERN.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseTeammatePayload(
  raw: unknown,
): { email: string; name: string }[] | ValidationFailure {
  if (raw === undefined || raw === null || raw === '') {
    return []
  }
  if (!Array.isArray(raw)) {
    return { ok: false, message: 'Teammates must be a list of name and email pairs.' }
  }

  const items: { email: string; name: string }[] = []
  for (const entry of raw) {
    if (typeof entry === 'string') {
      items.push({ email: entry, name: '' })
      continue
    }
    if (!isRecord(entry)) {
      return { ok: false, message: 'Each teammate must include a name and an email.' }
    }
    const email = typeof entry.email === 'string' ? entry.email : String(entry.email ?? '')
    const name = typeof entry.name === 'string' ? entry.name : String(entry.name ?? '')
    items.push({ email, name })
  }
  return items
}

/**
 * Normalize optional teammates: display name + email.
 * Rejects more than {@link MAX_TEAMMATE_EMAILS}, invalid addresses, duplicates,
 * missing names, and the submitter's own email.
 */
export function validateTeammates(
  raw: unknown,
  submitterEmail: string,
): { ok: true; teammates: TeammateFields[] } | ValidationFailure {
  const submitter = submitterEmail.trim().toLowerCase()
  const parsed = parseTeammatePayload(raw)
  if (!Array.isArray(parsed)) {
    return parsed
  }

  const teammates: TeammateFields[] = []
  const seen = new Set<string>()

  for (const candidate of parsed) {
    const email = candidate.email.trim().toLowerCase()
    const name = candidate.name.trim()
    if (!email && !name) continue

    if (!email || !name) {
      return {
        ok: false,
        message: 'Each teammate needs a display name (shown on the gallery) and an email.',
      }
    }
    if (name.length > TEAMMATE_NAME_MAX) {
      return {
        ok: false,
        message: `Teammate names must be ${TEAMMATE_NAME_MAX} characters or fewer.`,
      }
    }
    if (!isEmailAddress(email)) {
      return { ok: false, message: `Invalid teammate email: ${candidate.email.trim()}` }
    }
    if (submitter && email === submitter) {
      return {
        ok: false,
        message: 'Teammate emails cannot include your own email.',
      }
    }
    if (seen.has(email)) {
      return { ok: false, message: 'Teammate emails must be unique.' }
    }
    seen.add(email)
    teammates.push({ email, name })
  }

  if (teammates.length > MAX_TEAMMATE_EMAILS) {
    return {
      ok: false,
      message: `Teams are 1–3 people — add at most ${MAX_TEAMMATE_EMAILS} teammates.`,
    }
  }

  return { ok: true, teammates }
}

export function validateProjectSubmissionFields(
  payload: ProjectSubmissionInput,
  options?: { submitterEmail?: string },
): ValidationSuccess | ValidationFailure {
  const projectTitle = payload.projectTitle?.trim() ?? ''
  const projectDescription = payload.projectDescription?.trim() ?? ''
  const githubUrl = payload.githubUrl?.trim() ?? ''
  const demoRecordingUrl = payload.demoRecordingUrl?.trim() ?? ''
  const liveDemoUrl = payload.liveDemoUrl?.trim() ?? ''

  if (!projectTitle) {
    return { ok: false, message: 'Project title is required.' }
  }
  if (projectTitle.length > TITLE_MAX) {
    return { ok: false, message: `Project title must be ${TITLE_MAX} characters or fewer.` }
  }
  if (!projectDescription) {
    return { ok: false, message: 'Project description is required.' }
  }
  if (projectDescription.length > DESCRIPTION_MAX) {
    return {
      ok: false,
      message: `Project description must be ${DESCRIPTION_MAX} characters or fewer.`,
    }
  }
  if (!githubUrl) {
    return { ok: false, message: 'GitHub repository URL is required.' }
  }
  if (!demoRecordingUrl) {
    return { ok: false, message: 'Demo recording URL is required.' }
  }
  if (!isHttpUrl(demoRecordingUrl)) {
    return {
      ok: false,
      message: 'Demo recording must be a valid http(s) URL (YouTube, Loom, or similar).',
    }
  }
  if (!liveDemoUrl) {
    return { ok: false, message: 'Live demo URL is required.' }
  }
  if (!isHttpUrl(liveDemoUrl)) {
    return { ok: false, message: 'Live demo must be a valid http(s) URL.' }
  }

  const teammates = validateTeammates(
    payload.teammates ?? payload.teammateEmails,
    options?.submitterEmail ?? '',
  )
  if (!teammates.ok) {
    return teammates
  }

  return {
    ok: true,
    data: {
      projectTitle,
      projectDescription,
      githubUrl,
      demoRecordingUrl,
      liveDemoUrl,
      teammates: teammates.teammates,
    },
  }
}

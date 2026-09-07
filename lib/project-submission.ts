/** Validation helpers for hackathon project submissions. */

const HTTP_URL_PATTERN = /^https?:\/\/.+/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Submitter + teammates; form allows at most this many teammate emails. */
export const MAX_TEAMMATE_EMAILS = 2

export type ProjectSubmissionInput = {
  projectTitle?: string
  projectDescription?: string
  githubUrl?: string
  demoRecordingUrl?: string
  liveDemoUrl?: string
  /** Optional teammate emails (max {@link MAX_TEAMMATE_EMAILS}). */
  teammateEmails?: unknown
}

export type ValidatedProjectSubmission = {
  projectTitle: string
  projectDescription: string
  githubUrl: string
  demoRecordingUrl: string
  liveDemoUrl: string
  teammateEmails: string[]
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

/**
 * Normalize optional teammate emails: trim, lowercase, drop blanks.
 * Rejects more than {@link MAX_TEAMMATE_EMAILS}, invalid addresses, duplicates,
 * and the submitter's own email.
 */
export function validateTeammateEmails(
  raw: unknown,
  submitterEmail: string,
): { ok: true; emails: string[] } | ValidationFailure {
  const submitter = submitterEmail.trim().toLowerCase()

  let candidates: string[] = []
  if (raw === undefined || raw === null || raw === '') {
    candidates = []
  } else if (Array.isArray(raw)) {
    candidates = raw.map((value) => (typeof value === 'string' ? value : String(value)))
  } else if (typeof raw === 'string') {
    candidates = raw.split(/[,;\n]+/)
  } else {
    return { ok: false, message: 'Teammate emails must be a list of email addresses.' }
  }

  const emails: string[] = []
  const seen = new Set<string>()

  for (const candidate of candidates) {
    const email = candidate.trim().toLowerCase()
    if (!email) continue

    if (!isEmailAddress(email)) {
      return { ok: false, message: `Invalid teammate email: ${candidate.trim()}` }
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
    emails.push(email)
  }

  if (emails.length > MAX_TEAMMATE_EMAILS) {
    return {
      ok: false,
      message: `Teams are 1–3 people — add at most ${MAX_TEAMMATE_EMAILS} teammates.`,
    }
  }

  return { ok: true, emails }
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

  const teammates = validateTeammateEmails(
    payload.teammateEmails,
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
      teammateEmails: teammates.emails,
    },
  }
}

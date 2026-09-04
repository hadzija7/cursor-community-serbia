/** Validation helpers for hackathon project submissions. */

const HTTP_URL_PATTERN = /^https?:\/\/.+/i

export type ProjectSubmissionInput = {
  projectTitle?: string
  projectDescription?: string
  githubUrl?: string
  demoRecordingUrl?: string
  liveDemoUrl?: string
}

export type ValidatedProjectSubmission = {
  projectTitle: string
  projectDescription: string
  githubUrl: string
  demoRecordingUrl: string
  liveDemoUrl: string
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

export function validateProjectSubmissionFields(
  payload: ProjectSubmissionInput,
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

  return {
    ok: true,
    data: {
      projectTitle,
      projectDescription,
      githubUrl,
      demoRecordingUrl,
      liveDemoUrl,
    },
  }
}

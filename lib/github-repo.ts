/**
 * GitHub repository URL helpers for hackathon project submissions.
 * Validates URL shape and (optionally) that the repo is public via the unauthenticated GitHub API.
 */

const GITHUB_REPO_HOSTS = new Set(['github.com', 'www.github.com'])

export type ParsedGitHubRepo = {
  owner: string
  repo: string
  /** Canonical https://github.com/owner/repo URL (no .git, no trailing slash). */
  canonicalUrl: string
}

/**
 * Parse a GitHub owner/repo URL. Rejects gist, enterprise hosts, and deep paths
 * that are not a repository root (issues, tree, blob, etc. are stripped to owner/repo
 * when the first two path segments look like a repo).
 */
export function parseGitHubRepoUrl(raw: string): ParsedGitHubRepo | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  let url: URL
  try {
    url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`)
  } catch {
    return null
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return null
  }

  const host = url.hostname.toLowerCase()
  if (!GITHUB_REPO_HOSTS.has(host)) {
    return null
  }

  const segments = url.pathname
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean)

  if (segments.length < 2) return null

  const owner = segments[0]
  let repo = segments[1]
  if (!owner || !repo) return null

  // Strip optional .git suffix
  if (repo.endsWith('.git')) {
    repo = repo.slice(0, -4)
  }

  // Basic owner/repo name shape (GitHub allows letters, digits, hyphens, underscores, dots)
  const namePattern = /^[A-Za-z0-9._-]+$/
  if (!namePattern.test(owner) || !namePattern.test(repo) || repo.length === 0) {
    return null
  }

  // Reject clearly non-repo first segments
  if (owner === 'settings' || owner === 'orgs' || owner === 'marketplace') {
    return null
  }

  return {
    owner,
    repo,
    canonicalUrl: `https://github.com/${owner}/${repo}`,
  }
}

export type GitHubPublicCheckResult =
  | { ok: true; canonicalUrl: string }
  | { ok: false; reason: 'invalid_url' | 'not_found' | 'private' | 'api_error' }

/**
 * Confirm the repo exists and is public using the unauthenticated GitHub API.
 * Private repos typically return 404 without a token.
 */
export async function assertPublicGitHubRepo(
  rawUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<GitHubPublicCheckResult> {
  const parsed = parseGitHubRepoUrl(rawUrl)
  if (!parsed) {
    return { ok: false, reason: 'invalid_url' }
  }

  try {
    const response = await fetchImpl(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'cursor-community-serbia-hackathon',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        // Avoid hanging submissions on a slow GitHub
        signal: AbortSignal.timeout(8_000),
      },
    )

    if (response.status === 404) {
      return { ok: false, reason: 'not_found' }
    }

    if (response.status === 403 || response.status === 401) {
      // Rate limit or auth wall — treat as unverifiable rather than private
      // when we cannot distinguish. Prefer rejecting only clear 404/private.
      if (response.status === 401) {
        return { ok: false, reason: 'api_error' }
      }
      // 403 can mean private (with some tokens) or rate limit; without auth
      // private repos are usually 404. Treat remaining 403 as API error.
      return { ok: false, reason: 'api_error' }
    }

    if (!response.ok) {
      return { ok: false, reason: 'api_error' }
    }

    const body = (await response.json()) as { private?: boolean; html_url?: string }
    if (body.private === true) {
      return { ok: false, reason: 'private' }
    }

    return {
      ok: true,
      canonicalUrl: parsed.canonicalUrl,
    }
  } catch {
    return { ok: false, reason: 'api_error' }
  }
}

import { describe, expect, it, vi } from 'vitest'
import {
  assertPublicGitHubRepo,
  parseGitHubRepoUrl,
} from '@/lib/github-repo'
import {
  isHttpUrl,
  validateProjectSubmissionFields,
} from '@/lib/project-submission'

describe('parseGitHubRepoUrl', () => {
  it('accepts canonical and common variants', () => {
    expect(parseGitHubRepoUrl('https://github.com/octocat/Hello-World')).toEqual({
      owner: 'octocat',
      repo: 'Hello-World',
      canonicalUrl: 'https://github.com/octocat/Hello-World',
    })
    expect(parseGitHubRepoUrl('https://www.github.com/octocat/Hello-World.git')).toEqual({
      owner: 'octocat',
      repo: 'Hello-World',
      canonicalUrl: 'https://github.com/octocat/Hello-World',
    })
    expect(parseGitHubRepoUrl('github.com/octocat/Hello-World')).toEqual({
      owner: 'octocat',
      repo: 'Hello-World',
      canonicalUrl: 'https://github.com/octocat/Hello-World',
    })
  })

  it('rejects non-GitHub and incomplete URLs', () => {
    expect(parseGitHubRepoUrl('https://gitlab.com/octocat/Hello-World')).toBeNull()
    expect(parseGitHubRepoUrl('https://github.com/octocat')).toBeNull()
    expect(parseGitHubRepoUrl('not a url')).toBeNull()
    expect(parseGitHubRepoUrl('')).toBeNull()
  })
})

describe('assertPublicGitHubRepo', () => {
  it('returns not_found for 404 responses', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('', { status: 404 }))
    const result = await assertPublicGitHubRepo(
      'https://github.com/octocat/missing-repo',
      fetchImpl,
    )
    expect(result).toEqual({ ok: false, reason: 'not_found' })
  })

  it('returns private when API marks the repo private', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ private: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const result = await assertPublicGitHubRepo(
      'https://github.com/octocat/private-repo',
      fetchImpl,
    )
    expect(result).toEqual({ ok: false, reason: 'private' })
  })

  it('returns canonical URL for a public repo', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ private: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const result = await assertPublicGitHubRepo(
      'https://github.com/octocat/Hello-World.git',
      fetchImpl,
    )
    expect(result).toEqual({
      ok: true,
      canonicalUrl: 'https://github.com/octocat/Hello-World',
    })
  })

  it('returns invalid_url for bad shapes without calling the API', async () => {
    const fetchImpl = vi.fn()
    const result = await assertPublicGitHubRepo('https://example.com/not-github', fetchImpl)
    expect(result).toEqual({ ok: false, reason: 'invalid_url' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})

describe('validateProjectSubmissionFields', () => {
  it('requires all fields and http(s) demo URLs', () => {
    expect(
      validateProjectSubmissionFields({
        projectTitle: 'X',
        projectDescription: 'Y',
        githubUrl: 'https://github.com/a/b',
        demoRecordingUrl: 'ftp://bad',
        liveDemoUrl: 'https://demo.example',
      }).ok,
    ).toBe(false)

    expect(isHttpUrl('https://loom.com/share/abc')).toBe(true)
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)

    const ok = validateProjectSubmissionFields({
      projectTitle: 'X',
      projectDescription: 'Y',
      githubUrl: 'https://github.com/a/b',
      demoRecordingUrl: 'https://www.loom.com/share/abc',
      liveDemoUrl: 'https://demo.example',
    })
    expect(ok.ok).toBe(true)
  })
})

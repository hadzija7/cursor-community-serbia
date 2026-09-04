import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/hackathon-checkin', () => ({
  assertCheckedIn: vi.fn(),
}))

vi.mock('@/lib/github-repo', async () => {
  const actual = await vi.importActual<typeof import('@/lib/github-repo')>('@/lib/github-repo')
  return {
    ...actual,
    assertPublicGitHubRepo: vi.fn(),
  }
})

import { auth } from '@/lib/auth'
import { POST } from '@/app/api/hackathon/submit/route'
import * as db from '@/lib/db'
import { assertCheckedIn } from '@/lib/hackathon-checkin'
import { assertPublicGitHubRepo } from '@/lib/github-repo'

const ORIGINAL_ENV = process.env

const validBody = {
  projectTitle: 'Demo Bot',
  projectDescription: 'A short demo of our hackathon project.',
  githubUrl: 'https://github.com/octocat/Hello-World',
  demoRecordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  liveDemoUrl: 'https://demo.example.com',
}

function buildRequest(body: Record<string, string | undefined>) {
  return new Request('http://localhost/api/hackathon/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/hackathon/submit', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue(null)
    vi.mocked(assertCheckedIn).mockResolvedValue(null)
    vi.mocked(assertPublicGitHubRepo).mockResolvedValue({
      ok: true,
      canonicalUrl: 'https://github.com/octocat/Hello-World',
    })
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const response = await POST(buildRequest(validBody))
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(401)
    expect(body.ok).toBe(false)
    expect(body.message).toContain('Not authenticated')
  })

  it('returns 403 when registered but not checked in', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com', name: 'Hacker' },
      expires: '2099-01-01',
    })
    vi.mocked(assertCheckedIn).mockResolvedValue(
      NextResponse.json(
        {
          error: 'Check in at the event first before submitting your project',
          lumaStatus: 'registered',
        },
        { status: 403 },
      ),
    )

    const response = await POST(buildRequest(validBody))
    const body = (await response.json()) as { error: string; lumaStatus: string }

    expect(response.status).toBe(403)
    expect(body.error).toMatch(/check in/i)
    expect(body.lumaStatus).toBe('registered')
  })

  it('returns 400 for invalid field payloads', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })

    const response = await POST(
      buildRequest({
        projectTitle: '',
        projectDescription: 'desc',
        githubUrl: 'https://github.com/a/b',
        demoRecordingUrl: 'https://youtube.com/x',
        liveDemoUrl: 'https://demo.example',
      }),
    )
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(400)
    expect(body.ok).toBe(false)
  })

  it('rejects when GitHub repo is not public', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })
    vi.mocked(assertPublicGitHubRepo).mockResolvedValue({
      ok: false,
      reason: 'not_found',
    })

    const response = await POST(buildRequest(validBody))
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(400)
    expect(body.message).toMatch(/not found|public/i)
  })

  it('upserts a valid submission for a checked-in user', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'Hacker@Example.com', name: 'Ada' },
      expires: '2099-01-01',
    })

    const insert = vi.fn().mockResolvedValue([
      {
        id: '11111111-1111-1111-1111-111111111111',
        submitted_at: '2026-09-04T12:00:00.000Z',
        updated_at: '2026-09-04T12:00:00.000Z',
      },
    ])
    vi.spyOn(db, 'getDb').mockReturnValue(insert as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest(validBody))
    const body = (await response.json()) as { ok: boolean; id: string }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.id).toBe('11111111-1111-1111-1111-111111111111')
    expect(assertCheckedIn).toHaveBeenCalledWith(
      'hacker@example.com',
      expect.stringMatching(/check in/i),
    )
    expect(insert).toHaveBeenCalled()
  })

  it('returns 503 when database is not configured', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })
    vi.spyOn(db, 'getDb').mockReturnValue(null)

    const response = await POST(buildRequest(validBody))
    expect(response.status).toBe(503)
  })
})

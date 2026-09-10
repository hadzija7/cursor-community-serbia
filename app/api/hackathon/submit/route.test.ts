import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/hackathon-checkin', () => ({
  assertCheckedIn: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { GET, POST } from '@/app/api/hackathon/submit/route'
import * as db from '@/lib/db'
import { assertCheckedIn } from '@/lib/hackathon-checkin'

const ORIGINAL_ENV = process.env

const validBody = {
  projectTitle: 'Demo Bot',
  projectDescription: 'A short demo of our hackathon project.',
  githubUrl: 'https://github.com/octocat/Hello-World',
  demoRecordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  liveDemoUrl: 'https://demo.example.com',
}

function buildRequest(body: Record<string, unknown>) {
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

  it('rejects non-GitHub repository URLs', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })

    const response = await POST(
      buildRequest({
        ...validBody,
        githubUrl: 'https://gitlab.com/octocat/Hello-World',
      }),
    )
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(400)
    expect(body.message).toMatch(/github\.com\/owner\/repo/i)
  })

  it('upserts a valid submission for a checked-in user', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'Hacker@Example.com', name: 'Ada' },
      expires: '2099-01-01',
    })

    const sql = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: '11111111-1111-1111-1111-111111111111',
          submitted_at: '2026-09-04T12:00:00.000Z',
          updated_at: '2026-09-04T12:00:00.000Z',
        },
      ])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(
      buildRequest({
        ...validBody,
        teammates: [{ email: 'mate@example.com', name: 'Mate' }],
      }),
    )
    const body = (await response.json()) as { ok: boolean; id: string }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.id).toBe('11111111-1111-1111-1111-111111111111')
    expect(assertCheckedIn).toHaveBeenCalledWith(
      'hacker@example.com',
      expect.stringMatching(/check in/i),
    )
    expect(sql).toHaveBeenCalledTimes(4)
  })

  it('rejects submissions after an admin closes the form', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com', name: 'Hacker' },
      expires: '2099-01-01',
    })
    const sql = vi.fn().mockResolvedValueOnce([{ closed: true }])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest(validBody))
    const body = (await response.json()) as { code?: string }

    expect(response.status).toBe(409)
    expect(body.code).toBe('SUBMISSIONS_CLOSED')
    expect(sql).toHaveBeenCalledTimes(1)
  })

  it('updates the existing team row when a listed teammate submits', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'mate@example.com', name: 'Mate' },
      expires: '2099-01-01',
    })

    const existing = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'hacker@example.com',
      name: 'Ada',
      project_title: 'Demo Bot',
      project_description: 'A short demo',
      github_url: 'https://github.com/octocat/Hello-World',
      demo_recording_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      live_demo_url: 'https://demo.example.com',
      teammate_emails: ['mate@example.com'],
      teammate_names: ['Mate'],
      submitted_at: '2026-09-04T12:00:00.000Z',
      updated_at: '2026-09-04T12:00:00.000Z',
    }
    const sql = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([existing])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: existing.id,
          submitted_at: existing.submitted_at,
          updated_at: '2026-09-04T13:00:00.000Z',
        },
      ])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest(validBody))
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.message).toMatch(/updated/i)
    expect(sql).toHaveBeenCalledTimes(4)
  })

  it('rejects listing a teammate who is already on another project', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'mate@example.com', name: 'Mate' },
      expires: '2099-01-01',
    })

    const existing = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'hacker@example.com',
      name: 'Ada',
      project_title: 'Demo Bot',
      github_url: 'https://github.com/octocat/Hello-World',
      teammate_emails: ['mate@example.com'],
    }
    const sql = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([existing])
      .mockResolvedValueOnce([
        {
          ...existing,
          project_title: 'Other Bot',
          github_url: 'https://github.com/other/repo',
          teammate_emails: [],
          email: 'cara@example.com',
        },
      ])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(
      buildRequest({
        ...validBody,
        githubUrl: 'https://github.com/mate/new-project',
        teammates: [{ email: 'cara@example.com', name: 'Cara' }],
      }),
    )
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(409)
    expect(body.message).toMatch(/already on/i)
    expect(sql).toHaveBeenCalledTimes(3)
  })

  it('rejects a GitHub repo that already belongs to another team', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'new@example.com', name: 'Cara' },
      expires: '2099-01-01',
    })
    const sql = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'hacker@example.com',
          name: 'Ada',
          project_title: 'Demo Bot',
          github_url: 'https://github.com/octocat/Hello-World',
          teammate_emails: [],
        },
      ])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest(validBody))
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(409)
    expect(body.message).toMatch(/GitHub repo/i)
    expect(sql).toHaveBeenCalledTimes(3)
  })

  it('rejects more than two teammate emails', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })

    const response = await POST(
      buildRequest({
        ...validBody,
        teammates: [
          { email: 'a@x.com', name: 'A' },
          { email: 'b@x.com', name: 'B' },
          { email: 'c@x.com', name: 'C' },
        ],
      }),
    )
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(400)
    expect(body.message).toMatch(/1–3|teammates/i)
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

describe('GET /api/hackathon/submit', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue(null)
    vi.mocked(assertCheckedIn).mockResolvedValue(null)
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when not authenticated', async () => {
    const response = await GET()
    expect(response.status).toBe(401)
  })

  it('returns null submission when none exists', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })
    const sql = vi.fn().mockResolvedValueOnce([])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await GET()
    const body = (await response.json()) as {
      ok: boolean
      submission: unknown
    }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.submission).toBeNull()
  })

  it('returns the existing submission for prefill', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'Hacker@Example.com' },
      expires: '2099-01-01',
    })
    const sql = vi.fn().mockResolvedValueOnce([
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'hacker@example.com',
        name: 'Ada',
        project_title: 'Demo Bot',
        project_description: 'A short demo',
        github_url: 'https://github.com/octocat/Hello-World',
        demo_recording_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        live_demo_url: 'https://demo.example.com',
        teammate_emails: ['mate@example.com'],
        teammate_names: ['Mate'],
        submitted_at: '2026-09-04T12:00:00.000Z',
        updated_at: '2026-09-04T13:00:00.000Z',
      },
    ])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await GET()
    const body = (await response.json()) as {
      ok: boolean
      submission: {
        projectTitle: string
        teammates: Array<{ email: string; name: string }>
        role: string
        githubUrl: string
      }
    }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.submission.projectTitle).toBe('Demo Bot')
    expect(body.submission.githubUrl).toBe('https://github.com/octocat/Hello-World')
    expect(body.submission.teammates).toEqual([{ email: 'mate@example.com', name: 'Mate' }])
    expect(body.submission.role).toBe('submitter')
    expect(assertCheckedIn).toHaveBeenCalled()
  })

  it('returns the team row when the caller is a listed teammate', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'mate@example.com' },
      expires: '2099-01-01',
    })
    const sql = vi.fn().mockResolvedValueOnce([
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'hacker@example.com',
        name: 'Ada',
        project_title: 'Demo Bot',
        project_description: 'A short demo',
        github_url: 'https://github.com/octocat/Hello-World',
        demo_recording_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        live_demo_url: 'https://demo.example.com',
        teammate_emails: ['mate@example.com'],
        teammate_names: ['Mate'],
        submitted_at: '2026-09-04T12:00:00.000Z',
        updated_at: '2026-09-04T13:00:00.000Z',
      },
    ])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await GET()
    const body = (await response.json()) as {
      ok: boolean
      submission: { role: string; submitterName: string | null }
    }

    expect(response.status).toBe(200)
    expect(body.submission.role).toBe('teammate')
    expect(body.submission.submitterName).toBe('Ada')
  })
})

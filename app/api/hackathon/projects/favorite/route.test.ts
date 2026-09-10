import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/hackathon-checkin', () => ({
  assertCheckedIn: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { assertCheckedIn } from '@/lib/hackathon-checkin'
import { POST } from '@/app/api/hackathon/projects/favorite/route'
import * as db from '@/lib/db'

const ORIGINAL_ENV = process.env
const SUBMISSION_ID = '11111111-1111-1111-1111-111111111111'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/hackathon/projects/favorite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/hackathon/projects/favorite', () => {
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
    const response = await POST(buildRequest({ submissionId: SUBMISSION_ID }))
    expect(response.status).toBe(401)
    expect(assertCheckedIn).not.toHaveBeenCalled()
  })

  it('returns 403 when signed in but not checked in', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'voter@example.com' },
      expires: '2099-01-01',
    })
    vi.mocked(assertCheckedIn).mockResolvedValue(
      NextResponse.json(
        {
          error: 'Check in at the event first before favoriting projects',
          lumaStatus: 'registered',
        },
        { status: 403 },
      ),
    )

    const response = await POST(
      buildRequest({ submissionId: SUBMISSION_ID, favorited: true }),
    )
    const body = (await response.json()) as {
      message: string
      code?: string
      lumaStatus?: string
    }

    expect(response.status).toBe(403)
    expect(body.code).toBe('NOT_CHECKED_IN')
    expect(body.lumaStatus).toBe('registered')
    expect(body.message).toMatch(/check in/i)
  })

  it('rejects a 4th favorite with a clear cap error', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'voter@example.com' },
      expires: '2099-01-01',
    })

    const sql = vi
      .fn()
      // submission exists
      .mockResolvedValueOnce([{ id: SUBMISSION_ID }])
      // not already favorited
      .mockResolvedValueOnce([])
      // atomic insert blocked by cap
      .mockResolvedValueOnce([{ favorite_count: 3, favorited: false }])

    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(
      buildRequest({ submissionId: SUBMISSION_ID, favorited: true }),
    )
    const body = (await response.json()) as {
      message: string
      code?: string
      maxFavorites?: number
    }

    expect(response.status).toBe(409)
    expect(body.code).toBe('FAVORITE_CAP')
    expect(body.maxFavorites).toBe(3)
    expect(body.message).toMatch(/at most 3/i)
  })

  it('adds a favorite when under the cap', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'voter@example.com' },
      expires: '2099-01-01',
    })

    const sql = vi
      .fn()
      .mockResolvedValueOnce([{ id: SUBMISSION_ID }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ favorite_count: 3, favorited: true }])

    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(
      buildRequest({ submissionId: SUBMISSION_ID, favorited: true }),
    )
    const body = (await response.json()) as {
      ok: boolean
      favorited: boolean
      favoriteCount: number
    }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.favorited).toBe(true)
    expect(body.favoriteCount).toBe(3)
    expect(assertCheckedIn).toHaveBeenCalledWith(
      'voter@example.com',
      expect.stringMatching(/check in/i),
    )
  })

  it('removes an existing favorite', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'voter@example.com' },
      expires: '2099-01-01',
    })

    const sql = vi
      .fn()
      .mockResolvedValueOnce([{ id: SUBMISSION_ID }])
      .mockResolvedValueOnce([{ id: 'fav-1' }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ count: 1 }])

    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(
      buildRequest({ submissionId: SUBMISSION_ID, favorited: false }),
    )
    const body = (await response.json()) as { favorited: boolean; favoriteCount: number }

    expect(response.status).toBe(200)
    expect(body.favorited).toBe(false)
    expect(body.favoriteCount).toBe(1)
  })
})

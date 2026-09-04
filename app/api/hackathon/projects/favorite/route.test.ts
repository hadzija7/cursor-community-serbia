import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { auth } from '@/lib/auth'
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
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when not authenticated', async () => {
    const response = await POST(buildRequest({ submissionId: SUBMISSION_ID }))
    expect(response.status).toBe(401)
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
      // current favorite count = 3
      .mockResolvedValueOnce([{ count: 3 }])

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
      .mockResolvedValueOnce([{ count: 2 }])
      .mockResolvedValueOnce([])

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

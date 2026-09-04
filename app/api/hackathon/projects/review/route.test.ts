import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { POST } from '@/app/api/hackathon/projects/review/route'
import * as db from '@/lib/db'

const ORIGINAL_ENV = process.env

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/hackathon/projects/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/hackathon/projects/review', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, HACKATHON_JUDGE_EMAILS: 'judge@example.com' }
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue(null)
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when not authenticated', async () => {
    const response = await POST(buildRequest({ submissionId: 'x', score: 8 }))
    expect(response.status).toBe(401)
  })

  it('returns 403 when signed-in user is not a judge', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })

    const response = await POST(
      buildRequest({
        submissionId: '11111111-1111-1111-1111-111111111111',
        score: 8,
      }),
    )
    const body = (await response.json()) as { message: string }

    expect(response.status).toBe(403)
    expect(body.message).toMatch(/judges/i)
  })

  it('rejects scores outside 1–10', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'judge@example.com' },
      expires: '2099-01-01',
    })

    const response = await POST(
      buildRequest({
        submissionId: '11111111-1111-1111-1111-111111111111',
        score: 11,
      }),
    )
    const body = (await response.json()) as { message: string }

    expect(response.status).toBe(400)
    expect(body.message).toMatch(/1.*10|between/i)
  })

  it('upserts a valid score for a judge', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'Judge@Example.com' },
      expires: '2099-01-01',
    })

    const sql = vi
      .fn()
      .mockResolvedValueOnce([{ id: '11111111-1111-1111-1111-111111111111' }])
      .mockResolvedValueOnce([
        {
          id: 'review-1',
          score: 9,
          updated_at: '2026-09-04T12:00:00.000Z',
        },
      ])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(
      buildRequest({
        submissionId: '11111111-1111-1111-1111-111111111111',
        score: 9,
      }),
    )
    const body = (await response.json()) as { ok: boolean; score: number }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.score).toBe(9)
    expect(sql).toHaveBeenCalledTimes(2)
  })
})

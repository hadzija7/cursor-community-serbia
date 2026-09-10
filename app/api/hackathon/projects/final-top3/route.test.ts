import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { POST } from '@/app/api/hackathon/projects/final-top3/route'
import * as db from '@/lib/db'

const ORIGINAL_ENV = process.env

const P1 = '11111111-1111-1111-1111-111111111111'
const P2 = '22222222-2222-2222-2222-222222222222'
const P3 = '33333333-3333-3333-3333-333333333333'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/hackathon/projects/final-top3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/hackathon/projects/final-top3', () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      HACKATHON_JUDGE_EMAILS: 'judge@example.com,other@example.com',
      HACKATHON_ADMIN_EMAILS: 'admin@example.com',
    }
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue(null)
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when not authenticated', async () => {
    const response = await POST(buildRequest({ firstId: P1, secondId: P2, thirdId: P3 }))
    expect(response.status).toBe(401)
  })

  it('returns 403 for non-judge non-admin', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })
    const response = await POST(buildRequest({ firstId: P1, secondId: P2, thirdId: P3 }))
    expect(response.status).toBe(403)
  })

  it('returns 403 for a judge who is not an admin', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'judge@example.com' },
      expires: '2099-01-01',
    })
    const response = await POST(buildRequest({ firstId: P1, secondId: P2, thirdId: P3 }))
    expect(response.status).toBe(403)
  })

  it('rejects duplicate place ids', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'admin@example.com' },
      expires: '2099-01-01',
    })
    const response = await POST(buildRequest({ firstId: P1, secondId: P1, thirdId: P3 }))
    expect(response.status).toBe(400)
  })

  it('rejects when judging is incomplete', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'admin@example.com' },
      expires: '2099-01-01',
    })

    const sql = vi
      .fn()
      .mockResolvedValueOnce([{ id: P1 }, { id: P2 }, { id: P3 }])
      // Only one judge scored — incomplete for two configured judges
      .mockResolvedValueOnce([
        { submission_id: P1, judge_email: 'judge@example.com' },
        { submission_id: P2, judge_email: 'judge@example.com' },
        { submission_id: P3, judge_email: 'judge@example.com' },
      ])
      .mockResolvedValueOnce([])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ firstId: P1, secondId: P2, thirdId: P3 }))
    const body = (await response.json()) as { code?: string }
    expect(response.status).toBe(409)
    expect(body.code).toBe('JUDGING_INCOMPLETE')
  })

  it('saves final top 3 when all judges have rated', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'Admin@Example.com' },
      expires: '2099-01-01',
    })

    const reviews = [P1, P2, P3].flatMap((id) => [
      { submission_id: id, judge_email: 'judge@example.com' },
      { submission_id: id, judge_email: 'other@example.com' },
    ])

    const sql = vi
      .fn()
      .mockResolvedValueOnce([{ id: P1 }, { id: P2 }, { id: P3 }])
      .mockResolvedValueOnce(reviews)
      .mockResolvedValueOnce([
        { judge_email: 'judge@example.com' },
        { judge_email: 'other@example.com' },
      ])
      .mockResolvedValueOnce([]) // atomic DELETE + INSERT CTE
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ firstId: P1, secondId: P2, thirdId: P3 }))
    const body = (await response.json()) as {
      ok: boolean
      top3: Array<{ place: number; awardLabel: string }>
    }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.top3.map((t) => t.place)).toEqual([1, 2, 3])
    expect(body.top3[0]?.awardLabel).toBe('80.000 RSD')
    expect(sql).toHaveBeenCalledTimes(4)
    const writeSql = String(sql.mock.calls[3]?.[0]?.join?.('') ?? sql.mock.calls[3]?.[0] ?? '')
    expect(writeSql).toMatch(/DELETE FROM hackathon_judge_final_top3/i)
    expect(writeSql).toMatch(/INSERT INTO hackathon_judge_final_top3/i)
  })

  it('rejects when every judge scored but not all have marked finished', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'admin@example.com' },
      expires: '2099-01-01',
    })

    const reviews = [P1, P2, P3].flatMap((id) => [
      { submission_id: id, judge_email: 'judge@example.com' },
      { submission_id: id, judge_email: 'other@example.com' },
    ])

    const sql = vi
      .fn()
      .mockResolvedValueOnce([{ id: P1 }, { id: P2 }, { id: P3 }])
      .mockResolvedValueOnce(reviews)
      .mockResolvedValueOnce([{ judge_email: 'judge@example.com' }])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ firstId: P1, secondId: P2, thirdId: P3 }))
    const body = (await response.json()) as { code?: string }
    expect(response.status).toBe(409)
    expect(body.code).toBe('JUDGING_INCOMPLETE')
  })
})

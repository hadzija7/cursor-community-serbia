import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { POST } from '@/app/api/hackathon/projects/finish-scoring/route'
import * as db from '@/lib/db'

const ORIGINAL_ENV = process.env
const P1 = '11111111-1111-1111-1111-111111111111'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/hackathon/projects/finish-scoring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/hackathon/projects/finish-scoring', () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      HACKATHON_JUDGE_EMAILS: 'judge@example.com',
      HACKATHON_ADMIN_EMAILS: 'admin@example.com',
    }
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue(null)
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when not authenticated', async () => {
    const response = await POST(buildRequest({ finished: true }))
    expect(response.status).toBe(401)
  })

  it('returns 403 for a non-judge', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })
    const response = await POST(buildRequest({ finished: true }))
    expect(response.status).toBe(403)
  })

  it('rejects finish when the judge has not scored every project', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'judge@example.com' },
      expires: '2099-01-01',
    })
    const sql = vi
      .fn()
      .mockResolvedValueOnce([{ id: P1 }, { id: '22222222-2222-2222-2222-222222222222' }])
      .mockResolvedValueOnce([{ submission_id: P1, judge_email: 'judge@example.com' }])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ finished: true }))
    const body = (await response.json()) as { code?: string }
    expect(response.status).toBe(409)
    expect(body.code).toBe('SCORES_INCOMPLETE')
  })

  it('locks scoring when the judge has scored every project', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'Judge@Example.com' },
      expires: '2099-01-01',
    })
    const sql = vi
      .fn()
      .mockResolvedValueOnce([{ id: P1 }])
      .mockResolvedValueOnce([{ submission_id: P1, judge_email: 'judge@example.com' }])
      .mockResolvedValueOnce([])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ finished: true }))
    const body = (await response.json()) as { ok: boolean; finished?: boolean }
    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.finished).toBe(true)
  })

  it('lets an admin reopen a judge lock', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'admin@example.com' },
      expires: '2099-01-01',
    })
    const sql = vi.fn().mockResolvedValueOnce([])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(
      buildRequest({ finished: false, judgeEmail: 'judge@example.com' }),
    )
    const body = (await response.json()) as { ok: boolean; finished?: boolean }
    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.finished).toBe(false)
  })
})

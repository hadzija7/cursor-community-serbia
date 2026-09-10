import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { POST } from '@/app/api/hackathon/projects/publish-results/route'
import * as db from '@/lib/db'

const ORIGINAL_ENV = process.env
const P1 = '11111111-1111-1111-1111-111111111111'
const P2 = '22222222-2222-2222-2222-222222222222'
const P3 = '33333333-3333-3333-3333-333333333333'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/hackathon/projects/publish-results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/hackathon/projects/publish-results', () => {
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

  it('returns 403 for a judge who is not an admin', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'judge@example.com' },
      expires: '2099-01-01',
    })
    const response = await POST(buildRequest({ published: true }))
    expect(response.status).toBe(403)
  })

  it('lets an admin unpublish without waiting on judges', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'admin@example.com' },
      expires: '2099-01-01',
    })
    const sql = vi.fn().mockResolvedValueOnce([])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ published: false }))
    const body = (await response.json()) as { ok: boolean; published?: boolean }
    expect(response.status).toBe(200)
    expect(body.published).toBe(false)
  })

  it('rejects publish before every judge has finished', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'admin@example.com' },
      expires: '2099-01-01',
    })
    const sql = vi
      .fn()
      .mockResolvedValueOnce([
        { id: P1, project_title: 'A' },
        { id: P2, project_title: 'B' },
        { id: P3, project_title: 'C' },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ published: true }))
    const body = (await response.json()) as { code?: string }
    expect(response.status).toBe(409)
    expect(body.code).toBe('JUDGES_NOT_FINISHED')
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { GET, POST } from '@/app/api/hackathon/submit/gate/route'
import * as db from '@/lib/db'

const ORIGINAL_ENV = process.env

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/hackathon/submit/gate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('GET /api/hackathon/submit/gate', () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      HACKATHON_ADMIN_EMAILS: 'admin@example.com',
    }
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue(null)
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns open by default when no gate row exists', async () => {
    const sql = vi.fn().mockResolvedValueOnce([])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await GET()
    const body = (await response.json()) as {
      submissionsOpen: boolean
      isAdmin: boolean
    }

    expect(response.status).toBe(200)
    expect(body.submissionsOpen).toBe(true)
    expect(body.isAdmin).toBe(false)
  })

  it('marks the signed-in admin', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'Admin@Example.com' },
      expires: '2099-01-01',
    })
    const sql = vi.fn().mockResolvedValueOnce([{ closed: true }])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await GET()
    const body = (await response.json()) as {
      submissionsOpen: boolean
      isAdmin: boolean
    }

    expect(body.submissionsOpen).toBe(false)
    expect(body.isAdmin).toBe(true)
  })
})

describe('POST /api/hackathon/submit/gate', () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      HACKATHON_ADMIN_EMAILS: 'admin@example.com',
    }
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue(null)
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 403 for a non-admin', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'hacker@example.com' },
      expires: '2099-01-01',
    })
    const response = await POST(buildRequest({ closed: true }))
    expect(response.status).toBe(403)
  })

  it('lets an admin close submissions', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'admin@example.com' },
      expires: '2099-01-01',
    })
    const sql = vi.fn().mockResolvedValueOnce([])
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ closed: true }))
    const body = (await response.json()) as {
      ok: boolean
      closed?: boolean
      submissionsOpen?: boolean
    }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.closed).toBe(true)
    expect(body.submissionsOpen).toBe(false)
  })
})

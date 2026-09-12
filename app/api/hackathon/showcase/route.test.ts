import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { auth } from '@/lib/auth'
import { DELETE, GET, POST } from '@/app/api/hackathon/showcase/route'
import * as db from '@/lib/db'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/hackathon/showcase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function queryText(strings: TemplateStringsArray): string {
  return strings.join(' ')
}

function mockSql(handler: (query: string) => unknown[]) {
  const sql = vi.fn(async (strings: TemplateStringsArray) => handler(queryText(strings)))
  return sql
}

describe('/api/hackathon/showcase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('GET returns 503 when the database is missing', async () => {
    vi.spyOn(db, 'getDb').mockReturnValue(null)
    const response = await GET()
    expect(response.status).toBe(503)
  })

  it('GET returns the merged agenda and the viewer booking', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'Host@Example.com' },
      expires: '2099-01-01',
    })
    const sql = mockSql((query) => {
      if (query.includes('SELECT slot_index')) {
        return [
          { slot_index: 0, team_name: 'Baro', submitted_email: 'host@example.com' },
          { slot_index: 2, team_name: 'Other', submitted_email: 'other@example.com' },
        ]
      }
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await GET()
    const body = (await response.json()) as {
      remaining: number
      signedIn: boolean
      myBooking: { index: number; teamName: string } | null
      slots: Array<{ index: number; teamName: string | null; open: boolean; startsAt: string }>
    }

    expect(response.status).toBe(200)
    expect(body.signedIn).toBe(true)
    expect(body.remaining).toBe(10)
    expect(body.myBooking).toMatchObject({ index: 0, teamName: 'Baro' })
    expect(body.slots[2]).toMatchObject({ teamName: 'Other', open: false })
  })

  it('POST rejects an empty team name', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'host@example.com' },
      expires: '2099-01-01',
    })
    const response = await POST(buildRequest({ teamName: '  ', slotIndex: 0 }))
    expect(response.status).toBe(400)
  })

  it('POST rejects guests', async () => {
    const response = await POST(buildRequest({ teamName: 'Baro', slotIndex: 1 }))
    expect(response.status).toBe(401)
  })

  it('POST books the chosen free slot', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'host@example.com' },
      expires: '2099-01-01',
    })
    const sql = mockSql((query) => {
      if (query.includes('INSERT INTO')) {
        return [{ slot_index: 1, team_name: 'Baro Team', submitted_email: 'host@example.com' }]
      }
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ teamName: '  Baro Team  ', slotIndex: 1 }))
    const body = (await response.json()) as {
      ok: boolean
      alreadyBooked: boolean
      slot: { index: number; label: string; teamName: string }
    }

    expect(response.status).toBe(200)
    expect(body).toMatchObject({
      ok: true,
      alreadyBooked: false,
      slot: {
        index: 1,
        label: '17:10 – 17:20',
        teamName: 'Baro Team',
      },
    })
  })

  it('POST moves the viewer to another free slot', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'host@example.com' },
      expires: '2099-01-01',
    })
    const sql = mockSql((query) => {
      if (query.includes('lower(submitted_email)') && query.includes('SELECT')) {
        return [{ slot_index: 0, team_name: 'Baro Team', submitted_email: 'host@example.com' }]
      }
      if (query.includes('UPDATE')) {
        return [{ slot_index: 4, team_name: 'Baro Team', submitted_email: 'host@example.com' }]
      }
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ teamName: 'Baro Team', slotIndex: 4 }))
    const body = (await response.json()) as { moved: boolean; slot: { label: string } }

    expect(response.status).toBe(200)
    expect(body.moved).toBe(true)
    expect(body.slot.label).toBe('17:40 – 17:50')
  })

  it('POST returns 409 when the chosen slot is taken', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'host@example.com' },
      expires: '2099-01-01',
    })
    const sql = mockSql((query) => {
      if (query.includes('WHERE slot_index')) {
        return [{ slot_index: 3, team_name: 'Taken', submitted_email: 'other@example.com' }]
      }
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ teamName: 'Baro Team', slotIndex: 3 }))
    expect(response.status).toBe(409)
  })

  it('DELETE cancels the viewer booking', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { email: 'host@example.com' },
      expires: '2099-01-01',
    })
    const sql = mockSql((query) => {
      if (query.includes('DELETE')) {
        return [{ slot_index: 1, team_name: 'Baro Team', submitted_email: 'host@example.com' }]
      }
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await DELETE()
    const body = (await response.json()) as { cancelled: boolean; slot: { index: number } }
    expect(response.status).toBe(200)
    expect(body.cancelled).toBe(true)
    expect(body.slot.index).toBe(1)
  })

  it('DELETE rejects guests', async () => {
    const response = await DELETE()
    expect(response.status).toBe(401)
  })
})

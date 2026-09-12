import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, POST } from '@/app/api/hackathon/showcase/route'
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

describe('/api/hackathon/showcase', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('GET returns 503 when the database is missing', async () => {
    vi.spyOn(db, 'getDb').mockReturnValue(null)
    const response = await GET()
    expect(response.status).toBe(503)
  })

  it('GET returns the merged agenda', async () => {
    const sql = vi.fn(async (strings: TemplateStringsArray) => {
      const query = queryText(strings)
      if (query.includes('CREATE TABLE')) return []
      if (query.includes('SELECT slot_index')) {
        return [{ slot_index: 0, team_name: 'Baro' }]
      }
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await GET()
    const body = (await response.json()) as {
      remaining: number
      slots: Array<{ index: number; teamName: string | null; open: boolean; startsAt: string }>
    }

    expect(response.status).toBe(200)
    expect(body.remaining).toBe(11)
    expect(body.slots).toHaveLength(12)
    expect(body.slots[0]).toMatchObject({
      index: 0,
      startsAt: '17:00',
      teamName: 'Baro',
      open: false,
    })
    expect(body.slots[1]?.open).toBe(true)
  })

  it('POST rejects an empty team name', async () => {
    const response = await POST(buildRequest({ teamName: '  ' }))
    expect(response.status).toBe(400)
  })

  it('POST books the next free slot', async () => {
    const sql = vi.fn(async (strings: TemplateStringsArray) => {
      const query = queryText(strings)
      if (query.includes('CREATE TABLE')) return []
      if (query.includes('WHERE team_key')) return []
      if (query.includes('INSERT INTO')) {
        return [{ slot_index: 1, team_name: 'Baro Team' }]
      }
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ teamName: '  Baro Team  ' }))
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

  it('POST returns the existing slot for the same team name', async () => {
    const sql = vi.fn(async (strings: TemplateStringsArray) => {
      const query = queryText(strings)
      if (query.includes('CREATE TABLE')) return []
      if (query.includes('WHERE team_key')) {
        return [{ slot_index: 3, team_name: 'Baro Team' }]
      }
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ teamName: 'baro team' }))
    const body = (await response.json()) as {
      alreadyBooked: boolean
      slot: { index: number; label: string }
    }

    expect(response.status).toBe(200)
    expect(body.alreadyBooked).toBe(true)
    expect(body.slot).toMatchObject({
      index: 3,
      label: '17:30 – 17:40',
    })
  })

  it('POST returns 409 when every slot is taken', async () => {
    const sql = vi.fn(async (strings: TemplateStringsArray) => {
      const query = queryText(strings)
      if (query.includes('CREATE TABLE')) return []
      if (query.includes('WHERE team_key')) return []
      if (query.includes('INSERT INTO')) return []
      return []
    })
    vi.spyOn(db, 'getDb').mockReturnValue(sql as unknown as ReturnType<typeof db.getDb>)

    const response = await POST(buildRequest({ teamName: 'Late Team' }))
    expect(response.status).toBe(409)
  })
})

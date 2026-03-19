import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CursorEvent } from '@/lib/types'
import { GET } from '@/app/api/events/upcoming/route'
import * as luma from '@/lib/luma'

const ORIGINAL_ENV = process.env

describe('GET /api/events/upcoming', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.restoreAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-19T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
    process.env = ORIGINAL_ENV
  })

  it('returns static upcoming events when LUMA_API_KEY is missing', async () => {
    delete process.env.LUMA_API_KEY

    const response = await GET()
    const body = (await response.json()) as { source: string; events: CursorEvent[]; updatedAt: string }

    expect(response.status).toBe(200)
    expect(body.source).toBe('static')
    expect(body.events.length).toBeGreaterThan(0)
    expect(typeof body.updatedAt).toBe('string')
  })

  it('returns events from Luma when the API call succeeds', async () => {
    process.env.LUMA_API_KEY = 'secret'
    process.env.LUMA_API_BASE_URL = 'https://public-api.luma.com'

    const lumaEvents: CursorEvent[] = [
      {
        id: 'evt_123',
        title: 'Cursor Community Live',
        date: '2026-03-21',
        time: '18:00',
        displayDate: 'March 21, 2026',
        location: 'Belgrade, Serbia',
        lumaUrl: 'https://luma.com/evt_123',
        status: 'upcoming',
      },
    ]

    const fetchSpy = vi.spyOn(luma, 'fetchLumaUpcomingEvents').mockResolvedValue(lumaEvents)

    const response = await GET()
    const body = (await response.json()) as { source: string; events: CursorEvent[] }

    expect(response.status).toBe(200)
    expect(body.source).toBe('luma')
    expect(body.events).toEqual(lumaEvents)
    expect(fetchSpy).toHaveBeenCalledWith({
      apiKey: 'secret',
      baseUrl: 'https://public-api.luma.com',
    })
  })

  it('falls back to static events when the Luma call fails', async () => {
    process.env.LUMA_API_KEY = 'secret'
    vi.spyOn(luma, 'fetchLumaUpcomingEvents').mockRejectedValue(new Error('boom'))

    const response = await GET()
    const body = (await response.json()) as { source: string; events: CursorEvent[] }

    expect(response.status).toBe(200)
    expect(body.source).toBe('fallback')
    expect(body.events.length).toBeGreaterThan(0)
  })
})

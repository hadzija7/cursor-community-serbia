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
    vi.spyOn(luma, 'fetchListedCalendarEvents').mockResolvedValue([])
  })

  afterEach(() => {
    vi.useRealTimers()
    process.env = ORIGINAL_ENV
  })

  it('returns static fallback events when listed-events source is empty', async () => {
    delete process.env.LUMA_API_KEY
    process.env.LUMA_CALENDAR_SLUG = '/'

    const response = await GET()
    const body = (await response.json()) as { source: string; events: CursorEvent[]; updatedAt: string }

    expect(response.status).toBe(200)
    expect(body.source).toBe('static')
    expect(body.events.length).toBeGreaterThan(0)
    expect(typeof body.updatedAt).toBe('string')
  })

  it('returns listed events when API key is missing and calendar page has events', async () => {
    delete process.env.LUMA_API_KEY

    const listedEvent: CursorEvent = {
      id: 'evt_listed',
      title: 'Listed Event',
      date: '2026-03-26',
      time: '18:00',
      displayDate: 'March 26, 2026',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/listed',
      status: 'upcoming',
    }
    vi.spyOn(luma, 'fetchListedCalendarEvents').mockResolvedValue([listedEvent])

    const response = await GET()
    const body = (await response.json()) as { source: string; events: CursorEvent[]; counts: { managed: number; listed: number } }

    expect(response.status).toBe(200)
    expect(body.source).toBe('listed')
    expect(body.events).toEqual([listedEvent])
    expect(body.counts).toEqual({ managed: 0, listed: 1 })
  })

  it('returns merged managed and listed events when Luma API succeeds', async () => {
    process.env.LUMA_API_KEY = 'secret'
    process.env.LUMA_API_BASE_URL = 'https://public-api.luma.com'

    const managedEvents: CursorEvent[] = [
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
    const listedEvents: CursorEvent[] = [
      {
        id: 'evt_999',
        title: 'Listed Partner Event',
        date: '2026-03-22',
        time: '19:00',
        displayDate: 'March 22, 2026',
        location: 'Novi Sad, Serbia',
        lumaUrl: 'https://luma.com/yvpg9ijv',
        status: 'upcoming',
      },
    ]

    const managedSpy = vi.spyOn(luma, 'fetchLumaUpcomingEvents').mockResolvedValue(managedEvents)
    vi.spyOn(luma, 'fetchListedCalendarEvents').mockResolvedValue(listedEvents)

    const response = await GET()
    const body = (await response.json()) as { source: string; events: CursorEvent[]; counts: { managed: number; listed: number } }

    expect(response.status).toBe(200)
    expect(body.source).toBe('luma+listed')
    expect(body.events).toEqual([managedEvents[0], listedEvents[0]])
    expect(body.counts).toEqual({ managed: 1, listed: 1 })
    expect(managedSpy).toHaveBeenCalledWith({
      apiKey: 'secret',
      baseUrl: 'https://public-api.luma.com',
    })
  })

  it('falls back to static events when managed and listed sources fail', async () => {
    process.env.LUMA_API_KEY = 'secret'
    process.env.LUMA_CALENDAR_SLUG = 'cursor-serbia'
    vi.spyOn(luma, 'fetchLumaUpcomingEvents').mockRejectedValue(new Error('boom'))
    vi.spyOn(luma, 'fetchListedCalendarEvents').mockRejectedValue(new Error('listed-fail'))

    const response = await GET()
    const body = (await response.json()) as { source: string; events: CursorEvent[] }

    expect(response.status).toBe(200)
    expect(body.source).toBe('fallback')
    expect(body.events.length).toBeGreaterThan(0)
  })
})

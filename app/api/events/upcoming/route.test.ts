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
    vi.spyOn(luma, 'fetchCalendarPageEvents').mockResolvedValue([])
  })

  afterEach(() => {
    vi.useRealTimers()
    process.env = ORIGINAL_ENV
  })

  it('returns static events when no sources are configured', async () => {
    delete process.env.LUMA_API_KEY
    process.env.LUMA_CALENDAR_SLUG = '/'

    const res = await GET()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.source).toBe('static')
    expect(body.events.length).toBeGreaterThan(0)
  })

  it('returns listed events from calendar page', async () => {
    delete process.env.LUMA_API_KEY

    const listed: CursorEvent = {
      id: 'evt_listed',
      title: 'Listed Event',
      date: '2026-03-26',
      time: '18:00',
      displayDate: 'March 26, 2026',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/listed',
      status: 'upcoming',
    }
    vi.spyOn(luma, 'fetchCalendarPageEvents').mockResolvedValue([listed])

    const res = await GET()
    const body = await res.json()

    expect(body.source).toBe('listed')
    expect(body.events).toEqual([listed])
    expect(body.counts).toEqual({ managed: 0, listed: 1 })
  })

  it('merges managed and listed events', async () => {
    process.env.LUMA_API_KEY = 'secret'

    const managed: CursorEvent = {
      id: 'evt_managed',
      title: 'Managed Event',
      date: '2026-03-21',
      time: '18:00',
      displayDate: 'March 21, 2026',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/managed',
      status: 'upcoming',
    }
    const listed: CursorEvent = {
      id: 'evt_listed',
      title: 'Listed Event',
      date: '2026-03-22',
      time: '19:00',
      displayDate: 'March 22, 2026',
      location: 'Novi Sad, Serbia',
      lumaUrl: 'https://luma.com/listed',
      status: 'upcoming',
    }

    vi.spyOn(luma, 'fetchManagedEvents').mockResolvedValue([managed])
    vi.spyOn(luma, 'fetchCalendarPageEvents').mockResolvedValue([listed])

    const res = await GET()
    const body = await res.json()

    expect(body.source).toBe('luma+listed')
    expect(body.events).toEqual([managed, listed])
    expect(body.counts).toEqual({ managed: 1, listed: 1 })
  })

  it('falls back to static when all sources fail', async () => {
    process.env.LUMA_API_KEY = 'secret'
    vi.spyOn(luma, 'fetchManagedEvents').mockRejectedValue(new Error('fail'))
    vi.spyOn(luma, 'fetchCalendarPageEvents').mockRejectedValue(new Error('fail'))

    const res = await GET()
    const body = await res.json()

    expect(body.source).toBe('fallback')
    expect(body.events.length).toBeGreaterThan(0)
  })
})

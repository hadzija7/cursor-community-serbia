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

  it('returns static events when no city calendar keys are configured', async () => {
    delete process.env.LUMA_BELGRADE_API_KEY
    delete process.env.LUMA_NOVI_SAD_API_KEY

    const res = await GET()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.source).toBe('static')
    expect(body.events.length).toBeGreaterThan(0)
    expect(body.counts).toEqual({ belgrade: 0, noviSad: 0 })
  })

  it('merges managed events from both city calendars', async () => {
    process.env.LUMA_BELGRADE_API_KEY = 'belgrade-secret'
    process.env.LUMA_NOVI_SAD_API_KEY = 'novisad-secret'

    const belgrade: CursorEvent = {
      id: 'evt_belgrade',
      title: 'Belgrade Event',
      date: '2026-03-21',
      time: '18:00',
      displayDate: 'March 21, 2026',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/belgrade',
      status: 'upcoming',
    }
    const noviSad: CursorEvent = {
      id: 'evt_novisad',
      title: 'Novi Sad Event',
      date: '2026-03-22',
      time: '19:00',
      displayDate: 'March 22, 2026',
      location: 'Novi Sad, Serbia',
      lumaUrl: 'https://luma.com/novisad',
      status: 'upcoming',
    }

    vi.spyOn(luma, 'fetchManagedEvents').mockImplementation(async (apiKey) => {
      if (apiKey === 'belgrade-secret') return [belgrade]
      if (apiKey === 'novisad-secret') return [noviSad]
      return []
    })

    const res = await GET()
    const body = await res.json()

    expect(body.source).toBe('luma')
    expect(body.events).toEqual([belgrade, noviSad])
    expect(body.counts).toEqual({ belgrade: 1, noviSad: 1 })
  })

  it('returns partial-luma when one city calendar fails', async () => {
    process.env.LUMA_BELGRADE_API_KEY = 'belgrade-secret'
    process.env.LUMA_NOVI_SAD_API_KEY = 'novisad-secret'

    const belgrade: CursorEvent = {
      id: 'evt_belgrade',
      title: 'Belgrade Event',
      date: '2026-03-21',
      time: '18:00',
      displayDate: 'March 21, 2026',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/belgrade',
      status: 'upcoming',
    }

    vi.spyOn(luma, 'fetchManagedEvents').mockImplementation(async (apiKey) => {
      if (apiKey === 'belgrade-secret') return [belgrade]
      throw new Error('fail')
    })

    const res = await GET()
    const body = await res.json()

    expect(body.source).toBe('partial-luma')
    expect(body.events).toEqual([belgrade])
    expect(body.counts).toEqual({ belgrade: 1, noviSad: 0 })
  })

  it('falls back to static when all city calendars fail', async () => {
    process.env.LUMA_BELGRADE_API_KEY = 'belgrade-secret'
    process.env.LUMA_NOVI_SAD_API_KEY = 'novisad-secret'
    vi.spyOn(luma, 'fetchManagedEvents').mockRejectedValue(new Error('fail'))

    const res = await GET()
    const body = await res.json()

    expect(body.source).toBe('fallback')
    expect(body.events.length).toBeGreaterThan(0)
    expect(body.counts).toEqual({ belgrade: 0, noviSad: 0 })
  })
})

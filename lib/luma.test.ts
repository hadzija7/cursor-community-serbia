import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fetchCalendarPageEvents,
  getLumaCityCalendars,
  importCalendarPeople,
  mapLumaEntry,
} from '@/lib/luma'

const ORIGINAL_ENV = process.env

describe('getLumaCityCalendars', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.LUMA_BELGRADE_API_KEY
    delete process.env.LUMA_NOVI_SAD_API_KEY
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns empty array when no keys are configured', () => {
    expect(getLumaCityCalendars()).toEqual([])
  })

  it('returns configured city calendars', () => {
    process.env.LUMA_BELGRADE_API_KEY = ' belgrade '
    process.env.LUMA_NOVI_SAD_API_KEY = 'novisad'

    expect(getLumaCityCalendars()).toEqual([
      { city: 'belgrade', apiKey: 'belgrade' },
      { city: 'noviSad', apiKey: 'novisad' },
    ])
  })
})

describe('mapLumaEntry', () => {
  it('maps a flat Luma event to CursorEvent', () => {
    const result = mapLumaEntry({
      api_id: 'evt_abc',
      name: 'Cursor Meetup Belgrade',
      start_at: '2026-04-01T16:30:00.000Z',
      url: 'https://luma.com/evt_abc',
      geo_address_info: { city: 'Belgrade', country: 'Serbia' },
    })

    expect(result).toMatchObject({
      id: 'evt_abc',
      title: 'Cursor Meetup Belgrade',
      date: '2026-04-01',
      time: '18:30',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/evt_abc',
      status: 'upcoming',
    })
  })

  it('handles nested event payloads', () => {
    const result = mapLumaEntry({
      event: {
        api_id: 'evt_nested',
        name: 'Cursor Workshop',
        start_at: '2026-05-10T17:00:00.000Z',
        url_slug: 'cursor-workshop',
      },
      location_name: 'Novi Sad',
    })

    expect(result).toMatchObject({
      id: 'evt_nested',
      title: 'Cursor Workshop',
      location: 'Novi Sad',
      lumaUrl: 'https://luma.com/cursor-workshop',
    })
  })

  it('normalizes slug-only url values to full luma links', () => {
    const result = mapLumaEntry({
      api_id: 'evt_slug',
      name: 'Cursor x Hub201',
      start_at: '2026-04-07T15:30:00.000Z',
      url: 'yvpg9ijv',
    })

    expect(result?.lumaUrl).toBe('https://luma.com/yvpg9ijv')
  })

  it('returns null for incomplete entries', () => {
    expect(mapLumaEntry({ api_id: 'x' })).toBeNull()
    expect(mapLumaEntry(null)).toBeNull()
    expect(mapLumaEntry('string')).toBeNull()
  })
})

describe('fetchCalendarPageEvents', () => {
  afterEach(() => vi.restoreAllMocks())

  it('extracts events from public calendar page', async () => {
    const html = `<html><body><script id="__NEXT_DATA__" type="application/json">{
      "props":{"pageProps":{"entries":[{
        "api_id":"evt-listed",
        "name":"Cursor x Hub201 meetup",
        "start_at":"2099-04-07T15:30:00.000Z",
        "url":"yvpg9ijv",
        "geo_address_info":{"city":"Belgrade","country":"Serbia"}
      }]}}
    }</script></body></html>`

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } }),
    )

    const events = await fetchCalendarPageEvents('cursor-serbia')

    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      id: 'evt-listed',
      title: 'Cursor x Hub201 meetup',
      lumaUrl: 'https://luma.com/yvpg9ijv',
      location: 'Belgrade, Serbia',
    })
  })

  it('returns empty array for empty slug', async () => {
    const events = await fetchCalendarPageEvents('')
    expect(events).toEqual([])
  })
})

describe('importCalendarPeople', () => {
  afterEach(() => vi.restoreAllMocks())

  it('POSTs infos to Luma import-people with API key header', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    )

    const res = await importCalendarPeople('test-key', [{ email: 'a@b.co' }], {
      baseUrl: 'https://public-api.luma.com',
    })

    expect(res.ok).toBe(true)
    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://public-api.luma.com/v1/calendar/import-people',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'x-luma-api-key': 'test-key',
        }),
      }),
    )
    const [, init] = fetchSpy.mock.calls[0]
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      infos: [{ email: 'a@b.co' }],
    })
  })

  it('includes tag_names when provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    await importCalendarPeople('k', [{ email: 'x@y.z' }], { tagNames: ['website'] })

    const [, init] = fetchSpy.mock.calls[0]
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      infos: [{ email: 'x@y.z' }],
      tag_names: ['website'],
    })
  })
})

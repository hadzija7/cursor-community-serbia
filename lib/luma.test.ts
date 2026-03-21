import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCalendarPageEvents, mapLumaEntry } from '@/lib/luma'

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

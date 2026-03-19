import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchListedCalendarEvents, mapLumaEntryToCursorEvent } from '@/lib/luma'

describe('mapLumaEntryToCursorEvent', () => {
  it('maps a Luma event entry to CursorEvent', () => {
    const event = mapLumaEntryToCursorEvent({
      api_id: 'evt_abc',
      name: 'Cursor Meetup Belgrade',
      start_at: '2026-04-01T16:30:00.000Z',
      url: 'https://luma.com/evt_abc',
      geo_address_info: {
        city: 'Belgrade',
        country: 'Serbia',
      },
    })

    expect(event).toBeTruthy()
    expect(event).toMatchObject({
      id: 'evt_abc',
      title: 'Cursor Meetup Belgrade',
      date: '2026-04-01',
      time: '18:30',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/evt_abc',
      status: 'upcoming',
    })
  })

  it('supports nested event payloads and slug-based URL fallback', () => {
    const event = mapLumaEntryToCursorEvent({
      event: {
        api_id: 'evt_nested',
        name: 'Cursor Workshop',
        start_at: '2026-05-10T17:00:00.000Z',
        url_slug: 'cursor-workshop',
      },
      location_name: 'Novi Sad',
    })

    expect(event).toBeTruthy()
    expect(event).toMatchObject({
      id: 'evt_nested',
      title: 'Cursor Workshop',
      location: 'Novi Sad',
      lumaUrl: 'https://luma.com/cursor-workshop',
      status: 'upcoming',
    })
  })

  it('normalizes slug values in url to full luma links', () => {
    const event = mapLumaEntryToCursorEvent({
      api_id: 'evt_slug_url',
      name: 'Cursor x Hub201 meetup',
      start_at: '2026-04-07T15:30:00.000Z',
      url: 'yvpg9ijv',
    })

    expect(event).toBeTruthy()
    expect(event?.lumaUrl).toBe('https://luma.com/yvpg9ijv')
  })
})

describe('fetchListedCalendarEvents', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('extracts listed events from public calendar page payload', async () => {
    const html = `
      <html>
        <body>
          <script id="__NEXT_DATA__" type="application/json">
            {
              "props": {
                "pageProps": {
                  "entries": [
                    {
                      "api_id": "evt-3NwzSJLDLyqDTKo",
                      "name": "Cursor x Hub201 meetup",
                      "start_at": "2099-04-07T15:30:00.000Z",
                      "timezone": "Europe/Belgrade",
                      "url": "yvpg9ijv",
                      "geo_address_info": { "city": "Belgrade", "country": "Serbia" }
                    }
                  ]
                }
              }
            }
          </script>
        </body>
      </html>
    `

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      })
    )

    const events = await fetchListedCalendarEvents({
      calendarSlug: 'cursor-serbia',
    })

    expect(fetchSpy).toHaveBeenCalledWith('https://luma.com/cursor-serbia', { cache: 'no-store' })
    expect(events.length).toBe(1)
    expect(events[0]).toMatchObject({
      id: 'evt-3NwzSJLDLyqDTKo',
      title: 'Cursor x Hub201 meetup',
      lumaUrl: 'https://luma.com/yvpg9ijv',
      location: 'Belgrade, Serbia',
      status: 'upcoming',
    })
  })
})

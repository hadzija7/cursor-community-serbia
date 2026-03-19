import { describe, expect, it } from 'vitest'
import { mapLumaEntryToCursorEvent } from '@/lib/luma'

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
})

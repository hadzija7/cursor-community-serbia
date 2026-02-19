import { CursorEvent } from '@/lib/types'

// REPLACE: Replace all sample events, locations, and Luma URLs with real community events.
export const events: CursorEvent[] = [
  {
    id: 'cafe-cursor-novisad-1',
    title: 'Cafe Cursor Novi Sad',
    date: '2026-01-18',
    displayDate: 'January 18, 2026',
    attendees: 46,
    location: 'Novi Sad, Serbia',
    recapPath: '/recaps/cafe-cursor-novisad-1',
    thumbnail: '/images/events/cursorcafe1.jpg',
    lumaUrl: 'https://luma.com/r3pbpvaj',
    status: 'past',
  },
  {
    id: 'cafe-cursor-belgrade-1',
    title: 'Cafe Cursor Belgrade',
    date: '2026-01-25',
    displayDate: 'January 25, 2026',
    attendees: 99,
    location: 'Beldgrade, Serbia',
    recapPath: '/recaps/cafe-cursor-belgrade-1',
    thumbnail: '/images/events/CafeCursorBelgrade12.jpg',
    lumaUrl: 'https://luma.com/tq5s116a',
    status: 'past',
  },
]

export const upcomingEvents = events.filter((event) => event.status === 'upcoming')
export const pastEvents = events.filter((event) => event.status === 'past')

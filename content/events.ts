import { CursorEvent } from '@/lib/types'

// REPLACE: Replace all sample events, locations, and Luma URLs with real community events.
export const events: CursorEvent[] = [
  {
    id: 'cursor-meetup-novisad-1',
    title: 'Cursor Meetup Novi Sad',
    date: '2026-03-17',
    time: '18:00',
    displayDate: 'March 17, 2026',
    attendees: 37,
    location: 'Novi Sad, Vojvodina',
    recapPath: '/recaps/cursor-meetup-novisad-1',
    thumbnail: 'https://drive.google.com/uc?export=view&id=1Z-iGL-XSyStIyD6Y4M2D-w9J4DBsAgK0',
    lumaUrl: 'https://luma.com/3bshmlcv',
    status: 'past',
  },
  {
    id: 'cursor-coworking-nis-1',
    title: 'Cursor Coworking Day in Niš',
    date: '2026-03-20',
    time: '18:00',
    displayDate: 'March 20, 2026',
    attendees: 46,
    location: 'Niš, Serbia',
    recapPath: '/recaps/cursor-coworking-nis-1',
    thumbnail: 'https://drive.google.com/uc?export=view&id=1SspQCSCwKoSE3xmMrI-jxOHywtf8uehF',
    lumaUrl: 'https://luma.com/b9evox5u',
    status: 'past',
  },
  {
    id: 'cursor-coworking-novisad-1',
    title: 'Cursor Coworking Day in Novi Sad',
    date: '2026-03-29',
    time: '10:00',
    displayDate: 'March 29, 2026',
    attendees: 30,
    location: 'Novi Sad, Vojvodina',
    recapPath: '/recaps/cursor-coworking-novisad-1',
    thumbnail: 'https://drive.google.com/uc?export=view&id=1w3sm1HJ0J5ozZEVp9-asQ9wOTKBSKfVI',
    lumaUrl: 'https://luma.com/u5x4q0fl',
    status: 'past',
  },
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
export const pastEvents = events
  .filter((event) => event.status === 'past')
  .sort((a, b) => b.date.localeCompare(a.date))

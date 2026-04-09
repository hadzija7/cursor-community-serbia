import { cafecursorNovisad1Recap } from '@/content/recaps/cafe-cursor-novisad-1'
import { cursorMeetupNovisad1Recap } from '@/content/recaps/cursor-meetup-novisad-1'
import { cursorMeetupNovisadDec2025Recap } from '@/content/recaps/cursor-meetup-novisad-dec-2025'
import { RecapData } from '@/lib/types'
import { cafeCursorCannes1Recap } from './cafe-cursor-cannes-1'
import { cafecursorBelgrade1Recap } from './cafe-cursor-belgrade-1'
import { cursorCoworkingNis1Recap } from './cursor-coworking-nis-1'
import { cursorCoworkingNovisad1Recap } from './cursor-coworking-novisad-1'
import { cursorBelgradeHub201Meetup1Recap } from './cursor-belgrade-hub201-1'

export const recapsBySlug: Record<string, RecapData> = {
  [cafeCursorCannes1Recap.slug]: cafeCursorCannes1Recap,
  [cursorBelgradeHub201Meetup1Recap.slug]: cursorBelgradeHub201Meetup1Recap,
  [cafecursorNovisad1Recap.slug]: cafecursorNovisad1Recap,
  [cafecursorBelgrade1Recap.slug]: cafecursorBelgrade1Recap,
  [cursorMeetupNovisad1Recap.slug]: cursorMeetupNovisad1Recap,
  [cursorMeetupNovisadDec2025Recap.slug]: cursorMeetupNovisadDec2025Recap,
  [cursorCoworkingNis1Recap.slug]: cursorCoworkingNis1Recap,
  [cursorCoworkingNovisad1Recap.slug]: cursorCoworkingNovisad1Recap,
}

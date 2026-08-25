import { cafecursorNovisad1Recap } from '@/content/recaps/cafe-cursor-novisad-1'
import { cursorMeetupNovisad1Recap } from '@/content/recaps/cursor-meetup-novisad-1'
import { cursorMeetupNovisadDec2025Recap } from '@/content/recaps/cursor-meetup-novisad-dec-2025'
import { cursorMeetupNovisadAug2026Recap } from '@/content/recaps/cursor-meetup-novisad-aug-2026'
import { cursorMeetupNovisadMay2026Recap } from '@/content/recaps/cursor-meetup-novisad-may-2026'
import { RecapData } from '@/lib/types'
import { cafeCursorBelgradeAug2026Recap } from './cafe-cursor-belgrade-aug-2026'
import { cafeCursorBelgradeSummer2026Recap } from './cafe-cursor-belgrade-summer-2026'
import { cafeCursorCannes1Recap } from './cafe-cursor-cannes-1'
import { cafecursorBelgrade1Recap } from './cafe-cursor-belgrade-1'
import { cursorCoworkingNis1Recap } from './cursor-coworking-nis-1'
import { cursorCoworkingNovisad1Recap } from './cursor-coworking-novisad-1'
import { cursorBelgradeHub201Meetup1Recap } from './cursor-belgrade-hub201-1'
import { cursorCoworkingBelgrade1Recap } from './cursor-coworking-belgrade-1'

export const recapsBySlug: Record<string, RecapData> = {
  [cafeCursorBelgradeAug2026Recap.slug]: cafeCursorBelgradeAug2026Recap,
  [cursorMeetupNovisadAug2026Recap.slug]: cursorMeetupNovisadAug2026Recap,
  [cafeCursorBelgradeSummer2026Recap.slug]: cafeCursorBelgradeSummer2026Recap,
  [cursorMeetupNovisadMay2026Recap.slug]: cursorMeetupNovisadMay2026Recap,
  [cafeCursorCannes1Recap.slug]: cafeCursorCannes1Recap,
  [cursorCoworkingBelgrade1Recap.slug]: cursorCoworkingBelgrade1Recap,
  [cursorBelgradeHub201Meetup1Recap.slug]: cursorBelgradeHub201Meetup1Recap,
  [cafecursorNovisad1Recap.slug]: cafecursorNovisad1Recap,
  [cafecursorBelgrade1Recap.slug]: cafecursorBelgrade1Recap,
  [cursorMeetupNovisad1Recap.slug]: cursorMeetupNovisad1Recap,
  [cursorMeetupNovisadDec2025Recap.slug]: cursorMeetupNovisadDec2025Recap,
  [cursorCoworkingNis1Recap.slug]: cursorCoworkingNis1Recap,
  [cursorCoworkingNovisad1Recap.slug]: cursorCoworkingNovisad1Recap,
}

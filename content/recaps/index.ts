import { cafecursorNovisad1Recap } from '@/content/recaps/cafe-cursor-novisad-1'
import { cursorMeetupNovisad1Recap } from '@/content/recaps/cursor-meetup-novisad-1'
import { RecapData } from '@/lib/types'
import { cafecursorBelgrade1Recap } from './cafe-cursor-belgrade-1'
import { cursorCoworkingNis1Recap } from './cursor-coworking-nis-1'
import { cursorCoworkingNovisad1Recap } from './cursor-coworking-novisad-1'

export const recapsBySlug: Record<string, RecapData> = {
  [cafecursorNovisad1Recap.slug]: cafecursorNovisad1Recap,
  [cafecursorBelgrade1Recap.slug]: cafecursorBelgrade1Recap,
  [cursorMeetupNovisad1Recap.slug]: cursorMeetupNovisad1Recap,
  [cursorCoworkingNis1Recap.slug]: cursorCoworkingNis1Recap,
  [cursorCoworkingNovisad1Recap.slug]: cursorCoworkingNovisad1Recap,
}

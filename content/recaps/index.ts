import { cafecursorNovisad1Recap } from '@/content/recaps/cafe-cursor-novisad-1'
import { RecapData } from '@/lib/types'
import { cafecursorBelgrade1Recap } from './cafe-cursor-belgrade-1'

export const recapsBySlug: Record<string, RecapData> = {
  [cafecursorNovisad1Recap.slug]: cafecursorNovisad1Recap,
  [cafecursorBelgrade1Recap.slug]: cafecursorBelgrade1Recap,
}

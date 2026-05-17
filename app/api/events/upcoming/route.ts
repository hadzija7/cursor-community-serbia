import { events } from '@/content/events'
import { eventStartMs, isFutureEvent } from '@/lib/event-time'
import {
  fetchManagedEvents,
  getLumaCityCalendars,
  type LumaCityCalendar,
} from '@/lib/luma'
import type { CursorEvent } from '@/lib/types'

function staticFallback() {
  return events
    .filter(isFutureEvent)
    .sort((a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time))
}

function mergeAndSort(...groups: CursorEvent[][]): CursorEvent[] {
  const map = new Map<string, CursorEvent>()
  for (const g of groups) for (const e of g) map.set(e.id, e)
  return Array.from(map.values()).sort(
    (a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time),
  )
}

type CityCounts = Record<LumaCityCalendar, number>

function emptyCounts(): CityCounts {
  return { belgrade: 0, noviSad: 0 }
}

export async function GET() {
  const calendars = getLumaCityCalendars()
  const baseUrl = process.env.LUMA_API_BASE_URL

  if (calendars.length === 0) {
    return Response.json({
      source: 'static',
      events: staticFallback(),
      counts: emptyCounts(),
      updatedAt: new Date().toISOString(),
    })
  }

  const counts = emptyCounts()
  const eventGroups: CursorEvent[][] = []
  let hadError = false
  let successCount = 0

  const results = await Promise.allSettled(
    calendars.map(async ({ city, apiKey }) => {
      const fetched = await fetchManagedEvents(apiKey, baseUrl)
      return { city, events: fetched }
    }),
  )

  for (const result of results) {
    if (result.status === 'fulfilled') {
      successCount++
      counts[result.value.city] = result.value.events.length
      eventGroups.push(result.value.events)
    } else {
      hadError = true
      console.error('[events/upcoming] managed fetch failed:', result.reason)
    }
  }

  const merged = mergeAndSort(...eventGroups)

  if (merged.length > 0) {
    const source =
      hadError && successCount > 0
        ? 'partial-luma'
        : 'luma'
    return Response.json({
      source,
      events: merged,
      counts,
      updatedAt: new Date().toISOString(),
    })
  }

  return Response.json({
    source: hadError ? 'fallback' : 'static',
    events: staticFallback(),
    counts,
    updatedAt: new Date().toISOString(),
  })
}

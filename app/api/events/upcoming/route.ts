import { upcomingEvents } from '@/content/events'
import { siteConfig } from '@/content/site.config'
import { eventStartMs, isFutureEvent } from '@/lib/event-time'
import { fetchListedCalendarEvents, fetchLumaUpcomingEvents } from '@/lib/luma'
import type { CursorEvent } from '@/lib/types'

function staticUpcomingEvents() {
  return upcomingEvents.filter(isFutureEvent)
}

function resolveCalendarSlug(): string {
  const explicitSlug = process.env.LUMA_CALENDAR_SLUG?.trim()
  if (explicitSlug) {
    return explicitSlug
  }

  try {
    const url = new URL(siteConfig.lumaUrl)
    return url.pathname.replace(/^\/+/, '').split('/')[0] || ''
  } catch {
    return ''
  }
}

function mergeEvents(...eventGroups: CursorEvent[][]): CursorEvent[] {
  const deduped = new Map<string, CursorEvent>()
  for (const group of eventGroups) {
    for (const event of group) {
      deduped.set(event.id, event)
    }
  }
  return Array.from(deduped.values()).sort((a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time))
}

export async function GET() {
  const apiKey = process.env.LUMA_API_KEY
  const calendarSlug = resolveCalendarSlug()

  let managedEvents: CursorEvent[] = []
  let listedEvents: CursorEvent[] = []
  let managedFailed = false
  let listedFailed = false

  if (apiKey) {
    try {
      managedEvents = await fetchLumaUpcomingEvents({
        apiKey,
        baseUrl: process.env.LUMA_API_BASE_URL,
      })
    } catch (error) {
      managedFailed = true
      console.error('Failed to load managed Luma events:', error)
    }
  }

  if (calendarSlug) {
    try {
      listedEvents = await fetchListedCalendarEvents({
        calendarSlug,
      })
    } catch (error) {
      listedFailed = true
      console.error('Failed to load listed calendar events:', error)
    }
  }

  const merged = mergeEvents(managedEvents, listedEvents)
  if (merged.length > 0) {
    return Response.json({
      source: apiKey ? 'luma+listed' : 'listed',
      events: merged,
      counts: {
        managed: managedEvents.length,
        listed: listedEvents.length,
      },
      updatedAt: new Date().toISOString(),
    })
  }

  if (!apiKey && !calendarSlug) {
    return Response.json({
      source: 'static',
      events: staticUpcomingEvents(),
      updatedAt: new Date().toISOString(),
    })
  }

  return Response.json({
    source: managedFailed || listedFailed ? 'fallback' : 'static',
    events: staticUpcomingEvents(),
    updatedAt: new Date().toISOString(),
  })
}

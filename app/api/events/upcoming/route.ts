import { events } from '@/content/events'
import { siteConfig } from '@/content/site.config'
import { eventStartMs, isFutureEvent } from '@/lib/event-time'
import { fetchCalendarPageEvents, fetchManagedEvents } from '@/lib/luma'
import type { CursorEvent } from '@/lib/types'

function staticFallback() {
  return events
    .filter(isFutureEvent)
    .sort((a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time))
}

function calendarSlug(): string {
  const explicit = process.env.LUMA_CALENDAR_SLUG?.trim()
  if (explicit) return explicit
  try {
    return new URL(siteConfig.lumaUrl).pathname.replace(/^\/+/, '').split('/')[0] || ''
  } catch {
    return ''
  }
}

function mergeAndSort(...groups: CursorEvent[][]): CursorEvent[] {
  const map = new Map<string, CursorEvent>()
  for (const g of groups) for (const e of g) map.set(e.id, e)
  return Array.from(map.values()).sort(
    (a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time),
  )
}

export async function GET() {
  const apiKey = process.env.LUMA_API_KEY
  const slug = calendarSlug()

  let managed: CursorEvent[] = []
  let listed: CursorEvent[] = []
  let hadError = false

  if (apiKey) {
    try {
      managed = await fetchManagedEvents(apiKey, process.env.LUMA_API_BASE_URL)
    } catch (err) {
      hadError = true
      console.error('[events/upcoming] managed fetch failed:', err)
    }
  }

  if (slug) {
    try {
      listed = await fetchCalendarPageEvents(slug)
    } catch (err) {
      hadError = true
      console.error('[events/upcoming] listed fetch failed:', err)
    }
  }

  const merged = mergeAndSort(managed, listed)

  if (merged.length > 0) {
    return Response.json({
      source: apiKey && managed.length ? 'luma+listed' : 'listed',
      events: merged,
      counts: { managed: managed.length, listed: listed.length },
      updatedAt: new Date().toISOString(),
    })
  }

  return Response.json({
    source: hadError ? 'fallback' : 'static',
    events: staticFallback(),
    updatedAt: new Date().toISOString(),
  })
}

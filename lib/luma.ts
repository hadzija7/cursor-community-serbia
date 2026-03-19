import 'server-only'

import type { CursorEvent } from '@/lib/types'
import { eventStartMs, isFutureEvent } from '@/lib/event-time'

const DEFAULT_BASE_URL = 'https://public-api.luma.com'
const BELGRADE_TIME_ZONE = 'Europe/Belgrade'
const MAX_PAGES = 5
const PAGE_LIMIT = 50

type JsonObject = Record<string, unknown>

interface LumaListEventsResponse {
  entries?: unknown[]
  has_more?: boolean
  next_cursor?: string | null
}

function asObject(value: unknown): JsonObject | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonObject) : null
}

function readStringPath(source: JsonObject | null, path: string[]): string | undefined {
  let current: unknown = source
  for (const key of path) {
    const objectValue = asObject(current)
    if (!objectValue || !(key in objectValue)) {
      return undefined
    }
    current = objectValue[key]
  }
  return typeof current === 'string' ? current : undefined
}

function pickString(source: JsonObject | null, paths: string[][]): string | undefined {
  for (const path of paths) {
    const value = readStringPath(source, path)
    if (value) {
      return value
    }
  }
  return undefined
}

function toBelgradeDateParts(isoDateTime: string) {
  const parsed = new Date(isoDateTime)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BELGRADE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(parsed)

  const partMap = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]))
  const year = partMap.year
  const month = partMap.month
  const day = partMap.day
  const hour = partMap.hour
  const minute = partMap.minute

  if (!year || !month || !day || !hour || !minute) {
    return null
  }

  const displayDate = new Intl.DateTimeFormat('en-US', {
    timeZone: BELGRADE_TIME_ZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed)

  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
    displayDate,
  }
}

export function mapLumaEntryToCursorEvent(entry: unknown): CursorEvent | null {
  const source = asObject(entry)
  if (!source) {
    return null
  }

  const id =
    pickString(source, [['api_id'], ['id'], ['event', 'api_id'], ['event', 'id']]) ??
    pickString(source, [['event', 'url'], ['url']])
  const title = pickString(source, [['name'], ['title'], ['event', 'name'], ['event', 'title']])
  const startAt = pickString(source, [['start_at'], ['event', 'start_at']])

  if (!id || !title || !startAt) {
    return null
  }

  const dateParts = toBelgradeDateParts(startAt)
  if (!dateParts) {
    return null
  }

  const city = pickString(source, [['geo_address_info', 'city'], ['event', 'geo_address_info', 'city']])
  const country = pickString(source, [['geo_address_info', 'country'], ['event', 'geo_address_info', 'country']])
  const locationName = pickString(source, [['location_name'], ['event', 'location_name'], ['location', 'name'], ['event', 'location', 'name']])
  const location = [city, country].filter(Boolean).join(', ') || locationName || 'TBA'

  const lumaUrl =
    pickString(source, [['url'], ['event', 'url'], ['event_url'], ['event', 'event_url']]) ??
    (() => {
      const slug = pickString(source, [['url_slug'], ['event', 'url_slug']])
      return slug ? `https://luma.com/${slug}` : undefined
    })()

  return {
    id,
    title,
    date: dateParts.date,
    time: dateParts.time,
    displayDate: dateParts.displayDate,
    location,
    lumaUrl,
    status: 'upcoming',
  }
}

interface FetchLumaUpcomingEventsArgs {
  apiKey: string
  baseUrl?: string
  afterIso?: string
}

export async function fetchLumaUpcomingEvents({
  apiKey,
  baseUrl = DEFAULT_BASE_URL,
  afterIso = new Date().toISOString(),
}: FetchLumaUpcomingEventsArgs): Promise<CursorEvent[]> {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  const deduped = new Map<string, CursorEvent>()
  let cursor: string | undefined

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const params = new URLSearchParams({
      after: afterIso,
      pagination_limit: String(PAGE_LIMIT),
      sort_column: 'start_at',
      sort_direction: 'asc',
    })

    if (cursor) {
      params.set('pagination_cursor', cursor)
    }

    const response = await fetch(`${normalizedBaseUrl}/v1/calendar/list-events?${params.toString()}`, {
      headers: {
        'x-luma-api-key': apiKey,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Luma list-events request failed with status ${response.status}`)
    }

    const payload = (await response.json()) as LumaListEventsResponse
    const entries = Array.isArray(payload.entries) ? payload.entries : []

    for (const entry of entries) {
      const mapped = mapLumaEntryToCursorEvent(entry)
      if (mapped) {
        deduped.set(mapped.id, mapped)
      }
    }

    if (!payload.has_more || !payload.next_cursor) {
      break
    }

    cursor = payload.next_cursor
  }

  return Array.from(deduped.values())
    .filter(isFutureEvent)
    .sort((a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time))
}

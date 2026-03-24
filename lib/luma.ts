import type { CursorEvent } from '@/lib/types'
import { eventStartMs, isFutureEvent } from '@/lib/event-time'

const LUMA_API_BASE = 'https://public-api.luma.com'
const LUMA_PUBLIC_BASE = 'https://luma.com'
const BELGRADE_TZ = 'Europe/Belgrade'
const MAX_PAGES = 5

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type JsonObj = Record<string, unknown>

function isObject(v: unknown): v is JsonObj {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function getString(obj: JsonObj, ...keys: string[]): string | undefined {
  let cur: unknown = obj
  for (const k of keys) {
    if (!isObject(cur) || !(k in cur)) return undefined
    cur = cur[k]
  }
  return typeof cur === 'string' ? cur : undefined
}

function firstString(obj: JsonObj, paths: string[][]): string | undefined {
  for (const p of paths) {
    const v = getString(obj, ...p)
    if (v) return v
  }
  return undefined
}

function toLumaUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  if (/^https?:\/\//i.test(raw)) return raw
  const slug = raw.replace(/^\/+/, '')
  return slug ? `${LUMA_PUBLIC_BASE}/${slug}` : undefined
}

function toBelgradeDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BELGRADE_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d)

  const m = Object.fromEntries(
    parts.filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]),
  )
  if (!m.year || !m.month || !m.day || !m.hour || !m.minute) return null

  return {
    date: `${m.year}-${m.month}-${m.day}`,
    time: `${m.hour}:${m.minute}`,
    displayDate: new Intl.DateTimeFormat('en-US', {
      timeZone: BELGRADE_TZ,
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(d),
  }
}

// ---------------------------------------------------------------------------
// Map a single Luma entry (any shape) → CursorEvent
// ---------------------------------------------------------------------------

export function mapLumaEntry(entry: unknown): CursorEvent | null {
  if (!isObject(entry)) return null
  const obj = entry

  const id =
    firstString(obj, [['api_id'], ['id'], ['event', 'api_id'], ['event', 'id']]) ??
    firstString(obj, [['url'], ['event', 'url']])
  const title = firstString(obj, [['name'], ['title'], ['event', 'name'], ['event', 'title']])
  const startAt = firstString(obj, [['start_at'], ['event', 'start_at']])

  if (!id || !title || !startAt) return null

  const dp = toBelgradeDate(startAt)
  if (!dp) return null

  const city = firstString(obj, [['geo_address_info', 'city'], ['event', 'geo_address_info', 'city'], ['geo_address_json', 'city'], ['event', 'geo_address_json', 'city']])
  const country = firstString(obj, [['geo_address_info', 'country'], ['event', 'geo_address_info', 'country'], ['geo_address_json', 'country'], ['event', 'geo_address_json', 'country']])
  const locName = firstString(obj, [['location_name'], ['event', 'location_name']])
  const location = [city, country].filter(Boolean).join(', ') || locName || 'TBA'

  const lumaUrl =
    toLumaUrl(firstString(obj, [['url'], ['event', 'url']])) ??
    toLumaUrl(firstString(obj, [['url_slug'], ['event', 'url_slug']]))

  return { id, title, date: dp.date, time: dp.time, displayDate: dp.displayDate, location, lumaUrl, status: 'upcoming' }
}

// ---------------------------------------------------------------------------
// Fetch managed events via official Luma API (requires API key)
// ---------------------------------------------------------------------------

interface LumaApiPage {
  entries?: unknown[]
  has_more?: boolean
  next_cursor?: string | null
}

export async function fetchManagedEvents(apiKey: string, baseUrl = LUMA_API_BASE): Promise<CursorEvent[]> {
  const base = baseUrl.replace(/\/$/, '')
  const seen = new Map<string, CursorEvent>()
  let cursor: string | undefined

  for (let page = 0; page < MAX_PAGES; page++) {
    const params = new URLSearchParams({
      after: new Date().toISOString(),
      pagination_limit: '50',
      sort_column: 'start_at',
      sort_direction: 'asc',
    })
    if (cursor) params.set('pagination_cursor', cursor)

    const res = await fetch(`${base}/v1/calendar/list-events?${params}`, {
      headers: { 'x-luma-api-key': apiKey },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Luma API responded with ${res.status}`)

    const data = (await res.json()) as LumaApiPage
    for (const e of data.entries ?? []) {
      const ev = mapLumaEntry(e)
      if (ev) seen.set(ev.id, ev)
    }
    if (!data.has_more || !data.next_cursor) break
    cursor = data.next_cursor
  }

  return Array.from(seen.values())
    .filter(isFutureEvent)
    .sort((a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time))
}

// ---------------------------------------------------------------------------
// Import people to the calendar tied to the API key (Luma Plus / developer key)
// https://docs.luma.com/reference/post_v1-calendar-import-people
// ---------------------------------------------------------------------------

export interface LumaImportPerson {
  email: string
  name?: string | null
}

export async function importCalendarPeople(
  apiKey: string,
  infos: LumaImportPerson[],
  options?: { baseUrl?: string; tagNames?: string[] },
): Promise<Response> {
  const base = (options?.baseUrl ?? LUMA_API_BASE).replace(/\/$/, '')
  const body: Record<string, unknown> = { infos }
  if (options?.tagNames?.length) {
    body.tag_names = options.tagNames
  }
  return fetch(`${base}/v1/calendar/import-people`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-luma-api-key': apiKey,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
}

// ---------------------------------------------------------------------------
// Fetch listed events from public calendar page (no API key needed)
// ---------------------------------------------------------------------------

function extractEntries(html: string): JsonObj[] {
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)
  if (!m) return []

  const collect = (node: unknown, out: JsonObj[]) => {
    if (isObject(node)) {
      if (typeof node.name === 'string' && typeof node.start_at === 'string') out.push(node)
      for (const v of Object.values(node)) collect(v, out)
    } else if (Array.isArray(node)) {
      for (const v of node) collect(v, out)
    }
  }

  const entries: JsonObj[] = []
  try { collect(JSON.parse(m[1]), entries) } catch { /* malformed JSON */ }
  return entries
}

export async function fetchCalendarPageEvents(calendarSlug: string): Promise<CursorEvent[]> {
  const slug = calendarSlug.replace(/^\/+/, '').trim()
  if (!slug) return []

  const res = await fetch(`${LUMA_PUBLIC_BASE}/${slug}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Luma calendar page responded with ${res.status}`)

  const raw = extractEntries(await res.text())
  const seen = new Map<string, CursorEvent>()
  for (const e of raw) {
    const ev = mapLumaEntry(e)
    if (ev) seen.set(ev.id, ev)
  }

  return Array.from(seen.values())
    .filter(isFutureEvent)
    .sort((a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time))
}

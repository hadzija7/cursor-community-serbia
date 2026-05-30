import { siteConfig } from '@/content/site.config'
import { getDb } from '@/lib/db'
import { getLumaCityCalendars, importCalendarPeople } from '@/lib/luma'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254

// ---------------- simple in-memory rate limiter ----------------
const RATE_WINDOW_MS = 60_000
const RATE_MAX_REQUESTS = 5

const requestCounts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = requestCounts.get(ip)
  if (!entry || now >= entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > RATE_MAX_REQUESTS
}

interface SubscribeRequest {
  email?: string
}

function toError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status })
}

/** Adds the email to each configured city Luma calendar. Best-effort; does not throw. */
async function syncSubscriberToLuma(email: string) {
  const calendars = getLumaCityCalendars()
  if (calendars.length === 0) return

  const baseUrl = process.env.LUMA_API_BASE_URL?.trim()
  const tagRaw = process.env.LUMA_IMPORT_TAG_NAMES?.trim()
  const tagNames = tagRaw
    ? tagRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : undefined
  const importOptions = {
    ...(baseUrl ? { baseUrl } : {}),
    ...(tagNames?.length ? { tagNames } : {}),
  }

  const results = await Promise.allSettled(
    calendars.map(async ({ city, apiKey }) => {
      const res = await importCalendarPeople(apiKey, [{ email }], importOptions)
      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        throw new Error(`Luma import-people failed for ${city}: ${res.status} ${detail}`)
      }
    }),
  )

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('Luma import-people error:', result.reason)
    }
  }
}

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return toError('Too many requests. Please try again later.', 429)
  }

  let payload: SubscribeRequest

  try {
    payload = (await request.json()) as SubscribeRequest
  } catch {
    return toError('Invalid request body.', 400)
  }

  const email = payload.email?.trim().toLowerCase()
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return toError('Please provide a valid email address.', 400)
  }

  const db = getDb()
  const webhookUrl = process.env.MAILING_LIST_WEBHOOK_URL

  if (db) {
    let inserted = false
    try {
      const result = await db`
        INSERT INTO subscribers (email, source, community)
        VALUES (${email}, 'website-subscribe-form', ${siteConfig.communityName})
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `
      inserted = result.length > 0
    } catch (err) {
      console.error('Postgres subscribe error:', err instanceof Error ? err.message : 'unknown')
      return toError('Could not save subscription.', 500)
    }

    if (webhookUrl && inserted) {
      const apiKey = process.env.MAILING_LIST_API_KEY
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      }
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            email,
            source: 'website-subscribe-form',
            community: siteConfig.communityName,
            subscribedAt: new Date().toISOString(),
          }),
          cache: 'no-store',
        })
      } catch {
        // Log but don't fail - Postgres write succeeded
        console.error('Webhook notify failed')
      }
    }

    if (inserted) {
      await syncSubscriberToLuma(email)
    }

    return Response.json({
      ok: true,
      message: 'Subscribed successfully.',
      alreadySubscribed: !inserted,
    })
  }

  if (webhookUrl) {
    const apiKey = process.env.MAILING_LIST_API_KEY
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    }

    try {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          source: 'website-subscribe-form',
          community: siteConfig.communityName,
          subscribedAt: new Date().toISOString(),
        }),
        cache: 'no-store',
      })

      if (!upstream.ok) {
        return toError('Mailing list provider rejected the request.', 502)
      }
    } catch {
      return toError('Could not reach mailing list provider.', 502)
    }

    await syncSubscriberToLuma(email)

    return Response.json({ ok: true, message: 'Subscribed successfully.' })
  }

  return toError('Mailing list subscription is not configured.', 503)
}

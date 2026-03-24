import { siteConfig } from '@/content/site.config'
import { getDb } from '@/lib/db'
import { importCalendarPeople } from '@/lib/luma'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SubscribeRequest {
  email?: string
}

function toError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status })
}

/** Adds the email to the Luma calendar linked to LUMA_API_KEY. Best-effort; does not throw. */
async function syncSubscriberToLuma(email: string) {
  const apiKey = process.env.LUMA_API_KEY?.trim()
  if (!apiKey) return

  const baseUrl = process.env.LUMA_API_BASE_URL?.trim()
  const tagRaw = process.env.LUMA_IMPORT_TAG_NAMES?.trim()
  const tagNames = tagRaw
    ? tagRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : undefined

  try {
    const res = await importCalendarPeople(apiKey, [{ email }], {
      ...(baseUrl ? { baseUrl } : {}),
      ...(tagNames?.length ? { tagNames } : {}),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('Luma import-people failed:', res.status, detail)
    }
  } catch (err) {
    console.error('Luma import-people error:', err)
  }
}

export async function POST(request: Request) {
  let payload: SubscribeRequest

  try {
    payload = (await request.json()) as SubscribeRequest
  } catch {
    return toError('Invalid request body.', 400)
  }

  const email = payload.email?.trim().toLowerCase()
  if (!email || !EMAIL_PATTERN.test(email)) {
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
      console.error('Postgres subscribe error:', err)
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
        console.error('Webhook notify failed:', webhookUrl)
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

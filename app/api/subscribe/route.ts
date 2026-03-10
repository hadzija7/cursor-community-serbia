import { siteConfig } from '@/content/site.config'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SubscribeRequest {
  email?: string
}

function toError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status })
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

  const webhookUrl = process.env.MAILING_LIST_WEBHOOK_URL
  if (!webhookUrl) {
    return toError('Mailing list subscription is not configured.', 503)
  }

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

  return Response.json({ ok: true, message: 'Subscribed successfully.' })
}

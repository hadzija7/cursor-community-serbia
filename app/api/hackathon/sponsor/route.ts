import { siteConfig } from '@/content/site.config'
import { getDb } from '@/lib/db'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SponsorApplicationRequest {
  companyName?: string
  contactName?: string
  email?: string
  website?: string
  message?: string
}

function toError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status })
}

export async function POST(request: Request) {
  let payload: SponsorApplicationRequest

  try {
    payload = (await request.json()) as SponsorApplicationRequest
  } catch {
    return toError('Invalid request body.', 400)
  }

  const companyName = payload.companyName?.trim()
  const contactName = payload.contactName?.trim()
  const email = payload.email?.trim().toLowerCase()
  const website = payload.website?.trim() || null
  const message = payload.message?.trim() || null

  if (!companyName || !contactName) {
    return toError('Company name and contact name are required.', 400)
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return toError('Please provide a valid email address.', 400)
  }

  const db = getDb()
  const webhookUrl = process.env.HACKATHON_SPONSOR_WEBHOOK_URL ?? process.env.MAILING_LIST_WEBHOOK_URL

  const applicationPayload = {
    companyName,
    contactName,
    email,
    website,
    message,
    source: 'website-hackathon-sponsor-form',
    community: siteConfig.communityName,
    submittedAt: new Date().toISOString(),
  }

  if (db) {
    try {
      await db`
        INSERT INTO hackathon_sponsor_applications (
          company_name,
          contact_name,
          email,
          website,
          message,
          source,
          community
        )
        VALUES (
          ${companyName},
          ${contactName},
          ${email},
          ${website},
          ${message},
          'website-hackathon-sponsor-form',
          ${siteConfig.communityName}
        )
      `
    } catch (err) {
      console.error('Postgres hackathon sponsor error:', err)
      return toError('Could not save sponsorship application.', 500)
    }

    if (webhookUrl) {
      const apiKey = process.env.HACKATHON_SPONSOR_API_KEY ?? process.env.MAILING_LIST_API_KEY
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      }
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(applicationPayload),
          cache: 'no-store',
        })
      } catch {
        console.error('Hackathon sponsor webhook notify failed:', webhookUrl)
      }
    }

    return Response.json({ ok: true, message: 'Application submitted successfully.' })
  }

  if (webhookUrl) {
    const apiKey = process.env.HACKATHON_SPONSOR_API_KEY ?? process.env.MAILING_LIST_API_KEY
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    }

    try {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(applicationPayload),
        cache: 'no-store',
      })

      if (!upstream.ok) {
        return toError('Sponsorship provider rejected the request.', 502)
      }
    } catch {
      return toError('Could not reach sponsorship provider.', 502)
    }

    return Response.json({ ok: true, message: 'Application submitted successfully.' })
  }

  return toError('Sponsorship applications are not configured.', 503)
}

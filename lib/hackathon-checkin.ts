import { NextResponse } from 'next/server'
import { hackathonConfig } from '@/content/hackathon'
import {
  fetchEventGuestStatus,
  resolveEventApiId,
  type LumaGuestStatus,
} from '@/lib/luma'

let cachedEventId: string | null = null

async function getEventApiId(): Promise<string | null> {
  if (cachedEventId) return cachedEventId
  const id = await resolveEventApiId(hackathonConfig.lumaUrl)
  if (id) cachedEventId = id
  return id
}

/** Resolve Luma guest status for an email. Returns null when verification is unavailable. */
export async function resolveHackerLumaStatus(
  email: string,
): Promise<LumaGuestStatus | null> {
  const apiKey = process.env.LUMA_BELGRADE_API_KEY?.trim()
  if (!apiKey) return null

  const eventApiId = await getEventApiId()
  if (!eventApiId) return null

  return fetchEventGuestStatus(
    apiKey,
    eventApiId,
    email,
    process.env.LUMA_API_BASE_URL,
  )
}

/**
 * Gate for checked-in-only actions (credit claims, project submissions).
 * Returns a NextResponse error when the user is not checked in, or null when allowed.
 */
export async function assertCheckedIn(
  email: string,
  notCheckedInMessage: string,
): Promise<NextResponse | null> {
  const status = await resolveHackerLumaStatus(email)

  if (status === null) {
    return NextResponse.json(
      { error: 'Check-in verification unavailable' },
      { status: 503 },
    )
  }

  if (status !== 'checked_in') {
    const message =
      status === 'registered'
        ? notCheckedInMessage
        : 'You must be registered and checked in at the event to submit'

    return NextResponse.json({ error: message, lumaStatus: status }, { status: 403 })
  }

  return null
}

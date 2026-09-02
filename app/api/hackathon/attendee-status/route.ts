import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { hackathonConfig } from '@/content/hackathon'
import {
  fetchEventGuestStatus,
  resolveEventApiId,
  type LumaGuestStatus,
} from '@/lib/luma'

export const dynamic = 'force-dynamic'

let cachedEventId: string | null = null

async function getEventApiId(): Promise<string | null> {
  if (cachedEventId) return cachedEventId

  const id = await resolveEventApiId(hackathonConfig.lumaUrl)
  if (id) cachedEventId = id
  return id
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const apiKey = process.env.LUMA_BELGRADE_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json({
      lumaStatus: 'not_found' as LumaGuestStatus,
      email: session.user.email,
      note: 'Luma API key not configured',
    })
  }

  const eventApiId = await getEventApiId()
  if (!eventApiId) {
    return NextResponse.json({
      lumaStatus: 'not_found' as LumaGuestStatus,
      email: session.user.email,
      note: 'Could not resolve event ID',
    })
  }

  const lumaStatus = await fetchEventGuestStatus(
    apiKey,
    eventApiId,
    session.user.email,
    process.env.LUMA_API_BASE_URL,
  )

  return NextResponse.json({
    lumaStatus,
    email: session.user.email,
  })
}

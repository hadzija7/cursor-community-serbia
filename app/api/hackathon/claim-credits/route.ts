import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { hackathonConfig } from '@/content/hackathon'
import { getCreditCode } from '@/lib/credit-codes'
import { getDb } from '@/lib/db'
import {
  fetchEventGuestStatus,
  resolveEventApiId,
} from '@/lib/luma'

export const dynamic = 'force-dynamic'

let cachedEventId: string | null = null

async function getEventApiId(): Promise<string | null> {
  if (cachedEventId) return cachedEventId
  const id = await resolveEventApiId(hackathonConfig.lumaUrl)
  if (id) cachedEventId = id
  return id
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = (await request.json()) as { sponsorId?: string }
  const sponsorId = body.sponsorId
  if (!sponsorId || typeof sponsorId !== 'string') {
    return NextResponse.json({ error: 'Missing sponsorId' }, { status: 400 })
  }

  const code = getCreditCode(sponsorId)
  if (!code) {
    return NextResponse.json({ error: 'No credit code available for this sponsor' }, { status: 404 })
  }

  const apiKey = process.env.LUMA_BELGRADE_API_KEY?.trim()
  if (apiKey) {
    const eventApiId = await getEventApiId()
    if (eventApiId) {
      const status = await fetchEventGuestStatus(
        apiKey,
        eventApiId,
        session.user.email,
        process.env.LUMA_API_BASE_URL,
      )
      if (status !== 'checked_in') {
        return NextResponse.json(
          { error: 'You must be checked in at the event to claim credits' },
          { status: 403 },
        )
      }
    }
  }

  const db = getDb()
  if (db) {
    try {
      const existing = await db`
        SELECT id FROM hackathon_credit_claims
        WHERE email = ${session.user.email} AND sponsor_id = ${sponsorId}
        LIMIT 1
      `

      if (existing.length === 0) {
        await db`
          INSERT INTO hackathon_credit_claims (email, sponsor_id)
          VALUES (${session.user.email}, ${sponsorId})
          ON CONFLICT (email, sponsor_id) DO NOTHING
        `
      }
    } catch (err) {
      console.error('Failed to record credit claim:', err)
    }
  }

  return NextResponse.json({ code, sponsorId })
}

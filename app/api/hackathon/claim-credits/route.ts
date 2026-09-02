import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { hackathonConfig } from '@/content/hackathon'
import {
  getSharedCreditCode,
  hasCreditCode,
  isPoolSponsor,
} from '@/lib/credit-codes'
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

async function assertCheckedIn(email: string): Promise<NextResponse | null> {
  const apiKey = process.env.LUMA_BELGRADE_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Check-in verification unavailable' },
      { status: 503 },
    )
  }

  const eventApiId = await getEventApiId()
  if (!eventApiId) {
    return NextResponse.json(
      { error: 'Check-in verification unavailable' },
      { status: 503 },
    )
  }

  const status = await fetchEventGuestStatus(
    apiKey,
    eventApiId,
    email,
    process.env.LUMA_API_BASE_URL,
  )
  if (status !== 'checked_in') {
    return NextResponse.json(
      { error: 'You must be checked in at the event to claim credits' },
      { status: 403 },
    )
  }

  return null
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === '23505'
  )
}

async function claimPoolCode(
  sponsorId: string,
  email: string,
): Promise<{ code: string } | { error: string; status: number }> {
  const db = getDb()
  if (!db) {
    return { error: 'Database unavailable', status: 503 }
  }

  try {
    const existing = await db`
      SELECT code FROM hackathon_referral_codes
      WHERE sponsor_id = ${sponsorId} AND claimed_by = ${email}
      LIMIT 1
    `
    if (existing[0]?.code) {
      return { code: existing[0].code as string }
    }

    // Retry a few times in case two claimants race the same row, or the same
    // email concurrently claims two different free rows (unique index on claimed_by).
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const claimed = await db`
          UPDATE hackathon_referral_codes
          SET claimed_by = ${email}, claimed_at = now()
          WHERE id = (
            SELECT id FROM hackathon_referral_codes
            WHERE sponsor_id = ${sponsorId} AND claimed_by IS NULL
            ORDER BY created_at ASC, id ASC
            LIMIT 1
          )
          AND claimed_by IS NULL
          RETURNING code
        `
        if (claimed[0]?.code) {
          return { code: claimed[0].code as string }
        }
      } catch (err) {
        if (!isUniqueViolation(err)) throw err
        // Same email already assigned via a concurrent request — read it below.
      }

      const again = await db`
        SELECT code FROM hackathon_referral_codes
        WHERE sponsor_id = ${sponsorId} AND claimed_by = ${email}
        LIMIT 1
      `
      if (again[0]?.code) {
        return { code: again[0].code as string }
      }
    }

    return { error: 'No referral codes left for this sponsor', status: 410 }
  } catch (err) {
    console.error('Failed to claim pool code:', err)
    return { error: 'Failed to claim referral code', status: 500 }
  }
}

async function claimSharedCode(sponsorId: string, email: string): Promise<void> {
  const db = getDb()
  if (!db) return

  try {
    await db`
      INSERT INTO hackathon_credit_claims (email, sponsor_id)
      VALUES (${email}, ${sponsorId})
      ON CONFLICT (email, sponsor_id) DO NOTHING
    `
  } catch (err) {
    console.error('Failed to record credit claim:', err)
  }
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

  if (!hasCreditCode(sponsorId)) {
    return NextResponse.json({ error: 'No credit code available for this sponsor' }, { status: 404 })
  }

  const denied = await assertCheckedIn(session.user.email)
  if (denied) return denied

  if (isPoolSponsor(sponsorId)) {
    const result = await claimPoolCode(sponsorId, session.user.email)
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    return NextResponse.json({ code: result.code, sponsorId, kind: 'referral' })
  }

  const code = getSharedCreditCode(sponsorId)
  if (!code) {
    return NextResponse.json({ error: 'No credit code available for this sponsor' }, { status: 404 })
  }

  await claimSharedCode(sponsorId, session.user.email)
  return NextResponse.json({ code, sponsorId, kind: 'shared' })
}

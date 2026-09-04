import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getSharedCreditCode,
  hasCreditCode,
  isCursor50Pool,
  isCursorPool,
  isPoolSponsor,
} from '@/lib/credit-codes'
import { getDb } from '@/lib/db'
import { assertCheckedIn } from '@/lib/hackathon-checkin'

export const dynamic = 'force-dynamic'

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === '23505'
  )
}

async function claimCursorPoolCode(
  email: string,
): Promise<{ code: string } | { error: string; status: number }> {
  const db = getDb()
  if (!db) {
    return { error: 'Database unavailable', status: 503 }
  }

  const sponsorId = 'cursor'

  try {
    const existing = await db`
      SELECT code FROM hackathon_referral_codes
      WHERE sponsor_id = ${sponsorId} AND claimed_by = ${email}
      LIMIT 1
    `
    if (existing[0]?.code) {
      return { code: existing[0].code as string }
    }

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

    return { error: 'No $20 Cursor referral codes left', status: 410 }
  } catch (err) {
    console.error('Failed to claim $20 Cursor pool code:', err)
    return { error: 'Failed to claim referral code', status: 500 }
  }
}

async function claimCursor50PoolCode(
  email: string,
): Promise<{ code: string } | { error: string; status: number }> {
  const db = getDb()
  if (!db) {
    return { error: 'Database unavailable', status: 503 }
  }

  try {
    const existing = await db`
      SELECT code FROM hackathon_grok_bot_referral_codes
      WHERE claimed_by = ${email}
      LIMIT 1
    `
    if (existing[0]?.code) {
      return { code: existing[0].code as string }
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const claimed = await db`
          UPDATE hackathon_grok_bot_referral_codes
          SET claimed_by = ${email}, claimed_at = now()
          WHERE id = (
            SELECT id FROM hackathon_grok_bot_referral_codes
            WHERE claimed_by IS NULL
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
      }

      const again = await db`
        SELECT code FROM hackathon_grok_bot_referral_codes
        WHERE claimed_by = ${email}
        LIMIT 1
      `
      if (again[0]?.code) {
        return { code: again[0].code as string }
      }
    }

    return { error: 'No $50 Cursor referral codes left', status: 410 }
  } catch (err) {
    console.error('Failed to claim $50 Cursor pool code:', err)
    return { error: 'Failed to claim referral code', status: 500 }
  }
}

async function claimPoolCode(
  sponsorId: string,
  email: string,
): Promise<{ code: string } | { error: string; status: number }> {
  if (isCursor50Pool(sponsorId)) {
    return claimCursor50PoolCode(email)
  }
  if (isCursorPool(sponsorId)) {
    return claimCursorPoolCode(email)
  }
  return { error: 'Unknown referral pool', status: 404 }
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

  const denied = await assertCheckedIn(
    session.user.email,
    'You must be checked in at the event to claim credits',
  )
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

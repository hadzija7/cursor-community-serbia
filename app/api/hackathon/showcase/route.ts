import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { normalizeEmail } from '@/lib/project-team'
import {
  listShowcaseSlots,
  mergeShowcaseAgenda,
  normalizeShowcaseTeamName,
  parseShowcaseSlotIndex,
  type ShowcaseAgendaRow,
  type ShowcaseBooking,
} from '@/lib/showcase-slots'

export const dynamic = 'force-dynamic'

export type ShowcaseSlotJson = ShowcaseAgendaRow

export type ShowcaseBookedSlot = {
  index: number
  startsAt: string
  endsAt: string
  label: string
  teamName: string
}

type ShowcaseRow = {
  slot_index: number
  team_name: string
  submitted_email?: string | null
}

function toError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status })
}

function postgresErrorCode(err: unknown): string | null {
  if (typeof err !== 'object' || err === null) return null
  if ('code' in err && typeof (err as { code: unknown }).code === 'string') {
    return (err as { code: string }).code
  }
  if ('cause' in err) {
    return postgresErrorCode((err as { cause: unknown }).cause)
  }
  return null
}

async function viewerEmail(): Promise<string | null> {
  const session = await auth()
  const email = session?.user?.email
  if (!email) return null
  return normalizeEmail(email)
}

function bookedSlotFromBooking(booking: ShowcaseBooking): ShowcaseBookedSlot | null {
  const def = listShowcaseSlots()[booking.slotIndex]
  if (!def) return null
  return {
    index: def.index,
    startsAt: def.startsAt,
    endsAt: def.endsAt,
    label: def.label,
    teamName: booking.teamName,
  }
}

function bookingFromRow(row: ShowcaseRow): ShowcaseBooking {
  return {
    slotIndex: row.slot_index,
    teamName: row.team_name,
    submittedEmail: row.submitted_email ? normalizeEmail(row.submitted_email) : null,
  }
}

function agendaPayload(bookings: ShowcaseBooking[], email: string | null) {
  const slots = mergeShowcaseAgenda(bookings)
  const mine = email
    ? bookings.find((booking) => booking.submittedEmail === email) ?? null
    : null
  return {
    slots,
    remaining: slots.filter((slot) => slot.open).length,
    signedIn: Boolean(email),
    myBooking: mine ? bookedSlotFromBooking(mine) : null,
  }
}

async function ensureShowcaseTable(db: NonNullable<ReturnType<typeof getDb>>) {
  await db`
    CREATE TABLE IF NOT EXISTS hackathon_showcase_slots (
      slot_index INTEGER PRIMARY KEY CHECK (slot_index >= 0 AND slot_index < 12),
      team_name TEXT NOT NULL,
      team_key TEXT NOT NULL UNIQUE,
      submitted_email TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await db`
    ALTER TABLE hackathon_showcase_slots
    ADD COLUMN IF NOT EXISTS submitted_email TEXT
  `
  await db`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_hackathon_showcase_submitted_email_lower
    ON hackathon_showcase_slots (lower(submitted_email))
    WHERE submitted_email IS NOT NULL
  `
}

async function loadBookings(db: NonNullable<ReturnType<typeof getDb>>): Promise<ShowcaseBooking[]> {
  const rows = (await db`
    SELECT slot_index, team_name, submitted_email
    FROM hackathon_showcase_slots
    ORDER BY slot_index ASC
  `) as ShowcaseRow[]

  return rows.map(bookingFromRow)
}

async function findBookingByTeamKey(
  db: NonNullable<ReturnType<typeof getDb>>,
  teamKey: string,
): Promise<ShowcaseBooking | null> {
  const rows = (await db`
    SELECT slot_index, team_name, submitted_email
    FROM hackathon_showcase_slots
    WHERE team_key = ${teamKey}
    LIMIT 1
  `) as ShowcaseRow[]
  return rows[0] ? bookingFromRow(rows[0]) : null
}

async function findBookingByEmail(
  db: NonNullable<ReturnType<typeof getDb>>,
  email: string,
): Promise<ShowcaseBooking | null> {
  const rows = (await db`
    SELECT slot_index, team_name, submitted_email
    FROM hackathon_showcase_slots
    WHERE lower(submitted_email) = ${email}
    LIMIT 1
  `) as ShowcaseRow[]
  return rows[0] ? bookingFromRow(rows[0]) : null
}

async function findBookingBySlot(
  db: NonNullable<ReturnType<typeof getDb>>,
  slotIndex: number,
): Promise<ShowcaseBooking | null> {
  const rows = (await db`
    SELECT slot_index, team_name, submitted_email
    FROM hackathon_showcase_slots
    WHERE slot_index = ${slotIndex}
    LIMIT 1
  `) as ShowcaseRow[]
  return rows[0] ? bookingFromRow(rows[0]) : null
}

function ownedBy(booking: ShowcaseBooking, email: string): boolean {
  return booking.submittedEmail === email
}

export async function GET() {
  const db = getDb()
  if (!db) {
    return toError('Database unavailable.', 503)
  }

  try {
    await ensureShowcaseTable(db)
    const email = await viewerEmail()
    const bookings = await loadBookings(db)
    return Response.json(agendaPayload(bookings, email))
  } catch (err) {
    console.error('hackathon showcase GET failed:', err)
    return toError('Could not load the showcase agenda.', 500)
  }
}

export async function POST(request: Request) {
  const email = await viewerEmail()
  if (!email) {
    return toError('Sign in to book a showcase slot.', 401)
  }

  let payload: { teamName?: unknown; slotIndex?: unknown }

  try {
    payload = (await request.json()) as { teamName?: unknown; slotIndex?: unknown }
  } catch {
    return toError('Invalid request body.', 400)
  }

  const parsed = normalizeShowcaseTeamName(payload.teamName)
  if (!parsed.ok) {
    return toError(parsed.message, 400)
  }

  const slot = parseShowcaseSlotIndex(payload.slotIndex)
  if (!slot.ok) {
    return toError(slot.message, 400)
  }

  const db = getDb()
  if (!db) {
    return toError('Database unavailable.', 503)
  }

  try {
    await ensureShowcaseTable(db)

    const mine = await findBookingByEmail(db, email)
    const atSlot = await findBookingBySlot(db, slot.index)
    if (atSlot && !ownedBy(atSlot, email)) {
      return toError('That slot is already taken.', 409)
    }

    const byTeam = await findBookingByTeamKey(db, parsed.key)
    if (byTeam && !ownedBy(byTeam, email)) {
      return toError('That team name already has a slot.', 409)
    }

    if (mine) {
      if (mine.slotIndex === slot.index && mine.teamName === parsed.name) {
        const booked = bookedSlotFromBooking(mine)
        if (!booked) {
          return toError('Could not book a showcase slot.', 500)
        }
        return Response.json({ ok: true, alreadyBooked: true, moved: false, slot: booked })
      }

      try {
        const updated = (await db`
          UPDATE hackathon_showcase_slots
          SET slot_index = ${slot.index},
              team_name = ${parsed.name},
              team_key = ${parsed.key}
          WHERE lower(submitted_email) = ${email}
          RETURNING slot_index, team_name, submitted_email
        `) as ShowcaseRow[]
        const row = updated[0]
        if (!row) {
          return toError('Could not update your showcase slot.', 500)
        }
        const booked = bookedSlotFromBooking(bookingFromRow(row))
        if (!booked) {
          return toError('Could not book a showcase slot.', 500)
        }
        return Response.json({
          ok: true,
          alreadyBooked: false,
          moved: mine.slotIndex !== slot.index,
          slot: booked,
        })
      } catch (err) {
        if (postgresErrorCode(err) === '23505') {
          return toError('That slot is already taken.', 409)
        }
        throw err
      }
    }

    try {
      const inserted = (await db`
        INSERT INTO hackathon_showcase_slots (slot_index, team_name, team_key, submitted_email)
        VALUES (${slot.index}, ${parsed.name}, ${parsed.key}, ${email})
        RETURNING slot_index, team_name, submitted_email
      `) as ShowcaseRow[]
      const row = inserted[0]
      if (!row) {
        return toError('Could not book a showcase slot.', 500)
      }
      const booked = bookedSlotFromBooking(bookingFromRow(row))
      if (!booked) {
        return toError('Could not book a showcase slot.', 500)
      }
      return Response.json({ ok: true, alreadyBooked: false, moved: false, slot: booked })
    } catch (err) {
      if (postgresErrorCode(err) === '23505') {
        return toError('That slot is already taken.', 409)
      }
      throw err
    }
  } catch (err) {
    console.error('hackathon showcase POST failed:', err)
    return toError('Could not book a showcase slot.', 500)
  }
}

export async function DELETE() {
  const email = await viewerEmail()
  if (!email) {
    return toError('Sign in to cancel your showcase slot.', 401)
  }

  const db = getDb()
  if (!db) {
    return toError('Database unavailable.', 503)
  }

  try {
    await ensureShowcaseTable(db)
    const deleted = (await db`
      DELETE FROM hackathon_showcase_slots
      WHERE lower(submitted_email) = ${email}
      RETURNING slot_index, team_name, submitted_email
    `) as ShowcaseRow[]
    const row = deleted[0]
    if (!row) {
      return toError('You do not have a showcase slot to cancel.', 404)
    }
    const slot = bookedSlotFromBooking(bookingFromRow(row))
    return Response.json({ ok: true, cancelled: true, slot })
  } catch (err) {
    console.error('hackathon showcase DELETE failed:', err)
    return toError('Could not cancel your showcase slot.', 500)
  }
}

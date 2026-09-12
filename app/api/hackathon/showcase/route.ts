import { getDb } from '@/lib/db'
import {
  SHOWCASE_SLOT_COUNT,
  listShowcaseSlots,
  mergeShowcaseAgenda,
  normalizeShowcaseTeamName,
  type ShowcaseAgendaRow,
  type ShowcaseBooking,
} from '@/lib/showcase-slots'

export const dynamic = 'force-dynamic'

const LAST_SLOT_INDEX = SHOWCASE_SLOT_COUNT - 1

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

function agendaPayload(bookings: ShowcaseBooking[]) {
  const slots = mergeShowcaseAgenda(bookings)
  return {
    slots,
    remaining: slots.filter((slot) => slot.open).length,
  }
}

async function ensureShowcaseTable(db: NonNullable<ReturnType<typeof getDb>>) {
  await db`
    CREATE TABLE IF NOT EXISTS hackathon_showcase_slots (
      slot_index INTEGER PRIMARY KEY CHECK (slot_index >= 0 AND slot_index < 12),
      team_name TEXT NOT NULL,
      team_key TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
}

async function loadBookings(db: NonNullable<ReturnType<typeof getDb>>): Promise<ShowcaseBooking[]> {
  const rows = (await db`
    SELECT slot_index, team_name
    FROM hackathon_showcase_slots
    ORDER BY slot_index ASC
  `) as ShowcaseRow[]

  return rows.map((row) => ({
    slotIndex: row.slot_index,
    teamName: row.team_name,
  }))
}

async function findBookingByTeamKey(
  db: NonNullable<ReturnType<typeof getDb>>,
  teamKey: string,
): Promise<ShowcaseBooking | null> {
  const rows = (await db`
    SELECT slot_index, team_name
    FROM hackathon_showcase_slots
    WHERE team_key = ${teamKey}
    LIMIT 1
  `) as ShowcaseRow[]

  const row = rows[0]
  if (!row) return null
  return { slotIndex: row.slot_index, teamName: row.team_name }
}

async function insertNextSlot(
  db: NonNullable<ReturnType<typeof getDb>>,
  teamName: string,
  teamKey: string,
): Promise<ShowcaseBooking | 'full'> {
  const rows = (await db`
    INSERT INTO hackathon_showcase_slots (slot_index, team_name, team_key)
    SELECT n, ${teamName}, ${teamKey}
    FROM generate_series(0, ${LAST_SLOT_INDEX}) AS n
    WHERE NOT EXISTS (
      SELECT 1 FROM hackathon_showcase_slots s WHERE s.slot_index = n
    )
    ORDER BY n
    LIMIT 1
    RETURNING slot_index, team_name
  `) as ShowcaseRow[]

  const row = rows[0]
  if (!row) return 'full'
  return { slotIndex: row.slot_index, teamName: row.team_name }
}

export async function GET() {
  const db = getDb()
  if (!db) {
    return toError('Database unavailable.', 503)
  }

  try {
    await ensureShowcaseTable(db)
    const bookings = await loadBookings(db)
    return Response.json(agendaPayload(bookings))
  } catch (err) {
    console.error('hackathon showcase GET failed:', err)
    return toError('Could not load the showcase agenda.', 500)
  }
}

export async function POST(request: Request) {
  let payload: { teamName?: unknown }

  try {
    payload = (await request.json()) as { teamName?: unknown }
  } catch {
    return toError('Invalid request body.', 400)
  }

  const parsed = normalizeShowcaseTeamName(payload.teamName)
  if (!parsed.ok) {
    return toError(parsed.message, 400)
  }

  const db = getDb()
  if (!db) {
    return toError('Database unavailable.', 503)
  }

  try {
    await ensureShowcaseTable(db)

    const existing = await findBookingByTeamKey(db, parsed.key)
    if (existing) {
      const slot = bookedSlotFromBooking(existing)
      if (!slot) {
        return toError('Could not book a showcase slot.', 500)
      }
      return Response.json({ ok: true, alreadyBooked: true, slot })
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const inserted = await insertNextSlot(db, parsed.name, parsed.key)
        if (inserted === 'full') {
          return toError('All showcase slots are taken.', 409)
        }
        const slot = bookedSlotFromBooking(inserted)
        if (!slot) {
          return toError('Could not book a showcase slot.', 500)
        }
        return Response.json({ ok: true, alreadyBooked: false, slot })
      } catch (err) {
        if (postgresErrorCode(err) !== '23505') {
          throw err
        }
        const raced = await findBookingByTeamKey(db, parsed.key)
        if (raced) {
          const slot = bookedSlotFromBooking(raced)
          if (!slot) {
            return toError('Could not book a showcase slot.', 500)
          }
          return Response.json({ ok: true, alreadyBooked: true, slot })
        }
      }
    }

    return toError('Could not book a showcase slot. Please try again.', 409)
  } catch (err) {
    console.error('hackathon showcase POST failed:', err)
    return toError('Could not book a showcase slot.', 500)
  }
}

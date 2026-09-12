/** Demo showcase agenda: 10-minute slots from 17:00 through 19:00. */

export const SHOWCASE_START_MINUTES = 17 * 60
export const SHOWCASE_SLOT_MINUTES = 10
export const SHOWCASE_SLOT_COUNT = 12
export const SHOWCASE_TEAM_NAME_MAX = 80

export type ShowcaseSlotDef = {
  index: number
  startsAt: string
  endsAt: string
  label: string
}

export type ShowcaseBooking = {
  slotIndex: number
  teamName: string
}

export type ShowcaseAgendaRow = ShowcaseSlotDef & {
  teamName: string | null
  open: boolean
}

export type TeamNameValidation =
  | { ok: true; name: string; key: string }
  | { ok: false; message: string }

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatClockMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${pad2(hours)}:${pad2(minutes)}`
}

export function listShowcaseSlots(): ShowcaseSlotDef[] {
  return Array.from({ length: SHOWCASE_SLOT_COUNT }, (_, index) => {
    const start = SHOWCASE_START_MINUTES + index * SHOWCASE_SLOT_MINUTES
    const end = start + SHOWCASE_SLOT_MINUTES
    const startsAt = formatClockMinutes(start)
    const endsAt = formatClockMinutes(end)
    return {
      index,
      startsAt,
      endsAt,
      label: `${startsAt} – ${endsAt}`,
    }
  })
}

export function normalizeShowcaseTeamName(raw: unknown): TeamNameValidation {
  if (typeof raw !== 'string') {
    return { ok: false, message: 'Team name is required.' }
  }

  const name = raw.trim().replace(/\s+/g, ' ')
  if (!name) {
    return { ok: false, message: 'Team name is required.' }
  }
  if (name.length < 2) {
    return { ok: false, message: 'Team name must be at least 2 characters.' }
  }
  if (name.length > SHOWCASE_TEAM_NAME_MAX) {
    return { ok: false, message: `Team name must be at most ${SHOWCASE_TEAM_NAME_MAX} characters.` }
  }

  return { ok: true, name, key: name.toLowerCase() }
}

export function mergeShowcaseAgenda(bookings: ShowcaseBooking[]): ShowcaseAgendaRow[] {
  const byIndex = new Map<number, string>()
  for (const booking of bookings) {
    if (booking.slotIndex < 0 || booking.slotIndex >= SHOWCASE_SLOT_COUNT) continue
    if (!byIndex.has(booking.slotIndex)) {
      byIndex.set(booking.slotIndex, booking.teamName)
    }
  }

  return listShowcaseSlots().map((slot) => {
    const teamName = byIndex.get(slot.index) ?? null
    return {
      ...slot,
      teamName,
      open: teamName == null,
    }
  })
}

export function nextOpenSlotIndex(bookings: ShowcaseBooking[]): number | null {
  const taken = new Set(
    bookings
      .map((booking) => booking.slotIndex)
      .filter((index) => index >= 0 && index < SHOWCASE_SLOT_COUNT),
  )
  for (let index = 0; index < SHOWCASE_SLOT_COUNT; index += 1) {
    if (!taken.has(index)) return index
  }
  return null
}

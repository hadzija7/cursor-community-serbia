import { describe, expect, it } from 'vitest'
import {
  SHOWCASE_SLOT_COUNT,
  listShowcaseSlots,
  mergeShowcaseAgenda,
  nextOpenSlotIndex,
  normalizeShowcaseTeamName,
} from '@/lib/showcase-slots'

describe('showcase slots', () => {
  it('builds twelve 10-minute slots from 17:00 to 19:00', () => {
    const slots = listShowcaseSlots()
    expect(slots).toHaveLength(SHOWCASE_SLOT_COUNT)
    expect(slots[0]).toMatchObject({
      index: 0,
      startsAt: '17:00',
      endsAt: '17:10',
      label: '17:00 – 17:10',
    })
    expect(slots[5]).toMatchObject({
      startsAt: '17:50',
      endsAt: '18:00',
    })
    expect(slots[11]).toMatchObject({
      index: 11,
      startsAt: '18:50',
      endsAt: '19:00',
      label: '18:50 – 19:00',
    })
  })

  it('fills the next open slot in time order', () => {
    expect(nextOpenSlotIndex([])).toBe(0)
    expect(nextOpenSlotIndex([{ slotIndex: 0, teamName: 'A' }])).toBe(1)
    expect(
      nextOpenSlotIndex([
        { slotIndex: 1, teamName: 'B' },
        { slotIndex: 0, teamName: 'A' },
      ]),
    ).toBe(2)
    const full = Array.from({ length: 12 }, (_, slotIndex) => ({
      slotIndex,
      teamName: `T${slotIndex}`,
    }))
    expect(nextOpenSlotIndex(full)).toBeNull()
  })

  it('merges bookings onto the published agenda', () => {
    const rows = mergeShowcaseAgenda([{ slotIndex: 2, teamName: 'baro' }])
    expect(rows[2]).toMatchObject({
      startsAt: '17:20',
      teamName: 'baro',
      open: false,
    })
    expect(rows[0]?.open).toBe(true)
    expect(rows.filter((row) => row.open)).toHaveLength(11)
  })

  it('normalizes team names and rejects empty or overlong values', () => {
    expect(normalizeShowcaseTeamName('  Baro   Team  ')).toEqual({
      ok: true,
      name: 'Baro Team',
      key: 'baro team',
    })
    expect(normalizeShowcaseTeamName('')).toMatchObject({ ok: false })
    expect(normalizeShowcaseTeamName('A')).toMatchObject({ ok: false })
    expect(normalizeShowcaseTeamName('x'.repeat(81))).toMatchObject({ ok: false })
  })
})

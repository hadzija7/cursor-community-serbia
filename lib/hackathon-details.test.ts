import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveHackathonDetails } from '@/lib/hackathon-details'
import * as luma from '@/lib/luma'

const FALLBACK = {
  title: 'Cursor Hackathon Serbia',
  tagline: 'Build the future with AI',
  date: '2026-09-12',
  displayDate: 'September 12, 2026',
  location: 'Belgrade, Serbia',
  duration: '1 full day',
  lumaUrl: 'https://luma.com/ghvnbjlx',
}

describe('resolveHackathonDetails', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns static fallback when Luma has no event', async () => {
    vi.spyOn(luma, 'fetchLumaEventBySlug').mockResolvedValue(null)

    const details = await resolveHackathonDetails(FALLBACK)

    expect(details).toMatchObject({
      ...FALLBACK,
      source: 'static',
    })
  })

  it('overrides date and location from Luma', async () => {
    vi.spyOn(luma, 'fetchLumaEventBySlug').mockResolvedValue({
      id: 'evt-1',
      title: 'Cursor Hackathon in Novi Sad',
      date: '2026-09-01',
      time: '08:00',
      displayDate: 'September 1, 2026',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/ghvnbjlx',
      status: 'upcoming',
    })

    const details = await resolveHackathonDetails(FALLBACK)

    expect(details).toMatchObject({
      title: FALLBACK.title,
      tagline: FALLBACK.tagline,
      duration: FALLBACK.duration,
      date: '2026-09-01',
      displayDate: 'September 1, 2026',
      location: 'Belgrade, Serbia',
      lumaUrl: 'https://luma.com/ghvnbjlx',
      source: 'luma',
    })
  })

  it('falls back when Luma fetch throws', async () => {
    vi.spyOn(luma, 'fetchLumaEventBySlug').mockRejectedValue(new Error('network'))

    const details = await resolveHackathonDetails(FALLBACK)

    expect(details.source).toBe('static')
    expect(details.displayDate).toBe(FALLBACK.displayDate)
  })
})

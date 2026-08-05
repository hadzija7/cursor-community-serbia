import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/hackathon/event/route'
import * as hackathonDetails from '@/lib/hackathon-details'

describe('GET /api/hackathon/event', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns resolved hackathon details', async () => {
    vi.spyOn(hackathonDetails, 'resolveHackathonDetails').mockResolvedValue({
      title: 'Cursor Hackathon Serbia',
      tagline: 'Build',
      date: '2026-09-12',
      displayDate: 'September 12, 2026',
      location: 'Belgrade, Serbia',
      duration: '1 full day',
      lumaUrl: 'https://luma.com/ghvnbjlx',
      source: 'luma',
    })

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      displayDate: 'September 12, 2026',
      location: 'Belgrade, Serbia',
      source: 'luma',
    })
  })
})

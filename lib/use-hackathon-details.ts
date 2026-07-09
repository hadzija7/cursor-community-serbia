'use client'

import { useEffect, useState } from 'react'
import { hackathonConfig } from '@/content/hackathon'
import type { HackathonDetails } from '@/lib/hackathon-details'

const POLL_MS = 5 * 60 * 1000

const INITIAL: HackathonDetails = {
  title: hackathonConfig.title,
  tagline: hackathonConfig.tagline,
  date: hackathonConfig.date,
  displayDate: hackathonConfig.displayDate,
  location: hackathonConfig.location,
  duration: hackathonConfig.duration,
  lumaUrl: hackathonConfig.lumaUrl,
  source: 'static',
}

export function useHackathonDetails(): HackathonDetails {
  const [details, setDetails] = useState<HackathonDetails>(INITIAL)

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const res = await fetch('/api/hackathon/event', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as HackathonDetails
        if (!cancelled && data?.displayDate && data?.location) setDetails(data)
      } catch {
        /* keep static fallback */
      }
    }

    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return details
}

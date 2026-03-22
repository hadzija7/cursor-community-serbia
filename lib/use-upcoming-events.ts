'use client'

import { useEffect, useState } from 'react'
import { upcomingEvents } from '@/content/events'
import { isFutureEvent } from '@/lib/event-time'
import type { CursorEvent } from '@/lib/types'

const POLL_MS = 5 * 60 * 1000
const INITIAL = upcomingEvents.filter(isFutureEvent)

export function useUpcomingEvents(): CursorEvent[] {
  const [events, setEvents] = useState<CursorEvent[]>(INITIAL)

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const res = await fetch('/api/events/upcoming', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as { events?: CursorEvent[] }
        if (!cancelled && Array.isArray(data.events)) setEvents(data.events)
      } catch {
        /* keep showing cached events */
      }
    }

    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return events
}

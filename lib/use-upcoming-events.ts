'use client'

import { useEffect, useState } from 'react'
import { upcomingEvents } from '@/content/events'
import { isFutureEvent } from '@/lib/event-time'
import type { CursorEvent } from '@/lib/types'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

interface UpcomingEventsApiResponse {
  events?: CursorEvent[]
}

const STATIC_FALLBACK_EVENTS = upcomingEvents.filter(isFutureEvent)

export function useUpcomingEvents() {
  const [events, setEvents] = useState<CursorEvent[]>(STATIC_FALLBACK_EVENTS)

  useEffect(() => {
    let isUnmounted = false

    const refresh = async () => {
      try {
        const response = await fetch('/api/events/upcoming', { cache: 'no-store' })
        if (!response.ok) {
          return
        }
        const payload = (await response.json()) as UpcomingEventsApiResponse
        if (!isUnmounted && Array.isArray(payload.events)) {
          setEvents(payload.events)
        }
      } catch {
        // Keep rendering cached/static events if live fetch fails.
      }
    }

    refresh()
    const intervalId = setInterval(refresh, REFRESH_INTERVAL_MS)

    return () => {
      isUnmounted = true
      clearInterval(intervalId)
    }
  }, [])

  return events
}

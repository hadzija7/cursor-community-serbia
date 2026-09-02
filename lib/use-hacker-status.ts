'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

export type LumaStatus = 'checked_in' | 'registered' | 'not_found'

export interface HackerStatusResult {
  status: 'loading' | 'idle' | 'error'
  lumaStatus: LumaStatus | null
  email: string | null
  refetch: () => void
}

export function useHackerStatus(): HackerStatusResult {
  const { data: session, status: sessionStatus } = useSession()
  const [lumaStatus, setLumaStatus] = useState<LumaStatus | null>(null)
  const [fetchStatus, setFetchStatus] = useState<'loading' | 'idle' | 'error'>('idle')

  const email = session?.user?.email ?? null

  const refetch = useCallback(() => {
    if (!email) return

    setFetchStatus('loading')
    fetch('/api/hackathon/attendee-status')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json() as Promise<{ lumaStatus: LumaStatus }>
      })
      .then((data) => {
        setLumaStatus(data.lumaStatus)
        setFetchStatus('idle')
      })
      .catch(() => {
        setLumaStatus(null)
        setFetchStatus('error')
      })
  }, [email])

  useEffect(() => {
    if (sessionStatus !== 'authenticated' || !email) return
    refetch()
  }, [sessionStatus, email, refetch])

  const isLoading = sessionStatus === 'loading' || fetchStatus === 'loading'

  return {
    status: isLoading ? 'loading' : fetchStatus,
    lumaStatus,
    email,
    refetch,
  }
}

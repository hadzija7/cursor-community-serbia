'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useReducer } from 'react'

export type LumaStatus = 'checked_in' | 'registered' | 'not_found'

export interface HackerStatusResult {
  status: 'loading' | 'idle' | 'error'
  lumaStatus: LumaStatus | null
  email: string | null
  refetch: () => void
}

type State = {
  fetchedFor: string | null
  fetchStatus: 'idle' | 'loading' | 'error'
  lumaStatus: LumaStatus | null
}

type Action =
  | { type: 'start'; email: string }
  | { type: 'success'; lumaStatus: LumaStatus }
  | { type: 'error' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return { ...state, fetchedFor: action.email, fetchStatus: 'loading' }
    case 'success':
      return { ...state, fetchStatus: 'idle', lumaStatus: action.lumaStatus }
    case 'error':
      return { ...state, fetchStatus: 'error', lumaStatus: null }
  }
}

const initialState: State = { fetchedFor: null, fetchStatus: 'idle', lumaStatus: null }

export function useHackerStatus(): HackerStatusResult {
  const { data: session, status: sessionStatus } = useSession()
  const [state, dispatch] = useReducer(reducer, initialState)

  const email = session?.user?.email ?? null
  const shouldFetch = sessionStatus === 'authenticated' && email && state.fetchedFor !== email

  const refetch = useCallback(() => {
    if (!email) return

    dispatch({ type: 'start', email })
    fetch('/api/hackathon/attendee-status')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json() as Promise<{ lumaStatus: LumaStatus }>
      })
      .then((data) => dispatch({ type: 'success', lumaStatus: data.lumaStatus }))
      .catch(() => dispatch({ type: 'error' }))
  }, [email])

  // Depend on session/email only — including shouldFetch would abort the in-flight
  // request as soon as dispatch('start') sets fetchedFor and flips shouldFetch to false.
  useEffect(() => {
    if (sessionStatus !== 'authenticated' || !email) return

    const controller = new AbortController()

    dispatch({ type: 'start', email })

    fetch('/api/hackathon/attendee-status', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json() as Promise<{ lumaStatus: LumaStatus }>
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'success', lumaStatus: data.lumaStatus })
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted && err instanceof Error && err.name !== 'AbortError') {
          dispatch({ type: 'error' })
        }
      })

    return () => controller.abort()
  }, [sessionStatus, email])

  const isLoading = sessionStatus === 'loading' || state.fetchStatus === 'loading' || shouldFetch

  return {
    status: isLoading ? 'loading' : state.fetchStatus,
    lumaStatus: state.lumaStatus,
    email,
    refetch,
  }
}

'use client'

import { useEffect, useState } from 'react'
import { getHackathonBasePath, isHackathonHost, type HackathonTab, hackathonHref } from '@/lib/hackathon-site'

export function useHackathonBasePath(): '' | '/hackathon' {
  const [basePath, setBasePath] = useState<'' | '/hackathon'>('/hackathon')

  useEffect(() => {
    setBasePath(getHackathonBasePath(window.location.host))
  }, [])

  return basePath
}

export function useHackathonHref(tab: HackathonTab): string {
  const basePath = useHackathonBasePath()
  return hackathonHref(basePath, tab)
}

export function useIsHackathonHost(): boolean {
  const [onHost, setOnHost] = useState(false)

  useEffect(() => {
    setOnHost(isHackathonHost(window.location.host))
  }, [])

  return onHost
}

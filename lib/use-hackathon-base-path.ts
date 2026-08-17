'use client'

import { useSyncExternalStore } from 'react'
import { getHackathonBasePath, isHackathonHost, type HackathonTab, hackathonHref } from '@/lib/hackathon-site'

function subscribe(): () => void {
  return () => {}
}

function getHostSnapshot(): string {
  return window.location.host
}

function getServerHostSnapshot(): string {
  return ''
}

function useBrowserHost(): string {
  return useSyncExternalStore(subscribe, getHostSnapshot, getServerHostSnapshot)
}

export function useHackathonBasePath(): '' | '/hackathon' {
  return getHackathonBasePath(useBrowserHost() || null)
}

export function useHackathonHref(tab: HackathonTab): string {
  return hackathonHref(useHackathonBasePath(), tab)
}

export function useIsHackathonHost(): boolean {
  return isHackathonHost(useBrowserHost() || null)
}

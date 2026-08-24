import { afterEach, describe, expect, it } from 'vitest'
import {
  getPublicHackathonHref,
  hackathonHref,
  hostnameFromHost,
  isHackathonHost,
  rewriteHackathonSubdomainPath,
  subdomainPathFromHackathonPath,
} from '@/lib/hackathon-site'

describe('hackathon site host helpers', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_HACKATHON_SITE_URL
  })

  it('treats hackathon.* hosts as the hackathon site', () => {
    expect(isHackathonHost('hackathon.cursorserbia.com')).toBe(true)
    expect(isHackathonHost('hackathon.localhost:3001')).toBe(true)
    expect(isHackathonHost('cursorserbia.com')).toBe(false)
    expect(isHackathonHost('localhost:3001')).toBe(false)
  })

  it('matches a configured public hackathon URL host', () => {
    process.env.NEXT_PUBLIC_HACKATHON_SITE_URL = 'https://hack.cursorserbia.com'
    expect(isHackathonHost('hack.cursorserbia.com')).toBe(true)
    expect(isHackathonHost('cursorserbia.com')).toBe(false)
  })

  it('strips the port from Host headers', () => {
    expect(hostnameFromHost('hackathon.localhost:3001')).toBe('hackathon.localhost')
  })

  it('rewrites subdomain paths onto /hackathon', () => {
    expect(rewriteHackathonSubdomainPath('/')).toBe('/hackathon')
    expect(rewriteHackathonSubdomainPath('/stack')).toBe('/hackathon/stack')
    expect(rewriteHackathonSubdomainPath('/guide')).toBe('/hackathon/guide')
    expect(rewriteHackathonSubdomainPath('/mentors')).toBe('/hackathon/mentors')
    expect(rewriteHackathonSubdomainPath('/prizes')).toBe('/hackathon/prizes')
    expect(rewriteHackathonSubdomainPath('/sponsor')).toBe('/hackathon/sponsor')
    expect(rewriteHackathonSubdomainPath('/hackathon/stack')).toBeNull()
    expect(rewriteHackathonSubdomainPath('/api/hackathon/event')).toBeNull()
    expect(rewriteHackathonSubdomainPath('/images/og-cursor-serbia.jpg')).toBeNull()
  })

  it('maps internal paths back to subdomain paths', () => {
    expect(subdomainPathFromHackathonPath('/hackathon')).toBe('/')
    expect(subdomainPathFromHackathonPath('/hackathon/stack')).toBe('/stack')
  })

  it('builds tab hrefs for both hosts', () => {
    expect(hackathonHref('/hackathon', 'overview')).toBe('/hackathon')
    expect(hackathonHref('', 'overview')).toBe('/')
    expect(hackathonHref('', 'stack')).toBe('/stack')
    expect(hackathonHref('/hackathon', 'prizes')).toBe('/hackathon/prizes')
    expect(hackathonHref('/hackathon', 'guide')).toBe('/hackathon/guide')
    expect(hackathonHref('', 'guide')).toBe('/guide')
    expect(hackathonHref('/hackathon', 'mentors')).toBe('/hackathon/mentors')
  })

  it('uses the configured subdomain for public community links', () => {
    expect(getPublicHackathonHref()).toBe('/hackathon')
    process.env.NEXT_PUBLIC_HACKATHON_SITE_URL = 'https://hackathon.cursorserbia.com'
    expect(getPublicHackathonHref()).toBe('https://hackathon.cursorserbia.com/')
    expect(getPublicHackathonHref('stack')).toBe('https://hackathon.cursorserbia.com/stack')
  })
})

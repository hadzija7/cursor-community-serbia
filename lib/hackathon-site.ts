export const DEFAULT_HACKATHON_SITE_HOST = 'hackathon.cursorserbia.com'

export type HackathonTab =
  | 'overview'
  | 'guide'
  | 'mentors'
  | 'stack'
  | 'prizes'
  | 'sponsor'
  | 'submit'

export function hostnameFromHost(host: string | null | undefined): string {
  if (!host) {
    return ''
  }

  return host.split(':')[0]?.toLowerCase() ?? ''
}

export function isHackathonHost(host: string | null | undefined): boolean {
  const hostname = hostnameFromHost(host)
  if (!hostname) {
    return false
  }

  if (hostname.startsWith('hackathon.')) {
    return true
  }

  const configured = process.env.NEXT_PUBLIC_HACKATHON_SITE_URL
  if (!configured) {
    return false
  }

  try {
    return new URL(configured).hostname.toLowerCase() === hostname
  } catch {
    return false
  }
}

export function getHackathonSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_HACKATHON_SITE_URL ?? '').replace(/\/$/, '')
}

export function getCommunitySiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cursorserbia.com').replace(/\/$/, '')
}

export function getHackathonBasePath(host: string | null | undefined): '' | '/hackathon' {
  return isHackathonHost(host) ? '' : '/hackathon'
}

export function hackathonTabPath(tab: HackathonTab): string {
  return tab === 'overview' ? '' : `/${tab}`
}

export function hackathonHref(basePath: '' | '/hackathon', tab: HackathonTab): string {
  const path = `${basePath}${hackathonTabPath(tab)}`
  return path || '/'
}

/** Public URL for community-site links (navbar, promo). Uses subdomain when configured. */
export function getPublicHackathonHref(tab: HackathonTab = 'overview'): string {
  const site = getHackathonSiteUrl()
  const suffix = hackathonTabPath(tab)
  if (site) {
    return `${site}${suffix || '/'}`
  }
  return hackathonHref('/hackathon', tab)
}

export function rewriteHackathonSubdomainPath(pathname: string): string | null {
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/hackathon') ||
    pathname.includes('.')
  ) {
    return null
  }

  if (pathname === '/' || pathname === '') {
    return '/hackathon'
  }

  return `/hackathon${pathname}`
}

export function subdomainPathFromHackathonPath(pathname: string): string {
  if (pathname === '/hackathon') {
    return '/'
  }

  return pathname.replace(/^\/hackathon/, '') || '/'
}

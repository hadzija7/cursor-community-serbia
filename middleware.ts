import { NextResponse, type NextRequest } from 'next/server'
import {
  getHackathonSiteUrl,
  isHackathonHost,
  rewriteHackathonSubdomainPath,
  subdomainPathFromHackathonPath,
} from '@/lib/hackathon-site'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (isHackathonHost(host)) {
    const rewritten = rewriteHackathonSubdomainPath(pathname)
    if (!rewritten) {
      return NextResponse.next()
    }

    const url = request.nextUrl.clone()
    url.pathname = rewritten
    return NextResponse.rewrite(url)
  }

  const siteUrl = getHackathonSiteUrl()
  if (siteUrl && pathname.startsWith('/hackathon')) {
    const destination = new URL(siteUrl)
    destination.pathname = subdomainPathFromHackathonPath(pathname)
    destination.search = request.nextUrl.search
    return NextResponse.redirect(destination)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

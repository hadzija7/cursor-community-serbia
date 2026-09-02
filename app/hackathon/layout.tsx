import type { Metadata } from 'next'
import HackathonSiteHeader from '@/components/HackathonSiteHeader'
import SessionProvider from '@/components/SessionProvider'
import { hackathonConfig } from '@/content/hackathon'
import { siteConfig } from '@/content/site.config'

const siteTitle = `${siteConfig.communityName} ${siteConfig.communityNameLocal}`
const hackathonUrl = (process.env.NEXT_PUBLIC_HACKATHON_SITE_URL ?? '').replace(/\/$/, '') || undefined

const ogImage = {
  url: hackathonConfig.ogImage,
  width: 1024,
  height: 1024,
  alt: hackathonConfig.title,
}

export const metadata: Metadata = {
  title: `${hackathonConfig.title} | ${siteTitle}`,
  description: hackathonConfig.tagline,
  openGraph: {
    title: hackathonConfig.title,
    description: hackathonConfig.tagline,
    type: 'website',
    siteName: hackathonConfig.title,
    ...(hackathonUrl ? { url: hackathonUrl } : {}),
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: hackathonConfig.title,
    description: hackathonConfig.tagline,
    images: [ogImage.url],
  },
}

export default function HackathonLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-cursor-bg text-cursor-text">
        <HackathonSiteHeader />
        <main>{children}</main>
      </div>
    </SessionProvider>
  )
}

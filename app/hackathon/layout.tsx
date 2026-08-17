import type { Metadata } from 'next'
import HackathonSiteHeader from '@/components/HackathonSiteHeader'
import { hackathonConfig } from '@/content/hackathon'
import { siteConfig } from '@/content/site.config'

const siteTitle = `${siteConfig.communityName} ${siteConfig.communityNameLocal}`

export const metadata: Metadata = {
  title: `${hackathonConfig.title} | ${siteTitle}`,
  description: hackathonConfig.tagline,
  openGraph: {
    title: hackathonConfig.title,
    description: hackathonConfig.tagline,
    type: 'website',
    images: [
      {
        url: '/images/og-cursor-serbia.jpg',
        width: 1024,
        height: 1024,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: hackathonConfig.title,
    description: hackathonConfig.tagline,
    images: ['/images/og-cursor-serbia.jpg'],
  },
}

export default function HackathonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cursor-bg text-cursor-text">
      <HackathonSiteHeader />
      <main>{children}</main>
    </div>
  )
}

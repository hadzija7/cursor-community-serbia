import type { Metadata } from 'next'
import { hackathonConfig } from '@/content/hackathon'
import { siteConfig } from '@/content/site.config'

export const metadata: Metadata = {
  title: `${hackathonConfig.title} | ${siteConfig.communityName} ${siteConfig.communityNameLocal}`,
  description: hackathonConfig.tagline,
  openGraph: {
    title: hackathonConfig.title,
    description: hackathonConfig.tagline,
    type: 'website',
  },
}

export default function HackathonLayout({ children }: { children: React.ReactNode }) {
  return children
}

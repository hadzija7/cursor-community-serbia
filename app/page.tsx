'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import HeroHeader from '@/components/HeroHeader'
import EventCountdown from '@/components/EventCountdown'
import AmbassadorSection from '@/components/AmbassadorSection'
import UpcomingEvents from '@/components/UpcomingEvents'
import PastEvents from '@/components/PastEvents'
import Partners from '@/components/Partners'
import JsonLd from '@/components/JsonLd'
import { siteConfig } from '@/content/site.config'
import { useI18n } from '@/lib/i18n'
import { useUpcomingEvents } from '@/lib/use-upcoming-events'
import type { CursorEvent } from '@/lib/types'

function buildHomeJsonLd(events: CursorEvent[]) {
  const organization = {
    '@type': 'Organization',
    name: siteConfig.communityName,
    url: siteConfig.cursorCommunityUrl,
  }

  const eventItems = events.map((event) => ({
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    location: {
      '@type': 'Place',
      name: event.location,
    },
    organizer: organization,
    ...(event.lumaUrl ? { url: event.lumaUrl } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, ...eventItems],
  }
}

export default function Home() {
  const { t } = useI18n()
  const upcomingEvents = useUpcomingEvents()

  return (
    <main className="min-h-screen bg-cursor-bg text-cursor-text scroll-smooth">
      <JsonLd data={buildHomeJsonLd(upcomingEvents)} />
      <HeroHeader />
      <EventCountdown events={upcomingEvents} />

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <AmbassadorSection />
        {/* <FeaturedSection /> */}
        <UpcomingEvents events={upcomingEvents} />
        <PastEvents />
        <Partners />

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mt-24 pt-8 border-t border-cursor-border text-center"
        >
          <p className="text-cursor-text-muted text-sm mb-3">{siteConfig.footerTagline || t('footer.madeWith')}</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href={siteConfig.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cursor-text hover:text-cursor-text-muted transition-colors text-sm"
            >
              {t('footer.allEvents')}
            </a>
            <span className="text-cursor-text-faint">·</span>
            <Link href="/subscribe" className="text-cursor-text hover:text-cursor-text-muted transition-colors text-sm">
              {t('subscribe.nav')}
            </Link>
            <span className="text-cursor-text-faint">·</span>
            <Link href="/education" className="text-cursor-text hover:text-cursor-text-muted transition-colors text-sm">
              {t('education.nav')}
            </Link>
            <span className="text-cursor-text-faint">·</span>
            <a
              href={siteConfig.cursorCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cursor-text hover:text-cursor-text-muted transition-colors text-sm"
            >
              {t('footer.community')}
            </a>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}

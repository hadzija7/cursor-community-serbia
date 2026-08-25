'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { isFutureEvent } from '@/lib/event-time'
import type { CursorEvent } from '@/lib/types'
import SectionEyebrow from '@/components/SectionEyebrow'

interface Props { events: CursorEvent[] }

export default function UpcomingEvents({ events }: Props) {
  const { t, locale } = useI18n()
  const liveEvents = events.filter(isFutureEvent)

  if (liveEvents.length === 0) return null

  return (
    <motion.section
      id="upcoming"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-16 scroll-mt-8 space-y-6"
    >
      <SectionEyebrow>{t('home.upcomingEvents')}</SectionEyebrow>

      <div className="space-y-4">
        {liveEvents.map((event, index) => {
          const shortDate = new Date(`${event.date}T00:00:00`).toLocaleDateString(
            locale === 'en' ? 'en-US' : locale,
            { year: 'numeric', month: 'short', day: 'numeric' },
          )
          const city = event.location.split(',')[0].trim()

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-2xl border border-cursor-accent-orange/25 bg-gradient-to-br from-cursor-surface via-cursor-bg-dark to-cursor-accent-orange-bg p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-cursor-text">{event.title}</h3>
                  <p className="text-sm text-cursor-text-muted mt-1">
                    {shortDate}
                    <span className="mx-1.5">&middot;</span>
                    {city}
                  </p>
                </div>
                {event.lumaUrl && (
                  <a
                    href={event.lumaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-cursor-text text-cursor-bg rounded-lg hover:bg-cursor-text-muted transition-colors text-sm font-medium"
                  >
                    {t('home.register')}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

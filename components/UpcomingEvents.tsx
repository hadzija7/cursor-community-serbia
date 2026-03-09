'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { upcomingEvents } from '@/content/events'
import { useI18n } from '@/lib/i18n'

export default function UpcomingEvents() {
  const { t, locale } = useI18n()

  if (upcomingEvents.length === 0) {
    return null
  }

  return (
    <motion.section
      id="upcoming"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-16 scroll-mt-8"
    >
      <h2 className="text-sm uppercase tracking-wider text-cursor-text-muted font-medium mb-6">
        {t('home.upcomingEvents')}
      </h2>

      <div className="space-y-4">
        {upcomingEvents.map((event, index) => {
          const shortDate = new Date(`${event.date}T00:00:00`).toLocaleDateString(locale === 'en' ? 'en-US' : locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          const city = event.location.split(',')[0].trim()

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-cursor-bg-dark border border-cursor-border rounded-lg p-5"
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

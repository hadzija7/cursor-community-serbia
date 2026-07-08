'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { hackathonConfig } from '@/content/hackathon'
import { useI18n } from '@/lib/i18n'

export default function HackathonHero() {
  const { t } = useI18n()

  const facts = [
    {
      icon: Calendar,
      label: t('hackathon.dateLabel'),
      value: hackathonConfig.displayDate,
    },
    {
      icon: MapPin,
      label: t('hackathon.locationLabel'),
      value: hackathonConfig.location,
    },
    {
      icon: Clock,
      label: t('hackathon.durationLabel'),
      value: hackathonConfig.duration,
    },
  ]

  return (
    <section className="relative overflow-hidden border-b border-cursor-border">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cursor-accent-orange-bg via-cursor-bg to-cursor-bg"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-cursor-accent-orange/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-cursor-accent-orange/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-8 md:pb-20 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <Link
            href="/"
            className="inline-flex text-sm text-cursor-text-muted transition-colors hover:text-cursor-text"
          >
            {t('hackathon.backToHome')}
          </Link>

          <div className="space-y-5 max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-cursor-accent-orange/50 bg-cursor-accent-orange-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
              {t('hackathon.upcoming')}
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">{hackathonConfig.title}</h1>
            <p className="text-lg text-cursor-text-secondary md:text-xl lg:text-2xl leading-relaxed">
              {hackathonConfig.tagline}
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                className="rounded-2xl border border-cursor-border-emphasis bg-cursor-surface/80 p-5 backdrop-blur-sm"
              >
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cursor-accent-orange">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </dt>
                <dd className="mt-2 text-base font-semibold leading-snug md:text-lg">{value}</dd>
              </motion.div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={hackathonConfig.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-cursor-text px-6 py-3 text-sm font-semibold text-cursor-bg transition-colors hover:bg-cursor-text-secondary md:text-base"
            >
              {t('hackathon.registerCta')}
            </a>
            <a
              href="#sponsors"
              className="inline-flex items-center justify-center rounded-lg border border-cursor-accent-orange/60 bg-cursor-accent-orange-bg px-6 py-3 text-sm font-semibold text-cursor-accent-orange transition-colors hover:border-cursor-accent-orange hover:bg-cursor-accent-orange/20 md:text-base"
            >
              {t('hackathon.viewSponsorsCta')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

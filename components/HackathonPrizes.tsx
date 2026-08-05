'use client'

import { motion } from 'framer-motion'
import { hackathonPrizes } from '@/content/hackathon'
import { useI18n } from '@/lib/i18n'

const accentStyles = {
  orange: {
    card: 'border-cursor-accent-orange/40 bg-cursor-accent-orange-bg',
    value: 'text-cursor-accent-orange',
  },
  green: {
    card: 'border-cursor-accent-green/40 bg-cursor-accent-green-bg',
    value: 'text-cursor-accent-green',
  },
  yellow: {
    card: 'border-cursor-accent-yellow/40 bg-cursor-accent-yellow-bg',
    value: 'text-cursor-accent-yellow',
  },
  purple: {
    card: 'border-cursor-accent-purple/40 bg-cursor-accent-purple-bg',
    value: 'text-cursor-accent-purple',
  },
} as const

export default function HackathonPrizes() {
  const { t } = useI18n()

  if (hackathonPrizes.length === 0) {
    return null
  }

  return (
    <motion.section
      id="prizes"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
      aria-labelledby="hackathon-prizes-heading"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
          {t('hackathon.prizesEyebrow')}
        </p>
        <h2 id="hackathon-prizes-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t('hackathon.prizesTitle')}
        </h2>
        <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.prizesDescription')}</p>
      </div>

      <div className="space-y-6">
        {hackathonPrizes.map((track) => (
          <div
            key={track.sponsor}
            className="space-y-5 rounded-2xl border border-cursor-border-emphasis bg-cursor-surface/60 p-6 md:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-cursor-text-muted">{t('hackathon.prizesSponsoredBy')}</p>
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{track.category}</h3>
              </div>
              <a
                href={track.sponsorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center rounded-md px-4 py-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: track.logoBg ?? '#14120b' }}
                aria-label={track.sponsor}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.sponsorLogo}
                  alt=""
                  className={`${track.logoHeight ?? 'h-7'} w-auto object-contain`}
                />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {track.places.map((prize, index) => {
                const styles = accentStyles[prize.accent]

                return (
                  <motion.div
                    key={`${track.sponsor}-${prize.place}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className={`rounded-2xl border p-6 ${styles.card}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-text-muted">
                      {prize.place}
                    </p>
                    <p className={`mt-3 text-3xl font-bold tracking-tight md:text-4xl ${styles.value}`}>
                      {prize.amount}
                    </p>
                    <p className="mt-2 text-sm text-cursor-text-secondary">{track.sponsor}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

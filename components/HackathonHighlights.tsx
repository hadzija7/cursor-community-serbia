'use client'

import { motion } from 'framer-motion'
import { hackathonStats } from '@/content/hackathon'
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

export default function HackathonHighlights() {
  const { t } = useI18n()

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      aria-labelledby="hackathon-highlights-heading"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
          {t('hackathon.highlightsEyebrow')}
        </p>
        <h2 id="hackathon-highlights-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t('hackathon.highlightsTitle')}
        </h2>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hackathonStats.map((stat, index) => {
          const styles = accentStyles[stat.accent]

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className={`rounded-2xl border p-6 ${styles.card}`}
            >
              <dt className={`text-3xl font-bold tracking-tight md:text-4xl ${styles.value}`}>{stat.value}</dt>
              <dd className="mt-2 text-sm text-cursor-text-secondary leading-relaxed">{stat.label}</dd>
            </motion.div>
          )
        })}
      </dl>
    </motion.section>
  )
}

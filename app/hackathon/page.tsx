'use client'

import { motion } from 'framer-motion'
import HackathonHero from '@/components/HackathonHero'
import HackathonHighlights from '@/components/HackathonHighlights'
import HackathonSponsorshipForm from '@/components/HackathonSponsorshipForm'
import Navbar from '@/components/Navbar'
import SponsorMarquee from '@/components/SponsorMarquee'
import { useI18n } from '@/lib/i18n'

export default function HackathonPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-cursor-bg text-cursor-text">
      <Navbar />

      <HackathonHero />

      <div className="mx-auto max-w-5xl space-y-20 px-6 py-16 md:py-20">
        <HackathonHighlights />

        <motion.section
          id="sponsors"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <SponsorMarquee />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="space-y-6 rounded-2xl border border-cursor-accent-orange/30 bg-gradient-to-br from-cursor-surface via-cursor-bg-dark to-cursor-accent-orange-bg p-8 md:p-10"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
              {t('hackathon.sponsorEyebrow')}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('hackathon.sponsorTitle')}</h2>
            <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.sponsorDescription')}</p>
          </div>
          <HackathonSponsorshipForm />
        </motion.section>
      </div>
    </main>
  )
}

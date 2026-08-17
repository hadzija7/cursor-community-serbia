'use client'

import HackathonSponsorshipForm from '@/components/HackathonSponsorshipForm'
import { useI18n } from '@/lib/i18n'

export default function HackathonSponsorPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <section className="space-y-6 rounded-2xl border border-cursor-accent-orange/30 bg-gradient-to-br from-cursor-surface via-cursor-bg-dark to-cursor-accent-orange-bg p-8 md:p-10">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
            {t('hackathon.sponsorEyebrow')}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t('hackathon.sponsorTitle')}</h1>
          <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.sponsorDescription')}</p>
        </div>
        <HackathonSponsorshipForm />
      </section>
    </div>
  )
}

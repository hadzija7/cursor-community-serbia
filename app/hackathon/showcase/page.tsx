'use client'

import HackathonShowcase from '@/components/HackathonShowcase'
import { useI18n } from '@/lib/i18n'

export default function HackathonShowcasePage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-12 md:py-16">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
          {t('hackathon.showcaseEyebrow')}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t('hackathon.showcasePageTitle')}
        </h1>
        <p className="max-w-2xl text-cursor-text-secondary md:text-lg">
          {t('hackathon.showcasePageDescription')}
        </p>
      </div>

      <HackathonShowcase />
    </div>
  )
}

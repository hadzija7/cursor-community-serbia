'use client'

import { Suspense } from 'react'
import HackathonProjectsGallery from '@/components/HackathonProjectsGallery'
import { useI18n } from '@/lib/i18n'

export default function HackathonProjectsPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-12 md:py-16">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
          {t('hackathon.projectsEyebrow')}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t('hackathon.projectsPageTitle')}
        </h1>
        <p className="max-w-2xl text-cursor-text-secondary md:text-lg">
          {t('hackathon.projectsPageDescription')}
        </p>
      </div>

      <Suspense
        fallback={
          <p className="text-sm text-cursor-text-muted" role="status">
            {t('hackathon.projectsLoading')}
          </p>
        }
      >
        <HackathonProjectsGallery />
      </Suspense>
    </div>
  )
}

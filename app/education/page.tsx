'use client'

import Link from 'next/link'
import { educationResources } from '@/content/education'
import { useI18n } from '@/lib/i18n'

export default function EducationPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-cursor-bg text-cursor-text px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-4">
          <Link href="/" className="text-sm text-cursor-text-muted transition-colors hover:text-cursor-text">
            {t('education.backToHome')}
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t('education.title')}</h1>
          <p className="text-cursor-text-muted">{t('education.description')}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-cursor-text-muted">{t('education.resources')}</h2>
          <ul className="space-y-4">
            {educationResources.map((resource) => (
              <li key={resource.id}>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-cursor-border bg-cursor-bg-dark p-6 transition-colors hover:border-cursor-text-muted hover:bg-cursor-bg-dark/80"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-cursor-text-muted">{resource.description}</p>
                      <span className="inline-block rounded-md bg-cursor-bg px-2 py-0.5 text-xs text-cursor-text-muted">
                        {resource.type}
                      </span>
                    </div>
                    <span className="text-cursor-text-muted" aria-hidden>
                      →
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

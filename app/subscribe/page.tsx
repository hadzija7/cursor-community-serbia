'use client'

import Link from 'next/link'
import SubscribeForm from '@/components/SubscribeForm'
import { useI18n } from '@/lib/i18n'

export default function SubscribePage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-cursor-bg text-cursor-text px-6 py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-xl border border-cursor-border bg-cursor-bg-dark p-8 md:p-10">
        <div className="space-y-4">
          <Link href="/" className="text-sm text-cursor-text-muted transition-colors hover:text-cursor-text">
            {t('subscribe.backToHome')}
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t('subscribe.title')}</h1>
          <p className="text-cursor-text-muted">{t('subscribe.description')}</p>
        </div>
        <SubscribeForm />
      </div>
    </main>
  )
}

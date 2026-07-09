'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { useHackathonDetails } from '@/lib/use-hackathon-details'

export default function HackathonPromoCard() {
  const { t } = useI18n()
  const hackathon = useHackathonDetails()

  return (
    <Link
      href="/hackathon"
      className="absolute left-4 top-4 z-20 w-[min(92vw,340px)] rounded-2xl border border-cursor-accent-orange/40 bg-cursor-bg/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-md transition-all hover:border-cursor-accent-orange/70 hover:bg-cursor-bg-dark sm:left-8 sm:top-8 sm:w-[min(88vw,380px)] sm:p-6 md:w-[400px]"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-cursor-accent-orange font-semibold sm:text-sm">
        {t('hackathon.upcoming')}
      </p>
      <p className="mt-3 text-xl font-semibold leading-tight tracking-tight sm:text-2xl md:text-3xl">
        {hackathon.title}
      </p>
      <p className="mt-2 text-sm text-cursor-text-secondary sm:text-base">{hackathon.displayDate}</p>
      <p className="mt-1 text-sm text-cursor-text-muted sm:text-base">{hackathon.location}</p>
      <p className="mt-4 inline-flex items-center rounded-md bg-cursor-text px-4 py-2 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted sm:text-base">
        {t('hackathon.promoCta')} →
      </p>
    </Link>
  )
}

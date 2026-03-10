'use client'

import Image from 'next/image'
import Link from 'next/link'
import LanguageToggle from '@/components/LanguageToggle'
import { siteConfig } from '@/content/site.config'
import { useI18n } from '@/lib/i18n'

export default function Navbar() {
  const { t } = useI18n()

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 md:py-5">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/cursor-logo.svg"
          alt="Cursor"
          width={120}
          height={32}
          priority
          className="h-6 md:h-8 w-auto"
        />
        <span className="font-cursor text-lg md:text-xl font-semibold tracking-tight text-cursor-text">
          {siteConfig.communityName}
          {siteConfig.communityNameLocal ? (
            <span className="font-thai font-bold tracking-wide text-xl md:text-2xl text-cursor-text-secondary ml-2">
              {siteConfig.communityNameLocal}
            </span>
          ) : null}
        </span>
      </Link>
      <div className="flex items-center gap-4 md:gap-6">
        <Link
          href="/#upcoming"
          className="hidden sm:block text-sm text-cursor-text-muted hover:text-cursor-text transition-colors"
        >
          {t('home.upcomingEvents')}
        </Link>
        <Link
          href="/#recaps"
          className="hidden sm:block text-sm text-cursor-text-muted hover:text-cursor-text transition-colors"
        >
          {t('home.pastEvents')}
        </Link>
        <Link
          href="/subscribe"
          className="text-sm text-cursor-text-muted hover:text-cursor-text transition-colors"
        >
          {t('subscribe.nav')}
        </Link>
        <LanguageToggle />
      </div>
    </nav>
  )
}

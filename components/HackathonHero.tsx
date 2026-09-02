'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, type MouseEvent } from 'react'
import HackerAuthButton from '@/components/HackerAuthButton'
import { hackathonConfig } from '@/content/hackathon'
import { useI18n } from '@/lib/i18n'
import { useHackerStatus } from '@/lib/use-hacker-status'
import { useHackathonHref } from '@/lib/use-hackathon-base-path'
import { useHackathonDetails } from '@/lib/use-hackathon-details'

const SPONSOR_SECTION_ID = 'become-a-sponsor'
const SPONSOR_SECTION_HASH = `#${SPONSOR_SECTION_ID}`

function isOverviewPath(pathname: string): boolean {
  return pathname === '/hackathon' || pathname === '/'
}

function scrollToSponsorSection(): boolean {
  const section = document.getElementById(SPONSOR_SECTION_ID)
  if (!section) {
    return false
  }

  section.scrollIntoView({ behavior: 'smooth' })
  return true
}

export default function HackathonHero() {
  const { t } = useI18n()
  const pathname = usePathname()
  const hackathon = useHackathonDetails()
  const { lumaStatus } = useHackerStatus()
  const overviewHref = useHackathonHref('overview')
  const sponsorHref = isOverviewPath(pathname)
    ? SPONSOR_SECTION_HASH
    : `${overviewHref}${SPONSOR_SECTION_HASH}`

  useEffect(() => {
    if (window.location.hash !== SPONSOR_SECTION_HASH) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToSponsorSection()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  function handleSponsorClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!scrollToSponsorSection()) {
      return
    }

    event.preventDefault()

    if (window.location.hash !== SPONSOR_SECTION_HASH) {
      window.history.pushState(
        null,
        '',
        `${window.location.pathname}${window.location.search}${SPONSOR_SECTION_HASH}`
      )
    }
  }

  const facts = [
    {
      icon: Calendar,
      label: t('hackathon.dateLabel'),
      value: hackathon.displayDate,
    },
    {
      icon: MapPin,
      label: t('hackathon.locationLabel'),
      value: hackathon.location,
    },
    {
      icon: Clock,
      label: t('hackathon.durationLabel'),
      value: hackathon.duration,
    },
  ]

  return (
    <section className="relative overflow-hidden border-b border-cursor-border">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cursor-accent-orange-bg via-cursor-bg to-cursor-bg"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-cursor-accent-orange/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-cursor-accent-orange/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-8 md:pb-20 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="relative">
            <div className="space-y-5 max-w-3xl sm:max-w-[calc((100%-2rem)*2/3)]">
              <p className="inline-flex items-center rounded-full border border-cursor-accent-orange/50 bg-cursor-accent-orange-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange">
                {t('hackathon.upcoming')}
              </p>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">{hackathon.title}</h1>
              <p className="text-lg text-cursor-text-secondary md:text-xl lg:text-2xl leading-relaxed">
                {hackathon.tagline}
              </p>
            </div>
            <div
              className="pointer-events-none absolute bottom-4 right-0 z-0 w-[15rem] sm:w-[16rem] md:w-[18rem] lg:w-[20rem]"
              aria-hidden
            >
              <Image
                src={hackathonConfig.mascotPeekImage}
                alt=""
                width={1024}
                height={1024}
                className="h-auto w-full mix-blend-lighten"
                priority
              />
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                className="rounded-2xl border border-cursor-border-emphasis bg-cursor-surface/80 p-5 backdrop-blur-sm"
              >
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cursor-accent-orange">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </dt>
                <dd className="mt-2 text-base font-semibold leading-snug md:text-lg">{value}</dd>
              </motion.div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <HackerAuthButton variant="hero" />
            {lumaStatus === 'registered' || lumaStatus === 'checked_in' ? (
              <a
                href={hackathon.lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-cursor-border-emphasis px-6 py-3 text-sm font-semibold text-cursor-text-secondary transition-colors hover:border-cursor-text-muted hover:text-cursor-text md:text-base"
              >
                {t('hackathon.viewOnLuma')}
              </a>
            ) : null}
            <a
              href={sponsorHref}
              onClick={handleSponsorClick}
              className="inline-flex items-center justify-center rounded-lg border border-cursor-border-emphasis px-6 py-3 text-sm font-semibold text-cursor-text-secondary transition-colors hover:border-cursor-text-muted hover:text-cursor-text md:text-base"
            >
              {t('hackathon.viewSponsorsCta')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

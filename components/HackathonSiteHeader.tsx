'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HackerAuthButton from '@/components/HackerAuthButton'
import { hackathonConfig } from '@/content/hackathon'
import { useI18n } from '@/lib/i18n'
import { getCommunitySiteUrl, type HackathonTab } from '@/lib/hackathon-site'
import { useHackathonHref, useIsHackathonHost } from '@/lib/use-hackathon-base-path'

type VisibleHackathonTab = Exclude<HackathonTab, 'sponsor'>

const tabs: { id: VisibleHackathonTab; labelKey: string }[] = [
  { id: 'overview', labelKey: 'hackathon.tabOverview' },
  { id: 'guide', labelKey: 'hackathon.tabGuide' },
  { id: 'mentors', labelKey: 'hackathon.tabMentors' },
  { id: 'prizes', labelKey: 'hackathon.tabPrizes' },
  { id: 'stack', labelKey: 'hackathon.tabStack' },
  { id: 'submit', labelKey: 'hackathon.tabSubmit' },
]

function isTabActive(pathname: string, tab: HackathonTab): boolean {
  if (tab === 'overview') {
    return pathname === '/hackathon' || pathname === '/'
  }

  return pathname === `/hackathon/${tab}` || pathname === `/${tab}`
}

export default function HackathonSiteHeader() {
  const { t } = useI18n()
  const pathname = usePathname()
  const onHackathonHost = useIsHackathonHost()
  const overviewHref = useHackathonHref('overview')
  const guideHref = useHackathonHref('guide')
  const mentorsHref = useHackathonHref('mentors')
  const prizesHref = useHackathonHref('prizes')
  const stackHref = useHackathonHref('stack')
  const submitHref = useHackathonHref('submit')
  const hrefs: Record<VisibleHackathonTab, string> = {
    overview: overviewHref,
    guide: guideHref,
    mentors: mentorsHref,
    prizes: prizesHref,
    stack: stackHref,
    submit: submitHref,
  }

  const communityHref = onHackathonHost ? getCommunitySiteUrl() : '/'

  return (
    <header className="border-b border-cursor-border bg-cursor-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <Link href={overviewHref} className="flex min-w-0 items-center gap-2.5">
            <Image
              src={hackathonConfig.headerMark}
              alt=""
              width={40}
              height={40}
              priority
              className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
            />
            <span className="min-w-0 text-sm font-semibold leading-snug tracking-tight sm:text-base md:text-lg">
              <span className="text-cursor-text">Grok Bot</span>{' '}
              <span className="font-medium text-cursor-text-secondary">Serbia</span>{' '}
              <span className="font-medium text-cursor-text-muted">Hackathon</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={communityHref}
              className="hidden text-sm text-cursor-text-muted transition-colors hover:text-cursor-text sm:inline"
            >
              {t('hackathon.communityLink')}
            </Link>
            <HackerAuthButton variant="header" />
          </div>
        </div>

        <nav aria-label={t('hackathon.tabsLabel')} className="-mb-px flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const active = isTabActive(pathname, tab.id)

            return (
              <Link
                key={tab.id}
                href={hrefs[tab.id]}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-cursor-surface text-cursor-text'
                    : 'text-cursor-text-muted hover:bg-cursor-overlay hover:text-cursor-text'
                }`}
              >
                {t(tab.labelKey)}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

'use client'

import { LogOut } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useHackerStatus } from '@/lib/use-hacker-status'
import { useHackathonDetails } from '@/lib/use-hackathon-details'

type Variant = 'header' | 'hero'

const statusBadgeStyles: Record<string, string> = {
  checked_in:
    'rounded-full border border-cursor-accent-green/40 bg-cursor-accent-green-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cursor-accent-green',
  registered:
    'rounded-full border border-cursor-accent-yellow/40 bg-cursor-accent-yellow/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cursor-accent-yellow',
  not_found:
    'rounded-full border border-cursor-border-emphasis bg-cursor-overlay px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cursor-text-muted',
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n()

  const labelKey: Record<string, string> = {
    checked_in: 'hackathon.lumaStatusCheckedIn',
    registered: 'hackathon.lumaStatusRegistered',
    not_found: 'hackathon.lumaStatusNotFound',
  }

  return (
    <span className={statusBadgeStyles[status] ?? statusBadgeStyles.not_found}>
      {t(labelKey[status] ?? labelKey.not_found)}
    </span>
  )
}

export default function HackerAuthButton({ variant = 'header' }: { variant?: Variant }) {
  const { t } = useI18n()
  const { data: session, status: sessionStatus } = useSession()
  const hackerStatus = useHackerStatus()
  const hackathon = useHackathonDetails()
  const [menuOpen, setMenuOpen] = useState(false)

  const isHero = variant === 'hero'
  const buttonClass = isHero
    ? 'inline-flex items-center justify-center rounded-lg bg-cursor-text px-6 py-3 text-sm font-semibold text-cursor-bg transition-colors hover:bg-cursor-text-secondary md:text-base'
    : 'inline-flex items-center justify-center rounded-lg bg-cursor-text px-4 py-2 text-sm font-semibold text-cursor-bg transition-colors hover:bg-cursor-text-secondary'

  // Hero CTA is always Luma registration; Google login lives in the navbar only
  if (isHero) {
    if (session?.user) {
      if (hackerStatus.status === 'loading') {
        return (
          <span className={`${buttonClass} pointer-events-none opacity-50`}>
            {t('hackathon.registerCta')}
          </span>
        )
      }

      // not_found, or unknown after fetch error — keep Register CTA available
      const lumaStatus = hackerStatus.lumaStatus
      if (lumaStatus === 'not_found' || lumaStatus === null) {
        return (
          <a
            href={hackathon.lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            {t('hackathon.registerCta')}
          </a>
        )
      }
      return null
    }

    return (
      <a
        href={hackathon.lumaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={
          sessionStatus === 'loading'
            ? `${buttonClass} pointer-events-none opacity-50`
            : buttonClass
        }
      >
        {t('hackathon.registerCta')}
      </a>
    )
  }

  if (sessionStatus === 'loading') {
    return (
      <span className={`${buttonClass} pointer-events-none opacity-50`}>
        {t('hackathon.loginCta')}
      </span>
    )
  }

  if (!session?.user) {
    return (
      <button type="button" onClick={() => signIn('google')} className={buttonClass}>
        {t('hackathon.loginCta')}
      </button>
    )
  }

  // Header variant: show email, status badge, and sign-out menu
  const email = session.user.email ?? ''
  const truncated = email.length > 22 ? `${email.slice(0, 19)}…` : email

  return (
    <div className="flex items-center gap-2 relative">
      {hackerStatus.status !== 'loading' && hackerStatus.lumaStatus ? (
        <StatusBadge status={hackerStatus.lumaStatus} />
      ) : null}

      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-cursor-border-emphasis bg-cursor-surface px-3 py-1.5 text-xs font-medium text-cursor-text transition-colors hover:border-cursor-text-muted"
        title={email}
      >
        <span className="max-w-[140px] truncate">{truncated}</span>
        <span className="text-cursor-text-muted" aria-hidden>▾</span>
      </button>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-cursor-border-emphasis bg-cursor-surface p-1 shadow-lg">
            <p className="px-3 py-2 text-xs text-cursor-text-muted">{email}</p>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                signOut()
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-cursor-text-secondary transition-colors hover:bg-cursor-overlay hover:text-cursor-text"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t('hackathon.logoutCta')}
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

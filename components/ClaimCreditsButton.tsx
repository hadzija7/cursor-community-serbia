'use client'

import { Gift, Check, Copy, Loader2, Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useRef, useState } from 'react'
import { CURSOR_POOL_ID, CURSOR_50_POOL_ID } from '@/lib/credit-codes'
import { useI18n } from '@/lib/i18n'
import { useHackerStatus } from '@/lib/use-hacker-status'

type ClaimState = 'idle' | 'loading' | 'claimed' | 'error'

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

type ClaimCreditsButtonProps = {
  sponsorId: string
  /** Short label shown above the claim control (e.g. "Cursor Pro"). */
  title?: string
  /** Optional button / lock label override. */
  claimLabel?: string
  className?: string
}

export default function ClaimCreditsButton({
  sponsorId,
  title,
  claimLabel,
  className = '',
}: ClaimCreditsButtonProps) {
  const { t } = useI18n()
  const { data: session } = useSession()
  const { lumaStatus } = useHackerStatus()
  const [state, setState] = useState<ClaimState>('idle')
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const inFlightRef = useRef(false)

  const isCheckedIn = lumaStatus === 'checked_in'
  const isLoggedIn = !!session?.user
  const buttonLabel = claimLabel ?? t('hackathon.claimCredits')

  const handleClaim = useCallback(async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    setState('loading')

    try {
      const res = await fetch('/api/hackathon/claim-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsorId }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('Claim failed:', data)
        inFlightRef.current = false
        setState('error')
        return
      }

      const data = (await res.json()) as { code: string }
      setCode(data.code)
      setState('claimed')
    } catch {
      inFlightRef.current = false
      setState('error')
    }
  }, [sponsorId])

  const handleCopy = useCallback(() => {
    if (!code) return
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [code])

  if (!isLoggedIn) return null

  const shellClass = `min-w-0 ${className}`.trim()

  if (!isCheckedIn) {
    return (
      <div className={shellClass}>
        {title ? (
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cursor-text-muted">
            {title}
          </p>
        ) : null}
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-cursor-border-emphasis bg-cursor-overlay px-2.5 py-1 text-xs font-medium text-cursor-text-muted"
          title={t('hackathon.creditsNotCheckedIn')}
        >
          <Lock className="h-3 w-3" />
          {buttonLabel}
        </span>
      </div>
    )
  }

  if (state === 'claimed' && code) {
    const link = isHttpUrl(code)
    const showCursor20Tip = sponsorId === CURSOR_POOL_ID && link
    const showCursor50Tip = sponsorId === CURSOR_50_POOL_ID && link
    const showDaytonaTip = sponsorId === 'daytona' && !link
    return (
      <div
        className={`w-full rounded-lg border border-cursor-accent-green/40 bg-cursor-accent-green-bg p-3 ${shellClass}`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cursor-accent-green">
          {title ?? (link ? t('hackathon.creditsReferralReady') : t('hackathon.creditsClaimed'))}
        </p>
        <p className="mt-2 break-all font-mono text-sm leading-relaxed text-cursor-text">{code}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md bg-cursor-accent-green px-2.5 py-1 text-xs font-semibold text-black transition-colors hover:bg-cursor-accent-green/80"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied
              ? t('hackathon.creditsCopied')
              : link
                ? t('hackathon.creditsCopyLink')
                : t('hackathon.creditsCopyCode')}
          </button>
          {link ? (
            <a
              href={code}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-cursor-accent-green hover:underline"
            >
              {t('hackathon.creditsOpenLink')} →
            </a>
          ) : null}
          {showDaytonaTip ? (
            <a
              href="https://app.daytona.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-cursor-accent-green hover:underline"
            >
              {t('hackathon.creditsDaytonaOpenApp')} →
            </a>
          ) : null}
        </div>
        {showCursor20Tip ? (
          <p className="mt-3 text-xs leading-relaxed text-cursor-text-secondary">
            <span className="font-semibold text-cursor-text">{t('hackathon.creditsCursorSetupTipLabel')}: </span>
            {t('hackathon.creditsCursor20SetupTip')}
          </p>
        ) : null}
        {showCursor50Tip ? (
          <p className="mt-3 text-xs leading-relaxed text-cursor-text-secondary">
            <span className="font-semibold text-cursor-text">{t('hackathon.creditsCursorSetupTipLabel')}: </span>
            {t('hackathon.creditsCursor50SetupTip')}
          </p>
        ) : null}
        {showDaytonaTip ? (
          <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-cursor-text-secondary">
            <p>
              <span className="font-semibold text-cursor-text">{t('hackathon.creditsDaytonaRedeemTipLabel')}: </span>
              {t('hackathon.creditsDaytonaRedeemTip')}
            </p>
            <p>{t('hackathon.creditsDaytonaRedeemProTip')}</p>
          </div>
        ) : null}
      </div>
    )
  }

  if (state === 'loading') {
    return (
      <div className={shellClass}>
        {title ? (
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cursor-text-muted">
            {title}
          </p>
        ) : null}
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cursor-accent-orange px-2.5 py-1 text-xs font-semibold text-black">
          <Loader2 className="h-3 w-3 animate-spin" />
          {buttonLabel}
        </span>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className={shellClass}>
        {title ? (
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cursor-text-muted">
            {title}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleClaim}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
        >
          {t('hackathon.creditsClaimError')}
        </button>
      </div>
    )
  }

  return (
    <div className={shellClass}>
      {title ? (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cursor-text-muted">
          {title}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleClaim}
        className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cursor-accent-orange px-2.5 py-1 text-xs font-semibold text-black transition-colors hover:bg-cursor-accent-orange/80"
      >
        <Gift className="h-3 w-3" />
        {buttonLabel}
      </button>
    </div>
  )
}

/** Dual claim panel for the host editor modal ($20 + $50 Cursor credit pools). */
export function HostEditorCreditsClaim() {
  const { t } = useI18n()
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <div className="mt-4 space-y-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cursor-accent-orange">
          {t('hackathon.creditsHostClaimEyebrow')}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-cursor-text-secondary">
          {t('hackathon.creditsHostClaimHint')}
        </p>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border border-cursor-border-emphasis bg-cursor-overlay/60 p-3">
          <ClaimCreditsButton
            sponsorId={CURSOR_POOL_ID}
            title={t('hackathon.creditsCursor20PoolTitle')}
            claimLabel={t('hackathon.creditsClaimCursor20')}
            className="w-full"
          />
        </div>
        <div className="rounded-xl border border-cursor-border-emphasis bg-cursor-overlay/60 p-3">
          <ClaimCreditsButton
            sponsorId={CURSOR_50_POOL_ID}
            title={t('hackathon.creditsCursor50PoolTitle')}
            claimLabel={t('hackathon.creditsClaimCursor50')}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

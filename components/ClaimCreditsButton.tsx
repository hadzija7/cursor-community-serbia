'use client'

import { Gift, Check, Copy, Loader2, Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useHackerStatus } from '@/lib/use-hacker-status'

type ClaimState = 'idle' | 'loading' | 'claimed' | 'error'

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

export default function ClaimCreditsButton({ sponsorId }: { sponsorId: string }) {
  const { t } = useI18n()
  const { data: session } = useSession()
  const { lumaStatus } = useHackerStatus()
  const [state, setState] = useState<ClaimState>('idle')
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const inFlightRef = useRef(false)

  const isCheckedIn = lumaStatus === 'checked_in'
  const isLoggedIn = !!session?.user

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

  if (!isCheckedIn) {
    return (
      <span
        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-cursor-border-emphasis bg-cursor-overlay px-2.5 py-1 text-xs font-medium text-cursor-text-muted"
        title={t('hackathon.creditsNotCheckedIn')}
      >
        <Lock className="h-3 w-3" />
        {t('hackathon.claimCredits')}
      </span>
    )
  }

  if (state === 'claimed' && code) {
    const link = isHttpUrl(code)
    return (
      <div className="w-full min-w-0 rounded-lg border border-cursor-accent-green/40 bg-cursor-accent-green-bg p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cursor-accent-green">
          {link ? t('hackathon.creditsReferralReady') : t('hackathon.creditsClaimed')}
        </p>
        <p className="mt-2 break-all font-mono text-sm leading-relaxed text-cursor-text">{code}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md bg-cursor-accent-green px-2.5 py-1 text-xs font-semibold text-black transition-colors hover:bg-cursor-accent-green/80"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? t('hackathon.creditsCopied') : link ? t('hackathon.creditsCopyLink') : t('hackathon.creditsCopyCode')}
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
        </div>
      </div>
    )
  }

  if (state === 'loading') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cursor-accent-orange px-2.5 py-1 text-xs font-semibold text-black">
        <Loader2 className="h-3 w-3 animate-spin" />
        {t('hackathon.claimCredits')}
      </span>
    )
  }

  if (state === 'error') {
    return (
      <button
        type="button"
        onClick={handleClaim}
        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
      >
        {t('hackathon.creditsClaimError')}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClaim}
      className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cursor-accent-orange px-2.5 py-1 text-xs font-semibold text-black transition-colors hover:bg-cursor-accent-orange/80"
    >
      <Gift className="h-3 w-3" />
      {t('hackathon.claimCredits')}
    </button>
  )
}

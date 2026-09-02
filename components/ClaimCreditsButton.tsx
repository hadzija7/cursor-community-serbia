'use client'

import { Gift, Check, Loader2, Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useHackerStatus } from '@/lib/use-hacker-status'

type ClaimState = 'idle' | 'loading' | 'claimed' | 'error'

export default function ClaimCreditsButton({ sponsorId }: { sponsorId: string }) {
  const { t } = useI18n()
  const { data: session } = useSession()
  const { lumaStatus } = useHackerStatus()
  const [state, setState] = useState<ClaimState>('idle')
  const [code, setCode] = useState<string | null>(null)

  const isCheckedIn = lumaStatus === 'checked_in'
  const isLoggedIn = !!session?.user

  const handleClaim = useCallback(async () => {
    if (state === 'loading' || state === 'claimed') return
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
        setState('error')
        return
      }

      const data = (await res.json()) as { code: string }
      setCode(data.code)
      setState('claimed')
    } catch {
      setState('error')
    }
  }, [sponsorId, state])

  const handleCopy = useCallback(() => {
    if (!code) return
    navigator.clipboard.writeText(code).catch(() => {})
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
    return (
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-cursor-accent-green/40 bg-cursor-accent-green-bg px-2.5 py-1 text-xs font-semibold text-cursor-accent-green transition-colors hover:bg-cursor-accent-green/20"
        title={t('hackathon.creditsClaimed')}
      >
        <Check className="h-3 w-3" />
        <code className="font-mono">{code}</code>
      </button>
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

'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import RenderLogoMark from '@/components/RenderLogoMark'
import { getSponsorProfile, hackathonSdlcStages } from '@/content/hackathon'
import { cursorMcpInstallHref } from '@/lib/cursor-mcp-install'
import { useI18n } from '@/lib/i18n'
import type { HackathonSdlcStage, HackathonSponsorPerkKind, HackathonSponsorProfile } from '@/lib/types'

const accentStyles = {
  orange: { text: 'text-cursor-accent-orange' },
  green: { text: 'text-cursor-accent-green' },
  yellow: { text: 'text-cursor-accent-yellow' },
  purple: { text: 'text-cursor-accent-purple' },
  blue: { text: 'text-cursor-accent-blue' },
} as const

const perkStyles: Record<HackathonSponsorPerkKind, string> = {
  confirmed: 'border-cursor-accent-green/40 bg-cursor-accent-green-bg text-cursor-accent-green',
  public: 'border-cursor-border-emphasis bg-cursor-overlay text-cursor-text-secondary',
  tbd: 'border-dashed border-cursor-border-emphasis bg-transparent text-cursor-text-muted',
}

function SponsorLogo({ profile, className }: { profile: HackathonSponsorProfile; className: string }) {
  if (profile.name === 'Render') {
    return <RenderLogoMark className={`${className} text-[#141414]`} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={profile.logo} alt="" className={className} />
  )
}

function SponsorCard({
  profile,
  stage,
  onOpen,
}: {
  profile: HackathonSponsorProfile
  stage: HackathonSdlcStage
  onOpen: () => void
}) {
  const styles = accentStyles[stage.accent]
  const needsLogoPad = Boolean(profile.logoBg && profile.logoBg !== '#14120b')

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-full w-full flex-col rounded-2xl border border-cursor-border-emphasis bg-cursor-surface/60 p-6 text-left transition-colors hover:border-cursor-accent-orange/40"
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`min-w-0 text-xs font-semibold uppercase tracking-[0.18em] ${styles.text}`}>
          {stage.label}
        </p>
        <div
          className={`shrink-0 ${needsLogoPad ? 'rounded px-1.5 py-1' : ''}`}
          style={needsLogoPad ? { backgroundColor: profile.logoBg } : undefined}
        >
          <SponsorLogo profile={profile} className="h-5 w-auto max-w-[5.5rem] object-contain" />
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold tracking-tight">{profile.name}</p>
      <p className="mt-1 text-sm leading-relaxed text-cursor-text-secondary">{profile.oneLiner}</p>
    </button>
  )
}

function SponsorModal({
  profile,
  stage,
  onClose,
}: {
  profile: HackathonSponsorProfile
  stage: HackathonSdlcStage
  onClose: () => void
}) {
  const { t } = useI18n()
  const styles = accentStyles[stage.accent]

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label={t('hackathon.stackClose')}
        className="absolute inset-0 bg-cursor-bg-dark/70"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sponsor-modal-title"
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-cursor-border-emphasis bg-cursor-surface p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${styles.text}`}>{stage.label}</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <h2 id="sponsor-modal-title" className="min-w-0 text-2xl font-semibold tracking-tight">
                {profile.name}
              </h2>
              {profile.mcp ? (
                <a
                  href={cursorMcpInstallHref(profile.mcp)}
                  className="inline-flex shrink-0 items-center rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-black transition-colors hover:bg-white/90"
                  aria-label={t('hackathon.stackAddMcpAria', { name: profile.name })}
                >
                  {t('hackathon.stackAddMcp')}
                </a>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-cursor-text-muted hover:text-cursor-text"
            aria-label={t('hackathon.stackClose')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-cursor-text-secondary">{profile.oneLiner}</p>
        {profile.mcp?.note ? (
          <p className="mt-2 text-xs leading-relaxed text-cursor-text-muted">{profile.mcp.note}</p>
        ) : null}

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-text-muted">
              {t('hackathon.stackTechnologies')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-cursor-text-secondary">
              {profile.technologies.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-text-muted">
              {t('hackathon.stackUseCases')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-cursor-text-secondary">
              {profile.useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cursor-text-muted">
              {t('hackathon.stackWhatYouGet')}
            </p>
            <ul className="mt-2 space-y-2">
              {profile.perks.map((perk) => (
                <li key={perk.label} className={`rounded-lg border px-3 py-2 text-sm ${perkStyles[perk.kind]}`}>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                    {t(`hackathon.stackPerk${perk.kind.charAt(0).toUpperCase()}${perk.kind.slice(1)}`)}
                  </span>
                  <p className="mt-1 font-medium text-cursor-text">{perk.label}</p>
                  {perk.detail ? <p className="mt-1 text-xs text-cursor-text-secondary">{perk.detail}</p> : null}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={profile.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-medium text-cursor-accent-orange hover:underline"
          >
            {t('hackathon.stackStartHere')} →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function HackathonSponsorStack() {
  const { t } = useI18n()
  const [openId, setOpenId] = useState<string | null>(null)

  const groups = useMemo(
    () =>
      hackathonSdlcStages
        .map((stage) => {
          const profile = getSponsorProfile(stage.sponsorId)
          return profile ? { stage, profile } : null
        })
        .filter((row): row is { stage: HackathonSdlcStage; profile: HackathonSponsorProfile } => row !== null),
    []
  )

  const openGroup = groups.find(({ profile }) => profile.id === openId)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {groups.map(({ stage, profile }) => (
          <SponsorCard
            key={stage.id}
            profile={profile}
            stage={stage}
            onOpen={() => setOpenId(profile.id)}
          />
        ))}
      </div>
      <p className="mt-4 max-w-xl text-xs leading-relaxed text-cursor-text-muted">
        {t('hackathon.stackVoiceLaneNote')}
      </p>

      {openGroup ? (
        <SponsorModal
          profile={openGroup.profile}
          stage={openGroup.stage}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </>
  )
}

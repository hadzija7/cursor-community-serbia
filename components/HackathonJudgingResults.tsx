'use client'

import type { ResolvedOfficialTrack } from '@/lib/hackathon-results'
import { useI18n } from '@/lib/i18n'

type Props = {
  tracks: ResolvedOfficialTrack[]
}

const RANK_STYLES: Record<number, string> = {
  1: 'border-cursor-accent-orange/50 bg-cursor-accent-orange/10 text-cursor-accent-orange',
  2: 'border-cursor-border bg-cursor-overlay text-cursor-text-secondary',
  3: 'border-cursor-border bg-cursor-surface/80 text-cursor-text-muted',
}

function placeLabel(place: 1 | 2 | 3, t: (key: string) => string): string {
  switch (place) {
    case 1:
      return t('hackathon.projectsJudgePick1st')
    case 2:
      return t('hackathon.projectsJudgePick2nd')
    case 3:
      return t('hackathon.projectsJudgePick3rd')
    default: {
      const _exhaustive: never = place
      return _exhaustive
    }
  }
}

export default function HackathonJudgingResults({ tracks }: Props) {
  const { t } = useI18n()

  if (tracks.length === 0) return null

  return (
    <section
      className="space-y-6 rounded-2xl border border-cursor-accent-orange/30 bg-cursor-surface/40 p-5 md:p-6"
      aria-labelledby="official-results-heading"
    >
      <div className="space-y-1">
        <h2
          id="official-results-heading"
          className="text-lg font-semibold tracking-tight text-cursor-text md:text-xl"
        >
          {t('hackathon.projectsResultsTitle')}
        </h2>
        <p className="text-sm text-cursor-text-muted">{t('hackathon.projectsResultsDescription')}</p>
      </div>

      <div className="space-y-6">
        {tracks.map((track) => (
          <div key={track.id} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-cursor-text-secondary">
              {t(track.labelKey)}
            </h3>
            <ol className="grid gap-3 sm:grid-cols-3">
              {track.winners.map((winner) => {
                const body = (
                  <>
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cursor-bg/60 text-sm font-semibold tabular-nums"
                      aria-label={t('hackathon.projectsLeaderboardRank', {
                        rank: String(winner.place),
                      })}
                    >
                      {winner.place}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate font-medium text-cursor-text" title={winner.displayTitle}>
                        {winner.displayTitle}
                      </p>
                      <p className="text-sm text-cursor-text-secondary">
                        {placeLabel(winner.place, t)}
                        {winner.amount ? ` · ${winner.amount}` : null}
                      </p>
                    </div>
                  </>
                )

                const className = `flex items-start gap-3 rounded-xl border px-4 py-3 ${
                  RANK_STYLES[winner.place] ?? RANK_STYLES[3]
                }`

                return (
                  <li key={`${track.id}-${winner.place}`}>
                    {winner.projectId ? (
                      <a href={`#project-${winner.projectId}`} className={`${className} transition-opacity hover:opacity-90`}>
                        {body}
                      </a>
                    ) : (
                      <div className={className}>{body}</div>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}

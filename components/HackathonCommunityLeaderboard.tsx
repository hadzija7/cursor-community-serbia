'use client'

import { Heart } from 'lucide-react'
import type { CommunityLeaderboardEntry } from '@/lib/project-gallery'
import { useI18n } from '@/lib/i18n'

type Props = {
  entries: CommunityLeaderboardEntry[]
}

const RANK_STYLES: Record<number, string> = {
  1: 'border-cursor-accent-orange/50 bg-cursor-accent-orange/10 text-cursor-accent-orange',
  2: 'border-cursor-border bg-cursor-overlay text-cursor-text-secondary',
  3: 'border-cursor-border bg-cursor-surface/80 text-cursor-text-muted',
}

export default function HackathonCommunityLeaderboard({ entries }: Props) {
  const { t } = useI18n()

  if (entries.length === 0) return null

  return (
    <section
      className="space-y-4 rounded-2xl border border-cursor-border bg-cursor-surface/40 p-5 md:p-6"
      aria-labelledby="community-leaderboard-heading"
    >
      <div className="space-y-1">
        <h2
          id="community-leaderboard-heading"
          className="text-lg font-semibold tracking-tight text-cursor-text md:text-xl"
        >
          {t('hackathon.projectsLeaderboardTitle')}
        </h2>
        <p className="text-sm text-cursor-text-muted">
          {t('hackathon.projectsLeaderboardDescription')}
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
              RANK_STYLES[entry.rank] ?? RANK_STYLES[3]
            }`}
          >
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cursor-bg/60 text-sm font-semibold tabular-nums"
              aria-label={t('hackathon.projectsLeaderboardRank').replace(
                '{rank}',
                String(entry.rank),
              )}
            >
              {entry.rank}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate font-medium text-cursor-text" title={entry.title}>
                {entry.title}
              </p>
              <p className="inline-flex items-center gap-1.5 text-sm tabular-nums text-cursor-text-secondary">
                <Heart className="h-3.5 w-3.5 fill-current text-cursor-accent-orange" aria-hidden />
                <span>
                  {t('hackathon.projectsLeaderboardVotes').replace(
                    '{count}',
                    String(entry.favoriteCount),
                  )}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

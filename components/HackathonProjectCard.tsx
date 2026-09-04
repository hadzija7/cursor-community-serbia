'use client'

import { useState } from 'react'
import { ExternalLink, Github, Heart, Star } from 'lucide-react'
import { resolveDemoEmbed } from '@/lib/demo-embed'
import type { ProjectGalleryItem } from '@/app/api/hackathon/projects/route'
import { useI18n } from '@/lib/i18n'

type Props = {
  project: ProjectGalleryItem
  isJudge: boolean
  isSignedIn: boolean
  busy?: boolean
  onFavorite: (projectId: string, favorited: boolean) => Promise<void>
  onScore: (projectId: string, score: number) => Promise<void>
  onLogin: () => void
}

function shortDescription(text: string, max = 180): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max).trimEnd()}…`
}

export default function HackathonProjectCard({
  project,
  isJudge,
  isSignedIn,
  busy = false,
  onFavorite,
  onScore,
  onLogin,
}: Props) {
  const { t } = useI18n()
  const embed = resolveDemoEmbed(project.demoRecordingUrl)
  const [draftScore, setDraftScore] = useState<number>(project.myScore ?? 8)
  const [localError, setLocalError] = useState('')

  const handleFavorite = async () => {
    if (!isSignedIn) {
      onLogin()
      return
    }
    setLocalError('')
    try {
      await onFavorite(project.id, !project.favoritedByMe)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t('hackathon.projectsGenericError'))
    }
  }

  const handleScore = async () => {
    setLocalError('')
    try {
      await onScore(project.id, draftScore)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t('hackathon.projectsGenericError'))
    }
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-cursor-border bg-cursor-surface/50">
      <div className="relative aspect-video w-full bg-cursor-overlay">
        {embed.kind === 'external' ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm text-cursor-text-muted">{t('hackathon.projectsDemoExternal')}</p>
            <a
              href={embed.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-cursor-accent-orange hover:underline"
            >
              {t('hackathon.projectsWatchDemo')}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        ) : (
          <iframe
            src={embed.embedUrl}
            title={`${project.title} demo`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-cursor-text">{project.title}</h2>
          {project.submitterName ? (
            <p className="text-sm text-cursor-text-muted">
              {t('hackathon.projectsBy')} {project.submitterName}
            </p>
          ) : null}
          <p className="text-sm leading-relaxed text-cursor-text-secondary">
            {shortDescription(project.description)}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <a
            href={project.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-cursor-accent-orange hover:underline"
          >
            {t('hackathon.projectsLiveDemo')}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-cursor-text-muted hover:text-cursor-text"
          >
            <Github className="h-3.5 w-3.5" aria-hidden />
            {t('hackathon.projectsGithub')}
          </a>
          {embed.kind !== 'external' ? (
            <a
              href={project.demoRecordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cursor-text-muted hover:text-cursor-text"
            >
              {t('hackathon.projectsOpenRecording')}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-cursor-border pt-4">
          <div className="flex items-center gap-1.5 text-sm text-cursor-text-secondary">
            <Star className="h-4 w-4 text-cursor-accent-orange" aria-hidden />
            <span>
              {project.averageScore == null
                ? t('hackathon.projectsNoScore')
                : t('hackathon.projectsAvgScore').replace(
                    '{score}',
                    String(project.averageScore),
                  )}
            </span>
            {project.reviewCount > 0 ? (
              <span className="text-cursor-text-faint">
                ({project.reviewCount})
              </span>
            ) : null}
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => void handleFavorite()}
            aria-pressed={project.favoritedByMe}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              project.favoritedByMe
                ? 'bg-cursor-accent-orange/15 text-cursor-accent-orange'
                : 'bg-cursor-overlay text-cursor-text-muted hover:text-cursor-text'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${project.favoritedByMe ? 'fill-current' : ''}`}
              aria-hidden
            />
            {project.favoritedByMe
              ? t('hackathon.projectsUnfavorite')
              : t('hackathon.projectsFavorite')}
            <span className="tabular-nums text-cursor-text-faint">{project.favoriteCount}</span>
          </button>

          {!isSignedIn ? (
            <button
              type="button"
              onClick={onLogin}
              className="text-sm text-cursor-text-muted underline hover:text-cursor-text"
            >
              {t('hackathon.projectsLoginToVote')}
            </button>
          ) : null}
        </div>

        {isJudge ? (
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-cursor-border bg-cursor-bg/40 p-3">
            <label className="flex flex-col gap-1 text-xs text-cursor-text-muted">
              {t('hackathon.projectsJudgeScore')}
              <select
                value={draftScore}
                onChange={(e) => setDraftScore(Number(e.target.value))}
                disabled={busy}
                className="rounded-md border border-cursor-border bg-cursor-surface px-3 py-2 text-sm text-cursor-text"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleScore()}
              className="rounded-md bg-cursor-text px-4 py-2 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted disabled:opacity-60"
            >
              {project.myScore != null
                ? t('hackathon.projectsUpdateScore')
                : t('hackathon.projectsSaveScore')}
            </button>
            {project.myScore != null ? (
              <span className="pb-2 text-xs text-cursor-text-muted">
                {t('hackathon.projectsYourScore').replace('{score}', String(project.myScore))}
              </span>
            ) : null}
          </div>
        ) : null}

        {localError ? (
          <p className="text-sm text-cursor-accent-red" role="alert">
            {localError}
          </p>
        ) : null}
      </div>
    </article>
  )
}

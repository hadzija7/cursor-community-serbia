'use client'

import { useCallback, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import HackathonProjectCard from '@/components/HackathonProjectCard'
import type { ProjectGalleryItem } from '@/app/api/hackathon/projects/route'
import {
  MAX_FAVORITES_PER_USER,
  averageJudgeScore,
  favoriteCapMessage,
} from '@/lib/project-gallery'
import { useI18n } from '@/lib/i18n'

type ViewerState = {
  email: string | null
  isJudge: boolean
  favoriteCount: number
  maxFavorites: number
}

type ApiResponse = {
  ok: boolean
  message?: string
  projects: ProjectGalleryItem[]
  viewer?: ViewerState
}

/** Dev-only preview fixture — official submission only (no mock projects). */
const PREVIEW_PROJECTS: ProjectGalleryItem[] = [
  {
    id: '2939d78c-09ac-49b6-b2fc-abe951c94667',
    title: 'Cursor Serbia Community',
    description: 'Serbian Cursor AI community (Now SpaceXAI)',
    githubUrl: 'https://github.com/hadzija7/cursor-community-serbia',
    demoRecordingUrl: 'https://www.youtube.com/watch?v=ApGre9Btaq0',
    liveDemoUrl: 'https://cursorserbia.com/',
    submitterName: 'Aleksandar Hadzibabic',
    submittedAt: '2026-09-04T09:11:41.722Z',
    averageScore: null,
    reviewCount: 0,
    favoriteCount: 0,
    favoritedByMe: false,
    myScore: null,
  },
]

function previewViewer(asJudge: boolean): ViewerState {
  return {
    email: asJudge ? 'judge@preview.local' : 'voter@preview.local',
    isJudge: asJudge,
    favoriteCount: 0,
    maxFavorites: MAX_FAVORITES_PER_USER,
  }
}

export default function HackathonProjectsGallery() {
  const { t } = useI18n()
  const { data: session, status: sessionStatus } = useSession()
  const searchParams = useSearchParams()
  const previewMode =
    process.env.NODE_ENV === 'development' && searchParams.get('preview') === '1'
  const previewJudge = searchParams.get('judge') === '1'

  const [projects, setProjects] = useState<ProjectGalleryItem[]>([])
  const [viewer, setViewer] = useState<ViewerState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [banner, setBanner] = useState('')

  const load = useCallback(async () => {
    if (previewMode) {
      const v = previewViewer(previewJudge)
      setProjects(
        PREVIEW_PROJECTS.map((p) => ({
          ...p,
          favoritedByMe: p.favoritedByMe,
          myScore: previewJudge ? p.myScore : null,
        })),
      )
      setViewer(v)
      setLoading(false)
      setError('')
      setBanner(t('hackathon.projectsPreviewBanner'))
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/hackathon/projects', { cache: 'no-store' })
      const data = (await res.json()) as ApiResponse
      if (!res.ok || !data.ok) {
        throw new Error(data.message || t('hackathon.projectsLoadError'))
      }
      setProjects(data.projects)
      setViewer(
        data.viewer ?? {
          email: null,
          isJudge: false,
          favoriteCount: 0,
          maxFavorites: MAX_FAVORITES_PER_USER,
        },
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t('hackathon.projectsLoadError'))
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [previewMode, previewJudge, t])

  useEffect(() => {
    void load()
  }, [load])

  const isSignedIn = previewMode
    ? true
    : sessionStatus === 'authenticated' && Boolean(session?.user?.email)
  const isJudge = previewMode ? previewJudge : Boolean(viewer?.isJudge)

  const onLogin = () => {
    void signIn('google')
  }

  const onFavorite = async (projectId: string, favorited: boolean) => {
    setBanner('')
    if (previewMode) {
      const current = projects.find((p) => p.id === projectId)
      if (!current) return
      if (favorited && !current.favoritedByMe) {
        const mine = projects.filter((p) => p.favoritedByMe).length
        if (mine >= MAX_FAVORITES_PER_USER) {
          setBanner(favoriteCapMessage())
          throw new Error(favoriteCapMessage())
        }
      }
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p
          const nextFav = favorited
          const delta = nextFav === p.favoritedByMe ? 0 : nextFav ? 1 : -1
          return {
            ...p,
            favoritedByMe: nextFav,
            favoriteCount: Math.max(0, p.favoriteCount + delta),
          }
        }),
      )
      setViewer((v) =>
        v
          ? {
              ...v,
              favoriteCount: Math.max(
                0,
                v.favoriteCount + (favorited ? 1 : -1),
              ),
            }
          : v,
      )
      return
    }

    setBusyId(projectId)
    try {
      const res = await fetch('/api/hackathon/projects/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: projectId, favorited }),
      })
      const data = (await res.json()) as {
        ok: boolean
        message?: string
        favorited?: boolean
        favoriteCount?: number
      }
      if (!res.ok || !data.ok) {
        setBanner(data.message || t('hackathon.projectsGenericError'))
        throw new Error(data.message || t('hackathon.projectsGenericError'))
      }
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p
          const nextFav = Boolean(data.favorited)
          const delta = nextFav === p.favoritedByMe ? 0 : nextFav ? 1 : -1
          return {
            ...p,
            favoritedByMe: nextFav,
            favoriteCount: Math.max(0, p.favoriteCount + delta),
          }
        }),
      )
      if (typeof data.favoriteCount === 'number') {
        setViewer((v) => (v ? { ...v, favoriteCount: data.favoriteCount! } : v))
      }
    } finally {
      setBusyId(null)
    }
  }

  const onScore = async (projectId: string, score: number) => {
    setBanner('')
    if (previewMode) {
      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id !== projectId) return p
          const hadScore = p.myScore != null
          const reviewCount = hadScore ? p.reviewCount : p.reviewCount + 1
          // Rebuild average from previous average + new/old myScore approximation for preview UX.
          const priorScores =
            p.reviewCount > 0 && p.averageScore != null
              ? Array.from({ length: p.reviewCount }, () => p.averageScore as number)
              : []
          if (hadScore && priorScores.length > 0) {
            priorScores[priorScores.length - 1] = score
          } else {
            priorScores.push(score)
          }
          return {
            ...p,
            myScore: score,
            reviewCount,
            averageScore: averageJudgeScore(priorScores),
          }
        })
        return next
      })
      return
    }

    setBusyId(projectId)
    try {
      const res = await fetch('/api/hackathon/projects/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: projectId, score }),
      })
      const data = (await res.json()) as { ok: boolean; message?: string; score?: number }
      if (!res.ok || !data.ok) {
        throw new Error(data.message || t('hackathon.projectsGenericError'))
      }
      await load()
    } finally {
      setBusyId(null)
    }
  }

  if (loading || (!previewMode && sessionStatus === 'loading')) {
    return (
      <p className="text-sm text-cursor-text-muted" role="status">
        {t('hackathon.projectsLoading')}
      </p>
    )
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-2xl border border-cursor-border bg-cursor-surface/60 p-6">
        <p className="text-cursor-accent-red">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="text-sm text-cursor-text-muted underline hover:text-cursor-text"
        >
          {t('hackathon.projectsRetry')}
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-cursor-border bg-cursor-surface/40 px-6 py-16 text-center">
        <p className="text-lg font-medium text-cursor-text">{t('hackathon.projectsEmptyTitle')}</p>
        <p className="mt-2 text-sm text-cursor-text-secondary">
          {t('hackathon.projectsEmptyBody')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {banner ? (
        <p
          className="rounded-lg border border-cursor-accent-orange/40 bg-cursor-accent-orange/10 px-4 py-3 text-sm text-cursor-accent-orange"
          role="status"
        >
          {banner}
        </p>
      ) : null}

      {!isSignedIn ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cursor-border bg-cursor-surface/50 px-4 py-3">
          <p className="text-sm text-cursor-text-secondary">{t('hackathon.projectsVoteHint')}</p>
          <button
            type="button"
            onClick={onLogin}
            className="rounded-md bg-cursor-text px-4 py-2 text-sm font-medium text-cursor-bg hover:bg-cursor-text-muted"
          >
            {t('hackathon.loginCta')}
          </button>
        </div>
      ) : (
        <p className="text-sm text-cursor-text-muted">
          {t('hackathon.projectsFavoritesUsed')
            .replace('{used}', String(viewer?.favoriteCount ?? 0))
            .replace('{max}', String(viewer?.maxFavorites ?? MAX_FAVORITES_PER_USER))}
          {isJudge ? ` · ${t('hackathon.projectsJudgeMode')}` : ''}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <HackathonProjectCard
            key={project.id}
            project={project}
            isJudge={isJudge}
            isSignedIn={isSignedIn}
            busy={busyId !== null}
            onFavorite={onFavorite}
            onScore={onScore}
            onLogin={onLogin}
          />
        ))}
      </div>
    </div>
  )
}

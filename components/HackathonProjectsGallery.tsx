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

const PREVIEW_PROJECTS: ProjectGalleryItem[] = [
  {
    id: 'preview-1',
    title: 'Grok Bot Concierge',
    description:
      'A voice-first concierge that books coworking desks and drafts follow-ups in Serbian and English.',
    githubUrl: 'https://github.com/octocat/Hello-World',
    demoRecordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    liveDemoUrl: 'https://demo.example.com/concierge',
    submitterName: 'Ada Hacker',
    submittedAt: '2026-09-04T10:00:00.000Z',
    averageScore: 8.5,
    reviewCount: 2,
    favoriteCount: 4,
    favoritedByMe: false,
    myScore: null,
  },
  {
    id: 'preview-2',
    title: 'Firecrawl Field Notes',
    description:
      'Crawl partner docs into a Cursor-ready knowledge pack with citations and MCP install tips.',
    githubUrl: 'https://github.com/octocat/Spoon-Knife',
    demoRecordingUrl: 'https://www.loom.com/share/previewdemo0001',
    liveDemoUrl: 'https://demo.example.com/field-notes',
    submitterName: 'Nikola Builder',
    submittedAt: '2026-09-04T11:00:00.000Z',
    averageScore: null,
    reviewCount: 0,
    favoriteCount: 1,
    favoritedByMe: true,
    myScore: null,
  },
  {
    id: 'preview-3',
    title: 'Daytona Sandbox Studio',
    description:
      'Spin ephemeral sandboxes for hackathon demos with one-click deploy and share links.',
    githubUrl: 'https://github.com/octocat/Hello-World',
    demoRecordingUrl: 'https://example.com/not-an-embed',
    liveDemoUrl: 'https://demo.example.com/sandbox',
    submitterName: null,
    submittedAt: '2026-09-04T12:00:00.000Z',
    averageScore: 7,
    reviewCount: 1,
    favoriteCount: 2,
    favoritedByMe: true,
    myScore: 7,
  },
  {
    id: 'preview-4',
    title: 'Wonder UI Kit',
    description: 'Generate branded UI kits for hackathon MVPs with Wonder Pro.',
    githubUrl: 'https://github.com/octocat/Hello-World',
    demoRecordingUrl: 'https://youtu.be/dQw4w9WgXcQ',
    liveDemoUrl: 'https://demo.example.com/wonder',
    submitterName: 'Mila Design',
    submittedAt: '2026-09-04T13:00:00.000Z',
    averageScore: 9,
    reviewCount: 1,
    favoriteCount: 0,
    favoritedByMe: true,
    myScore: null,
  },
]

function previewViewer(asJudge: boolean): ViewerState {
  return {
    email: asJudge ? 'judge@preview.local' : 'voter@preview.local',
    isJudge: asJudge,
    favoriteCount: 3,
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

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import HackathonCommunityLeaderboard from '@/components/HackathonCommunityLeaderboard'
import HackathonJudgePanel from '@/components/HackathonJudgePanel'
import HackathonProjectCard from '@/components/HackathonProjectCard'
import type {
  JudgePanelSummary,
  ProjectGalleryItem,
} from '@/app/api/hackathon/projects/route'
import {
  MAX_FAVORITES_PER_USER,
  favoriteCapMessage,
  formatConvexTop3Cash,
  rankCommunityLeaderboard,
} from '@/lib/project-gallery'
import { useHackerStatus } from '@/lib/use-hacker-status'
import { useI18n } from '@/lib/i18n'

type ViewerState = {
  email: string | null
  isJudge: boolean
  isAdmin?: boolean
  favoriteCount: number
  maxFavorites: number
}

type ApiResponse = {
  ok: boolean
  message?: string
  projects: ProjectGalleryItem[]
  viewer?: ViewerState
  judgePanel?: JudgePanelSummary
}

function emptyJudgePanel(): JudgePanelSummary {
  return {
    allRated: false,
    allFinished: false,
    myFinished: false,
    finishedCount: 0,
    canFinishScoring: false,
    resultsPublished: false,
    canPublishResults: false,
    judgeCount: 0,
    projectCount: 0,
    myRatedCount: 0,
    aggregateStatus: 'hidden',
    aggregateReason: null,
    ranked: [],
    peerVotes: null,
    top3: null,
    needsDecision: false,
    canSetFinalTop3: false,
    finalConfirmed: false,
  }
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
    teammateNames: [],
    submittedAt: '2026-09-04T09:11:41.722Z',
    averageScore: null,
    reviewCount: 0,
    favoriteCount: 0,
    favoritedByMe: false,
    myScore: null,
    canEditScore: true,
    awardPlace: null,
    awardLabel: null,
  },
]

function previewViewer(asJudge: boolean, asAdmin: boolean): ViewerState {
  return {
    email: asJudge || asAdmin ? 'judge@preview.local' : 'voter@preview.local',
    isJudge: asJudge,
    isAdmin: asAdmin,
    favoriteCount: 0,
    maxFavorites: MAX_FAVORITES_PER_USER,
  }
}

function previewJudgePanel(
  asJudge: boolean,
  asAdmin: boolean,
  projects: ProjectGalleryItem[],
  finished = false,
  published = false,
): JudgePanelSummary {
  if (!asJudge && !asAdmin) return emptyJudgePanel()
  const rated = projects.filter((p) => p.myScore != null).length
  const allScored = projects.length > 0 && rated === projects.length
  const allFinished = finished && allScored
  return {
    allRated: allScored,
    allFinished,
    myFinished: finished,
    finishedCount: finished ? 1 : 0,
    canFinishScoring: asJudge && allScored && !finished,
    resultsPublished: published,
    canPublishResults: asAdmin && allFinished && !published,
    judgeCount: 1,
    projectCount: projects.length,
    myRatedCount: rated,
    aggregateStatus: allFinished ? 'clear' : 'hidden',
    aggregateReason: null,
    ranked: allFinished
      ? projects.map((p, index) => ({
          id: p.id,
          title: p.title,
          averageScore: p.myScore ?? 0,
          competitionRank: index + 1,
        }))
      : [],
    peerVotes: allFinished
      ? projects.map((p) => ({
          submissionId: p.id,
          title: p.title,
          averageScore: p.myScore,
          scores: [{ judgeEmail: 'judge@preview.local', score: p.myScore }],
        }))
      : null,
    top3:
      allFinished && projects[0]
        ? [
            {
              place: 1 as const,
              id: projects[0].id,
              title: projects[0].title,
              averageScore: projects[0].myScore,
              source: 'clear' as const,
              awardLabel: formatConvexTop3Cash(1),
            },
          ]
        : null,
    needsDecision: false,
    canSetFinalTop3: allFinished,
    finalConfirmed: false,
  }
}

function apiErrorMessage(
  data: { message?: string; error?: string },
  fallback: string,
): string {
  return data.message || data.error || fallback
}

export default function HackathonProjectsGallery() {
  const { t } = useI18n()
  const { data: session, status: sessionStatus } = useSession()
  const hackerStatus = useHackerStatus()
  const searchParams = useSearchParams()
  const previewMode =
    process.env.NODE_ENV === 'development' && searchParams.get('preview') === '1'
  const previewJudge = searchParams.get('judge') === '1'
  const previewAdmin = searchParams.get('admin') === '1'
  const previewCheckedIn = searchParams.get('nocheckin') !== '1'

  const [projects, setProjects] = useState<ProjectGalleryItem[]>([])
  const [viewer, setViewer] = useState<ViewerState | null>(null)
  const [judgePanel, setJudgePanel] = useState<JudgePanelSummary>(emptyJudgePanel)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [banner, setBanner] = useState('')
  const [previewFinished, setPreviewFinished] = useState(false)
  const [previewPublished, setPreviewPublished] = useState(false)

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const silent = Boolean(options?.silent)
    if (previewMode) {
      const v = previewViewer(previewJudge, previewAdmin)
      const nextProjects = PREVIEW_PROJECTS.map((p) => ({
        ...p,
        favoritedByMe: p.favoritedByMe,
        myScore: previewJudge ? p.myScore : null,
        canEditScore: previewJudge,
        averageScore: null,
        reviewCount: 0,
        awardPlace: null,
        awardLabel: null,
      }))
      setProjects(nextProjects)
      setViewer(v)
      setJudgePanel(
        previewJudgePanel(
          previewJudge,
          previewAdmin,
          nextProjects,
          previewFinished,
          previewPublished,
        ),
      )
      setLoading(false)
      setError('')
      setBanner(t('hackathon.projectsPreviewBanner'))
      return
    }

    if (!silent) {
      setLoading(true)
      setError('')
    }
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
      setJudgePanel(data.judgePanel ?? emptyJudgePanel())
    } catch (err) {
      if (silent) {
        return
      }
      setError(err instanceof Error ? err.message : t('hackathon.projectsLoadError'))
      setProjects([])
      setJudgePanel(emptyJudgePanel())
    } finally {
      if (!silent) setLoading(false)
    }
  }, [previewMode, previewJudge, previewAdmin, t])

  useEffect(() => {
    void load()
  }, [load])

  const isSignedIn = previewMode
    ? true
    : sessionStatus === 'authenticated' && Boolean(session?.user?.email)
  const isJudge = previewMode ? previewJudge : Boolean(viewer?.isJudge)
  const isAdmin = previewMode ? previewAdmin : Boolean(viewer?.isAdmin)
  const lumaLoading = !previewMode && isSignedIn && hackerStatus.status === 'loading'
  const isCheckedIn = previewMode ? previewCheckedIn : hackerStatus.lumaStatus === 'checked_in'
  const canFavorite = isSignedIn && isCheckedIn

  const leaderboard = useMemo(
    () => rankCommunityLeaderboard(projects),
    [projects],
  )

  const onLogin = () => {
    void signIn('google')
  }

  const onFavorite = async (projectId: string, favorited: boolean) => {
    setBanner('')

    if (!previewMode && !isSignedIn) {
      onLogin()
      return
    }

    if (lumaLoading) {
      return
    }

    if (!isCheckedIn) {
      const message = isJudge
        ? t('hackathon.projectsJudgeAlsoFavorite')
        : t('hackathon.projectsNeedCheckIn')
      setBanner(message)
      throw new Error(message)
    }

    const current = projects.find((p) => p.id === projectId)
    if (!current) return

    if (favorited && !current.favoritedByMe) {
      const used =
        viewer?.favoriteCount ?? projects.filter((p) => p.favoritedByMe).length
      if (used >= MAX_FAVORITES_PER_USER) {
        const message = favoriteCapMessage()
        setBanner(message)
        throw new Error(message)
      }
    }

    if (previewMode) {
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
                v.favoriteCount + (favorited ? (current.favoritedByMe ? 0 : 1) : -1),
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
        error?: string
        favorited?: boolean
        favoriteCount?: number
      }
      if (!res.ok || !data.ok) {
        const message = apiErrorMessage(data, t('hackathon.projectsGenericError'))
        setBanner(message)
        throw new Error(message)
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
          return {
            ...p,
            myScore: score,
            canEditScore: !previewFinished,
            averageScore: null,
            reviewCount: 0,
          }
        })
        setJudgePanel(
          previewJudgePanel(true, previewAdmin, next, previewFinished, previewPublished),
        )
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
      const savedScore = typeof data.score === 'number' ? data.score : score
      const wasScored =
        projects.find((project) => project.id === projectId)?.myScore != null
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, myScore: savedScore } : p)),
      )
      setJudgePanel((panel) => ({
        ...panel,
        myRatedCount: wasScored ? panel.myRatedCount : panel.myRatedCount + 1,
        canFinishScoring:
          panel.projectCount > 0 &&
          (wasScored ? panel.myRatedCount : panel.myRatedCount + 1) === panel.projectCount &&
          !panel.myFinished,
      }))
      void load({ silent: true })
    } finally {
      setBusyId(null)
    }
  }

  const onConfirmTop3 = async (ids: {
    firstId: string
    secondId: string
    thirdId: string
  }) => {
    if (previewMode) {
      setJudgePanel((panel) => ({
        ...panel,
        finalConfirmed: true,
        needsDecision: false,
        canPublishResults: previewAdmin && !previewPublished,
        top3: [
          {
            place: 1,
            id: ids.firstId,
            title: projects.find((p) => p.id === ids.firstId)?.title ?? ids.firstId,
            averageScore: null,
            source: 'manual',
            awardLabel: formatConvexTop3Cash(1),
          },
          {
            place: 2,
            id: ids.secondId,
            title: projects.find((p) => p.id === ids.secondId)?.title ?? ids.secondId,
            averageScore: null,
            source: 'manual',
            awardLabel: formatConvexTop3Cash(2),
          },
          {
            place: 3,
            id: ids.thirdId,
            title: projects.find((p) => p.id === ids.thirdId)?.title ?? ids.thirdId,
            averageScore: null,
            source: 'manual',
            awardLabel: formatConvexTop3Cash(3),
          },
        ],
      }))
      return
    }

    const res = await fetch('/api/hackathon/projects/final-top3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ids),
    })
    const data = (await res.json()) as { ok: boolean; message?: string }
    if (!res.ok || !data.ok) {
      throw new Error(data.message || t('hackathon.projectsGenericError'))
    }
    await load()
  }

  const onFinishScoring = async () => {
    if (previewMode) {
      setPreviewFinished(true)
      const nextProjects = projects.map((p) => ({
        ...p,
        canEditScore: false,
        averageScore: p.myScore,
        reviewCount: 1,
        awardPlace: 1 as const,
        awardLabel: formatConvexTop3Cash(1),
      }))
      setProjects(nextProjects)
      setJudgePanel(
        previewJudgePanel(previewJudge, previewAdmin, nextProjects, true, previewPublished),
      )
      return
    }

    const res = await fetch('/api/hackathon/projects/finish-scoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finished: true }),
    })
    const data = (await res.json()) as { ok: boolean; message?: string }
    if (!res.ok || !data.ok) {
      throw new Error(data.message || t('hackathon.projectsGenericError'))
    }
    await load()
  }

  const onPublishResults = async (published: boolean) => {
    if (previewMode) {
      setPreviewPublished(published)
      setJudgePanel((panel) => ({
        ...panel,
        resultsPublished: published,
        canPublishResults: false,
      }))
      if (published && judgePanel.top3) {
        const awards = new Map(judgePanel.top3.map((entry) => [entry.id, entry.place]))
        setProjects((prev) =>
          prev.map((p) => {
            const place = awards.get(p.id) ?? null
            return {
              ...p,
              awardPlace: place,
              awardLabel: place ? formatConvexTop3Cash(place) : null,
            }
          }),
        )
      } else if (!published && !previewJudge) {
        setProjects((prev) =>
          prev.map((p) => ({ ...p, awardPlace: null, awardLabel: null })),
        )
      }
      return
    }

    const res = await fetch('/api/hackathon/projects/publish-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    })
    const data = (await res.json()) as { ok: boolean; message?: string }
    if (!res.ok || !data.ok) {
      throw new Error(data.message || t('hackathon.projectsGenericError'))
    }
    await load()
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

  // Judges/admins only — never open this panel from public JSON flags.
  const showJudgePanel = isJudge || isAdmin

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

      <HackathonCommunityLeaderboard entries={leaderboard} />

      {showJudgePanel ? (
        <HackathonJudgePanel
          panel={judgePanel}
          projects={projects}
          busy={busyId !== null}
          isAdmin={isAdmin}
          onConfirmTop3={onConfirmTop3}
          onFinishScoring={onFinishScoring}
          onPublishResults={onPublishResults}
        />
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
      ) : isJudge ? (
        <div className="space-y-1 rounded-xl border border-cursor-border bg-cursor-surface/50 px-4 py-3">
          <p className="text-sm text-cursor-text-muted">
            {t('hackathon.projectsJudgeMode')}
            {isCheckedIn
              ? ` · ${t('hackathon.projectsFavoritesUsed')
                  .replace('{used}', String(viewer?.favoriteCount ?? 0))
                  .replace('{max}', String(viewer?.maxFavorites ?? MAX_FAVORITES_PER_USER))}`
              : null}
          </p>
          {!isCheckedIn ? (
            lumaLoading ? (
              <p className="text-sm text-cursor-text-faint">
                {t('hackathon.projectsJudgeCheckingCheckIn')}
              </p>
            ) : hackerStatus.status === 'error' ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-cursor-accent-red">
                  {t('hackathon.submitStatusError')}
                </p>
                <button
                  type="button"
                  onClick={() => hackerStatus.refetch()}
                  className="text-sm text-cursor-text-muted underline hover:text-cursor-text"
                >
                  {t('hackathon.submitRetryStatus')}
                </button>
              </div>
            ) : (
              <p className="text-sm text-cursor-text-faint">
                {t('hackathon.projectsJudgeAlsoFavorite')}
              </p>
            )
          ) : null}
        </div>
      ) : lumaLoading ? (
        <p className="text-sm text-cursor-text-faint">
          {t('hackathon.projectsJudgeCheckingCheckIn')}
        </p>
      ) : hackerStatus.status === 'error' ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cursor-border bg-cursor-surface/50 px-4 py-3">
          <p className="text-sm text-cursor-accent-red">{t('hackathon.submitStatusError')}</p>
          <button
            type="button"
            onClick={() => hackerStatus.refetch()}
            className="text-sm text-cursor-text-muted underline hover:text-cursor-text"
          >
            {t('hackathon.submitRetryStatus')}
          </button>
        </div>
      ) : !isCheckedIn ? (
        <div className="space-y-1 rounded-xl border border-cursor-accent-yellow/30 bg-cursor-surface/50 px-4 py-3">
          <p className="text-sm font-medium text-cursor-accent-yellow">
            {t('hackathon.projectsNeedCheckIn')}
          </p>
          <p className="text-sm text-cursor-text-muted">
            {t('hackathon.projectsNeedCheckInHint')}
          </p>
        </div>
      ) : (
        <p className="text-sm text-cursor-text-muted">
          {t('hackathon.projectsFavoritesUsed')
            .replace('{used}', String(viewer?.favoriteCount ?? 0))
            .replace('{max}', String(viewer?.maxFavorites ?? MAX_FAVORITES_PER_USER))}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <HackathonProjectCard
            key={project.id}
            project={project}
            isJudge={isJudge}
            isSignedIn={isSignedIn}
            canFavorite={canFavorite}
            checkInPending={lumaLoading}
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

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { isHackathonJudge } from '@/lib/hackathon-judges'
import { averageJudgeScore } from '@/lib/project-gallery'

export const dynamic = 'force-dynamic'

export type ProjectGalleryItem = {
  id: string
  title: string
  description: string
  githubUrl: string
  demoRecordingUrl: string
  liveDemoUrl: string
  submitterName: string | null
  submittedAt: string
  /** Arithmetic mean of judge scores (1–10); null when no reviews. */
  averageScore: number | null
  reviewCount: number
  favoriteCount: number
  favoritedByMe: boolean
  myScore: number | null
}

type SubmissionRow = {
  id: string
  name: string | null
  project_title: string
  project_description: string
  github_url: string
  demo_recording_url: string
  live_demo_url: string
  submitted_at: string
}

type ReviewAggRow = {
  submission_id: string
  scores: number[] | null
}

type FavoriteAggRow = {
  submission_id: string
  favorite_count: string | number
}

type MyFavoriteRow = { submission_id: string }
type MyReviewRow = { submission_id: string; score: number }

export async function GET() {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { ok: false, message: 'Project gallery is not configured.', projects: [] },
      { status: 503 },
    )
  }

  const session = await auth()
  const viewerEmail = session?.user?.email?.trim().toLowerCase() ?? null
  const viewerIsJudge = isHackathonJudge(viewerEmail)

  try {
    const submissions = (await db`
      SELECT
        id,
        name,
        project_title,
        project_description,
        github_url,
        demo_recording_url,
        live_demo_url,
        submitted_at
      FROM hackathon_project_submissions
      ORDER BY submitted_at DESC
    `) as SubmissionRow[]

    if (submissions.length === 0) {
      return NextResponse.json({
        ok: true,
        projects: [] as ProjectGalleryItem[],
        viewer: {
          email: viewerEmail,
          isJudge: viewerIsJudge,
          favoriteCount: 0,
          maxFavorites: 3,
        },
      })
    }

    const reviewAggs = (await db`
      SELECT submission_id, array_agg(score) AS scores
      FROM hackathon_project_reviews
      GROUP BY submission_id
    `) as ReviewAggRow[]

    const favoriteAggs = (await db`
      SELECT submission_id, COUNT(*)::int AS favorite_count
      FROM hackathon_project_favorites
      GROUP BY submission_id
    `) as FavoriteAggRow[]

    const scoresById = new Map<string, number[]>()
    for (const row of reviewAggs) {
      scoresById.set(row.submission_id, row.scores ?? [])
    }

    const favoritesById = new Map<string, number>()
    for (const row of favoriteAggs) {
      favoritesById.set(row.submission_id, Number(row.favorite_count) || 0)
    }

    const myFavorites = new Set<string>()
    const myScores = new Map<string, number>()
    let myFavoriteCount = 0

    if (viewerEmail) {
      const favRows = (await db`
        SELECT submission_id
        FROM hackathon_project_favorites
        WHERE user_email = ${viewerEmail}
      `) as MyFavoriteRow[]
      myFavoriteCount = favRows.length
      for (const row of favRows) {
        myFavorites.add(row.submission_id)
      }

      if (viewerIsJudge) {
        const reviewRows = (await db`
          SELECT submission_id, score
          FROM hackathon_project_reviews
          WHERE judge_email = ${viewerEmail}
        `) as MyReviewRow[]
        for (const row of reviewRows) {
          myScores.set(row.submission_id, row.score)
        }
      }
    }

    const projects: ProjectGalleryItem[] = submissions.map((row) => {
      const scores = scoresById.get(row.id) ?? []
      return {
        id: row.id,
        title: row.project_title,
        description: row.project_description,
        githubUrl: row.github_url,
        demoRecordingUrl: row.demo_recording_url,
        liveDemoUrl: row.live_demo_url,
        submitterName: row.name,
        submittedAt:
          typeof row.submitted_at === 'string'
            ? row.submitted_at
            : new Date(row.submitted_at).toISOString(),
        averageScore: averageJudgeScore(scores),
        reviewCount: scores.length,
        favoriteCount: favoritesById.get(row.id) ?? 0,
        favoritedByMe: myFavorites.has(row.id),
        myScore: myScores.get(row.id) ?? null,
      }
    })

    return NextResponse.json({
      ok: true,
      projects,
      viewer: {
        email: viewerEmail,
        isJudge: viewerIsJudge,
        favoriteCount: myFavoriteCount,
        maxFavorites: 3,
      },
    })
  } catch (err) {
    console.error('Failed to list hackathon projects:', err)
    return NextResponse.json(
      { ok: false, message: 'Could not load projects.', projects: [] },
      { status: 500 },
    )
  }
}

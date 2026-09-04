import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import {
  MAX_FAVORITES_PER_USER,
  favoriteCapMessage,
} from '@/lib/project-gallery'

export const dynamic = 'force-dynamic'

function toError(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, error: message, ...extra }, { status })
}

/**
 * Toggle a community favorite on a submission.
 * Body: { submissionId: string, favorited?: boolean }
 * When `favorited` is omitted, toggles the current state.
 * Hard cap: MAX_FAVORITES_PER_USER (3) per signed-in user.
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return toError('Not authenticated', 401)
  }

  const email = session.user.email.trim().toLowerCase()

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return toError('Invalid request body.', 400)
  }

  const body = (payload ?? {}) as {
    submissionId?: unknown
    favorited?: unknown
  }
  const submissionId =
    typeof body.submissionId === 'string' ? body.submissionId.trim() : ''

  if (!submissionId) {
    return toError('submissionId is required.', 400)
  }

  const db = getDb()
  if (!db) {
    return toError('Project favorites are not configured.', 503)
  }

  try {
    const existing = await db`
      SELECT id FROM hackathon_project_submissions WHERE id = ${submissionId}::uuid LIMIT 1
    `
    if (!existing[0]) {
      return toError('Project not found.', 404)
    }

    const already = await db`
      SELECT id FROM hackathon_project_favorites
      WHERE user_email = ${email} AND submission_id = ${submissionId}::uuid
      LIMIT 1
    `
    const isFavorited = Boolean(already[0])

    let wantFavorited: boolean
    if (typeof body.favorited === 'boolean') {
      wantFavorited = body.favorited
    } else {
      wantFavorited = !isFavorited
    }

    if (wantFavorited === isFavorited) {
      const countRows = await db`
        SELECT COUNT(*)::int AS count
        FROM hackathon_project_favorites
        WHERE user_email = ${email}
      `
      const favoriteCount = Number(
        (countRows[0] as { count: number } | undefined)?.count ?? 0,
      )
      return NextResponse.json({
        ok: true,
        favorited: isFavorited,
        favoriteCount,
        maxFavorites: MAX_FAVORITES_PER_USER,
        message: isFavorited ? 'Already favorited.' : 'Not favorited.',
      })
    }

    if (!wantFavorited) {
      await db`
        DELETE FROM hackathon_project_favorites
        WHERE user_email = ${email} AND submission_id = ${submissionId}::uuid
      `
      const countRows = await db`
        SELECT COUNT(*)::int AS count
        FROM hackathon_project_favorites
        WHERE user_email = ${email}
      `
      const favoriteCount = Number(
        (countRows[0] as { count: number } | undefined)?.count ?? 0,
      )
      return NextResponse.json({
        ok: true,
        favorited: false,
        favoriteCount,
        maxFavorites: MAX_FAVORITES_PER_USER,
        message: 'Favorite removed.',
      })
    }

    const countRows = await db`
      SELECT COUNT(*)::int AS count
      FROM hackathon_project_favorites
      WHERE user_email = ${email}
    `
    const currentCount = Number(
      (countRows[0] as { count: number } | undefined)?.count ?? 0,
    )

    if (currentCount >= MAX_FAVORITES_PER_USER) {
      return toError(favoriteCapMessage(), 409, {
        code: 'FAVORITE_CAP',
        favoriteCount: currentCount,
        maxFavorites: MAX_FAVORITES_PER_USER,
      })
    }

    await db`
      INSERT INTO hackathon_project_favorites (submission_id, user_email)
      VALUES (${submissionId}::uuid, ${email})
      ON CONFLICT (user_email, submission_id) DO NOTHING
    `

    return NextResponse.json({
      ok: true,
      favorited: true,
      favoriteCount: currentCount + 1,
      maxFavorites: MAX_FAVORITES_PER_USER,
      message: 'Favorited.',
    })
  } catch (err) {
    console.error('Failed to toggle project favorite:', err)
    return toError('Could not update favorite.', 500)
  }
}

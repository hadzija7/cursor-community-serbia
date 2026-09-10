import { afterEach, describe, expect, it } from 'vitest'
import {
  parseJudgeEmails,
  isHackathonJudge,
  isHackathonAdmin,
  canManageJudgeFinalTop3,
} from '@/lib/hackathon-judges'
import {
  analyzeJudgeAggregate,
  averageJudgeScore,
  favoriteCapMessage,
  formatConvexTop3Cash,
  isJudgingComplete,
  rankCommunityLeaderboard,
  validateFinalTop3Ids,
  validateJudgeScore,
  COMMUNITY_LEADERBOARD_SIZE,
  CONVEX_TOP3_CASH_RSD,
  MAX_FAVORITES_PER_USER,
} from '@/lib/project-gallery'
import { resolveDemoEmbed, toLoomEmbedUrl } from '@/lib/demo-embed'

describe('parseJudgeEmails / isHackathonJudge', () => {
  const ORIGINAL = process.env.HACKATHON_JUDGE_EMAILS
  const ORIGINAL_ADMIN = process.env.HACKATHON_ADMIN_EMAILS

  afterEach(() => {
    if (ORIGINAL === undefined) {
      delete process.env.HACKATHON_JUDGE_EMAILS
    } else {
      process.env.HACKATHON_JUDGE_EMAILS = ORIGINAL
    }
    if (ORIGINAL_ADMIN === undefined) {
      delete process.env.HACKATHON_ADMIN_EMAILS
    } else {
      process.env.HACKATHON_ADMIN_EMAILS = ORIGINAL_ADMIN
    }
  })

  it('parses comma-separated emails case-insensitively', () => {
    const set = parseJudgeEmails(' Ada@Example.com , bob@test.com,, ')
    expect(set.has('ada@example.com')).toBe(true)
    expect(set.has('bob@test.com')).toBe(true)
    expect(set.size).toBe(2)
  })

  it('returns empty set when unset', () => {
    expect(parseJudgeEmails(undefined).size).toBe(0)
    expect(parseJudgeEmails('').size).toBe(0)
  })

  it('gates judges via HACKATHON_JUDGE_EMAILS', () => {
    process.env.HACKATHON_JUDGE_EMAILS = 'judge@cursorserbia.com, other@x.com'
    expect(isHackathonJudge('Judge@CursorSerbia.com')).toBe(true)
    expect(isHackathonJudge('hacker@example.com')).toBe(false)
    expect(isHackathonJudge(null)).toBe(false)
  })

  it('gates admins and final-top3 managers via HACKATHON_ADMIN_EMAILS', () => {
    process.env.HACKATHON_JUDGE_EMAILS = 'judge@example.com'
    process.env.HACKATHON_ADMIN_EMAILS = 'Admin@Example.com'
    expect(isHackathonAdmin('admin@example.com')).toBe(true)
    expect(isHackathonAdmin('judge@example.com')).toBe(false)
    expect(canManageJudgeFinalTop3('admin@example.com')).toBe(true)
    expect(canManageJudgeFinalTop3('judge@example.com')).toBe(true)
    expect(canManageJudgeFinalTop3('hacker@example.com')).toBe(false)
  })
})

describe('validateJudgeScore', () => {
  it('accepts integers 1–10', () => {
    expect(validateJudgeScore(1)).toEqual({ ok: true, score: 1 })
    expect(validateJudgeScore(10)).toEqual({ ok: true, score: 10 })
    expect(validateJudgeScore('7')).toEqual({ ok: true, score: 7 })
  })

  it('rejects out-of-bounds and non-integers', () => {
    expect(validateJudgeScore(0).ok).toBe(false)
    expect(validateJudgeScore(11).ok).toBe(false)
    expect(validateJudgeScore(7.5).ok).toBe(false)
    expect(validateJudgeScore('nope').ok).toBe(false)
    expect(validateJudgeScore(null).ok).toBe(false)
  })
})

describe('averageJudgeScore', () => {
  it('returns null for empty lists and averages otherwise', () => {
    expect(averageJudgeScore([])).toBeNull()
    expect(averageJudgeScore([8, 10])).toBe(9)
    expect(averageJudgeScore([8, 9, 10])).toBe(9)
    expect(averageJudgeScore([1, 2])).toBe(1.5)
  })
})

describe('favorite cap helpers', () => {
  it('documents the max of 3', () => {
    expect(MAX_FAVORITES_PER_USER).toBe(3)
    expect(favoriteCapMessage()).toMatch(/at most 3/i)
  })
})

describe('isJudgingComplete', () => {
  it('requires every judge × every project', () => {
    expect(
      isJudgingComplete({
        judgeEmails: ['a@x.com', 'b@x.com'],
        projectIds: ['p1', 'p2'],
        reviews: [
          { judgeEmail: 'a@x.com', submissionId: 'p1' },
          { judgeEmail: 'a@x.com', submissionId: 'p2' },
          { judgeEmail: 'b@x.com', submissionId: 'p1' },
        ],
      }),
    ).toBe(false)

    expect(
      isJudgingComplete({
        judgeEmails: ['a@x.com', 'b@x.com'],
        projectIds: ['p1', 'p2'],
        reviews: [
          { judgeEmail: 'a@x.com', submissionId: 'p1' },
          { judgeEmail: 'a@x.com', submissionId: 'p2' },
          { judgeEmail: 'b@x.com', submissionId: 'p1' },
          { judgeEmail: 'b@x.com', submissionId: 'p2' },
        ],
      }),
    ).toBe(true)
  })

  it('is false when no judges or no projects', () => {
    expect(
      isJudgingComplete({ judgeEmails: [], projectIds: ['p1'], reviews: [] }),
    ).toBe(false)
    expect(
      isJudgingComplete({ judgeEmails: ['a@x.com'], projectIds: [], reviews: [] }),
    ).toBe(false)
  })
})

describe('analyzeJudgeAggregate', () => {
  it('marks incomplete when judging is not finished', () => {
    const result = analyzeJudgeAggregate(
      [
        { id: 'a', title: 'A', averageScore: 10 },
        { id: 'b', title: 'B', averageScore: 9 },
        { id: 'c', title: 'C', averageScore: 8 },
      ],
      { judgingComplete: false },
    )
    expect(result.status).toBe('incomplete')
  })

  it('returns clear unique top 3 when averages strictly separate places', () => {
    const result = analyzeJudgeAggregate(
      [
        { id: 'a', title: 'A', averageScore: 9.5 },
        { id: 'b', title: 'B', averageScore: 8 },
        { id: 'c', title: 'C', averageScore: 7 },
        { id: 'd', title: 'D', averageScore: 6 },
      ],
      { judgingComplete: true },
    )
    expect(result.status).toBe('clear')
    if (result.status === 'clear') {
      expect(result.top3.map((e) => e.id)).toEqual(['a', 'b', 'c'])
    }
  })

  it('needs decision when 3rd ties with 4th', () => {
    const result = analyzeJudgeAggregate(
      [
        { id: 'a', title: 'A', averageScore: 10 },
        { id: 'b', title: 'B', averageScore: 9 },
        { id: 'c', title: 'C', averageScore: 8 },
        { id: 'd', title: 'D', averageScore: 8 },
      ],
      { judgingComplete: true },
    )
    expect(result.status).toBe('needs_decision')
  })

  it('needs decision when 1st/2nd share an average', () => {
    const result = analyzeJudgeAggregate(
      [
        { id: 'a', title: 'A', averageScore: 9 },
        { id: 'b', title: 'B', averageScore: 9 },
        { id: 'c', title: 'C', averageScore: 8 },
      ],
      { judgingComplete: true },
    )
    expect(result.status).toBe('needs_decision')
  })

  it('does not invent winners via title sort for final placement', () => {
    const result = analyzeJudgeAggregate(
      [
        { id: 'z', title: 'Zebra', averageScore: 8 },
        { id: 'a', title: 'Alpha', averageScore: 8 },
        { id: 'm', title: 'Mango', averageScore: 8 },
      ],
      { judgingComplete: true },
    )
    expect(result.status).toBe('needs_decision')
  })
})

describe('Convex top-3 cash awards', () => {
  it('uses 80k / 50k / 20k RSD amounts', () => {
    expect(CONVEX_TOP3_CASH_RSD[1]).toBe(80_000)
    expect(CONVEX_TOP3_CASH_RSD[2]).toBe(50_000)
    expect(CONVEX_TOP3_CASH_RSD[3]).toBe(20_000)
    expect(formatConvexTop3Cash(1)).toBe('80.000 RSD')
    expect(formatConvexTop3Cash(2)).toBe('50.000 RSD')
    expect(formatConvexTop3Cash(3)).toBe('20.000 RSD')
  })
})

describe('validateFinalTop3Ids', () => {
  it('requires three distinct ids', () => {
    expect(validateFinalTop3Ids('a', 'b', 'c').ok).toBe(true)
    expect(validateFinalTop3Ids('a', 'a', 'c').ok).toBe(false)
    expect(validateFinalTop3Ids('', 'b', 'c').ok).toBe(false)
  })
})

describe('rankCommunityLeaderboard', () => {
  it('returns top 3 by favorite count', () => {
    const ranked = rankCommunityLeaderboard([
      { id: 'a', title: 'Alpha', favoriteCount: 1, submittedAt: '2026-09-01T10:00:00Z' },
      { id: 'b', title: 'Beta', favoriteCount: 5, submittedAt: '2026-09-02T10:00:00Z' },
      { id: 'c', title: 'Gamma', favoriteCount: 3, submittedAt: '2026-09-03T10:00:00Z' },
      { id: 'd', title: 'Delta', favoriteCount: 4, submittedAt: '2026-09-04T10:00:00Z' },
    ])
    expect(COMMUNITY_LEADERBOARD_SIZE).toBe(3)
    expect(ranked.map((e) => e.id)).toEqual(['b', 'd', 'c'])
    expect(ranked.map((e) => e.rank)).toEqual([1, 2, 3])
    expect(ranked[0]?.favoriteCount).toBe(5)
  })

  it('breaks ties by earlier submission, then title', () => {
    const ranked = rankCommunityLeaderboard([
      { id: 'late', title: 'Zebra', favoriteCount: 2, submittedAt: '2026-09-05T12:00:00Z' },
      { id: 'early', title: 'Alpha', favoriteCount: 2, submittedAt: '2026-09-01T12:00:00Z' },
      { id: 'mid', title: 'Mango', favoriteCount: 2, submittedAt: '2026-09-03T12:00:00Z' },
      { id: 'same-time-b', title: 'Beta', favoriteCount: 1, submittedAt: '2026-09-02T12:00:00Z' },
      { id: 'same-time-a', title: 'Apple', favoriteCount: 1, submittedAt: '2026-09-02T12:00:00Z' },
    ])
    expect(ranked.map((e) => e.id)).toEqual(['early', 'mid', 'late'])
  })

  it('returns fewer than 3 when the gallery is smaller', () => {
    expect(
      rankCommunityLeaderboard([
        { id: 'only', title: 'Solo', favoriteCount: 0 },
      ]),
    ).toHaveLength(1)
    expect(rankCommunityLeaderboard([])).toEqual([])
  })
})

describe('demo embed resolution', () => {
  it('embeds YouTube and Loom when possible', () => {
    expect(resolveDemoEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual({
      kind: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    })
    expect(toLoomEmbedUrl('https://www.loom.com/share/abc123')).toBe(
      'https://www.loom.com/embed/abc123',
    )
    expect(resolveDemoEmbed('https://www.loom.com/share/abc123')).toEqual({
      kind: 'loom',
      embedUrl: 'https://www.loom.com/embed/abc123',
    })
  })

  it('falls back to external link', () => {
    expect(resolveDemoEmbed('https://vimeo.com/123')).toEqual({
      kind: 'external',
      href: 'https://vimeo.com/123',
    })
  })

  it('does not iframe untrusted hosts that mention youtube embed paths', () => {
    expect(
      resolveDemoEmbed('https://evil.example/youtube.com/embed/dQw4w9WgXcQ'),
    ).toEqual({
      kind: 'external',
      href: 'https://evil.example/youtube.com/embed/dQw4w9WgXcQ',
    })
    expect(
      resolveDemoEmbed('https://www.youtube.com/embed/dQw4w9WgXcQ'),
    ).toEqual({
      kind: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    })
  })
})

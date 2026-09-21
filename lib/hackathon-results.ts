/** Official judge-panel results: match submissions and build prize labels. */

import {
  hackathonOfficialResults,
  hackathonOfficialResultsPublished,
  hackathonPrizes,
} from '@/content/hackathon'
import type {
  OfficialResultTrack,
  OfficialResultTrackId,
  OfficialResultWinner,
} from '@/lib/types'
import type { JudgeAwardPlace } from '@/lib/project-gallery'

export type ProjectPrizeBadge = {
  trackId: OfficialResultTrackId
  place: JudgeAwardPlace
  /** Prize amount when the track has one (Convex / Daytona / ABC). */
  amount: string | null
}

export type ResolvedOfficialWinner = OfficialResultWinner & {
  projectId: string | null
  displayTitle: string
  amount: string | null
}

export type ResolvedOfficialTrack = Omit<OfficialResultTrack, 'winners'> & {
  winners: ResolvedOfficialWinner[]
}

export function normalizeProjectTitle(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function matchOfficialWinner(title: string, winner: OfficialResultWinner): boolean {
  const haystack = normalizeProjectTitle(title)
  if (!haystack) return false

  const needles = [winner.title, ...(winner.aliases ?? [])]
    .map(normalizeProjectTitle)
    .filter(Boolean)

  return needles.some((needle) => haystack === needle)
}

export function prizeAmountForTrackPlace(
  track: Pick<OfficialResultTrack, 'sponsor'>,
  place: JudgeAwardPlace,
): string | null {
  if (!track.sponsor) return null
  const prizeTrack = hackathonPrizes.find((entry) => entry.sponsor === track.sponsor)
  return prizeTrack?.places[place - 1]?.amount ?? null
}

export function resolveOfficialResults<T extends { id: string; title: string }>(
  projects: T[],
  published = hackathonOfficialResultsPublished,
): ResolvedOfficialTrack[] {
  if (!published) return []

  return hackathonOfficialResults.map((track) => ({
    ...track,
    winners: track.winners.map((winner) => {
      const match = projects.find((project) => matchOfficialWinner(project.title, winner))
      return {
        ...winner,
        projectId: match?.id ?? null,
        displayTitle: match?.title ?? winner.title,
        amount: prizeAmountForTrackPlace(track, winner.place),
      }
    }),
  }))
}

export function prizeBadgesForProject(
  title: string,
  published = hackathonOfficialResultsPublished,
): ProjectPrizeBadge[] {
  if (!published) return []

  const badges: ProjectPrizeBadge[] = []
  for (const track of hackathonOfficialResults) {
    const winner = track.winners.find((entry) => matchOfficialWinner(title, entry))
    if (!winner) continue
    badges.push({
      trackId: track.id,
      place: winner.place,
      amount: prizeAmountForTrackPlace(track, winner.place),
    })
  }
  return badges
}

export function officialWinnerTitleForSponsorPlace(
  sponsor: string,
  place: JudgeAwardPlace,
  published = hackathonOfficialResultsPublished,
): string | null {
  if (!published) return null
  const track = hackathonOfficialResults.find((entry) => entry.sponsor === sponsor)
  return track?.winners.find((winner) => winner.place === place)?.title ?? null
}

import { describe, expect, it } from 'vitest'
import { hackathonOfficialResults, hackathonOfficialResultsPublished } from '@/content/hackathon'
import {
  matchOfficialWinner,
  officialWinnerTitleForSponsorPlace,
  prizeAmountForTrackPlace,
  prizeBadgesForProject,
  resolveOfficialResults,
} from '@/lib/hackathon-results'

const PROJECTS = [
  { id: 'w', title: 'The Watcher' },
  { id: 's', title: 'Shader Arena' },
  { id: 'c', title: 'Slop Casino' },
  { id: 'x', title: 'SpaceX food' },
  { id: 'g', title: 'Golem' },
  { id: 'other', title: 'SignalFit' },
]

describe('official hackathon results', () => {
  it('is published with the announced placements', () => {
    expect(hackathonOfficialResultsPublished).toBe(true)
    expect(hackathonOfficialResults.map((track) => track.id)).toEqual([
      'overall',
      'convex',
      'daytona',
      'abc',
    ])
    expect(hackathonOfficialResults[0]?.winners.map((winner) => winner.title)).toEqual([
      'The Watcher',
      'Shader Arena',
      'Slop Casino',
    ])
    expect(hackathonOfficialResults[1]?.winners.map((winner) => winner.title)).toEqual([
      'Shader Arena',
      'Slop Casino',
      'SpaceX food',
    ])
    expect(hackathonOfficialResults[2]?.winners.map((winner) => winner.title)).toEqual([
      'Shader Arena',
      'SpaceX food',
      'Golem',
    ])
    expect(hackathonOfficialResults[3]?.winners.map((winner) => winner.title)).toEqual([
      'The Watcher',
      'Shader Arena',
      'Slop Casino',
    ])
  })

  it('matches gallery titles exactly after normalization', () => {
    expect(matchOfficialWinner('The Watcher', { place: 1, title: 'The Watcher' })).toBe(true)
    expect(matchOfficialWinner('the watcher', { place: 1, title: 'The Watcher' })).toBe(true)
    expect(
      matchOfficialWinner('The Watcher', { place: 1, title: 'The Watcher', aliases: ['watcher'] }),
    ).toBe(true)
    expect(matchOfficialWinner('Watcher Bot', { place: 1, title: 'The Watcher' })).toBe(false)
    expect(matchOfficialWinner('SignalFit', { place: 1, title: 'The Watcher' })).toBe(false)
  })

  it('resolves live project ids for result tracks', () => {
    const resolved = resolveOfficialResults(PROJECTS)
    expect(resolved[0]?.winners.map((winner) => winner.projectId)).toEqual(['w', 's', 'c'])
    expect(resolved[1]?.winners.map((winner) => winner.projectId)).toEqual(['s', 'c', 'x'])
    expect(resolved[2]?.winners.map((winner) => winner.projectId)).toEqual(['s', 'x', 'g'])
    expect(resolved[1]?.winners.map((winner) => winner.amount)).toEqual([
      '80.000 RSD',
      '50.000 RSD',
      '20.000 RSD',
    ])
  })

  it('builds prize badges for a winning project and skips non-winners', () => {
    expect(prizeBadgesForProject('SignalFit')).toEqual([])
    expect(prizeBadgesForProject('Shader Arena')).toEqual([
      { trackId: 'overall', place: 2, amount: null },
      { trackId: 'convex', place: 1, amount: '80.000 RSD' },
      { trackId: 'daytona', place: 1, amount: '$3,000 credits' },
      { trackId: 'abc', place: 2, amount: '40% scholarship' },
    ])
    expect(prizeBadgesForProject('The Watcher')).toEqual([
      { trackId: 'overall', place: 1, amount: null },
      { trackId: 'abc', place: 1, amount: '50% scholarship' },
    ])
  })

  it('looks up prize amounts and sponsor winners', () => {
    expect(prizeAmountForTrackPlace({ sponsor: 'Convex' }, 2)).toBe('50.000 RSD')
    expect(prizeAmountForTrackPlace({ sponsor: 'Daytona' }, 3)).toBe('$1,000 credits')
    expect(prizeAmountForTrackPlace({}, 1)).toBeNull()
    expect(officialWinnerTitleForSponsorPlace('Convex', 1)).toBe('Shader Arena')
    expect(officialWinnerTitleForSponsorPlace('Kosmonaut', 1)).toBeNull()
  })

  it('hides results when unpublished', () => {
    expect(resolveOfficialResults(PROJECTS, false)).toEqual([])
    expect(prizeBadgesForProject('Shader Arena', false)).toEqual([])
    expect(officialWinnerTitleForSponsorPlace('Convex', 1, false)).toBeNull()
  })
})

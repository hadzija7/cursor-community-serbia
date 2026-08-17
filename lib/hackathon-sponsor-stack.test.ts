import { describe, expect, it } from 'vitest'
import {
  getSponsorProfile,
  hackathonSdlcStages,
  hackathonSponsorProfiles,
  hackathonSponsors,
  hackathonStackRecipes,
} from '@/content/hackathon'

describe('hackathon sponsor stack content', () => {
  it('covers every confirmed sponsor exactly once', () => {
    const profileIds = hackathonSponsorProfiles.map((profile) => profile.id).sort()
    const stageIds = hackathonSdlcStages.map((stage) => stage.sponsorId).sort()
    const names = hackathonSponsors.map((sponsor) => sponsor.name).sort()
    const profileNames = hackathonSponsorProfiles.map((profile) => profile.name).sort()

    expect(profileIds).toEqual(stageIds)
    expect(profileNames).toEqual(names)
    expect(hackathonSponsorProfiles).toHaveLength(5)
  })

  it('does not invent unconfirmed event credits', () => {
    const tbdSponsors = ['firecrawl', 'elevenlabs', 'render']

    for (const id of tbdSponsors) {
      const profile = getSponsorProfile(id)
      expect(profile?.perks.some((perk) => perk.kind === 'confirmed')).toBe(false)
    }
  })

  it('keeps confirmed Daytona and Convex perks', () => {
    const daytona = getSponsorProfile('daytona')
    const convex = getSponsorProfile('convex')

    expect(daytona?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$100'))).toBe(true)
    expect(convex?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Convex'))).toBe(true)
  })

  it('recipes only reference known sponsors', () => {
    const ids = new Set(hackathonSponsorProfiles.map((profile) => profile.id))

    for (const recipe of hackathonStackRecipes) {
      expect(recipe.sponsorIds.every((id) => ids.has(id))).toBe(true)
    }
  })
})

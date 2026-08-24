import { describe, expect, it } from 'vitest'
import {
  getSponsorProfile,
  hackathonGuidePurpose,
  hackathonGuideSteps,
  hackathonGuideTeam,
  hackathonJudges,
  hackathonMentors,
  hackathonPrizes,
  hackathonSdlcStages,
  hackathonSponsorProfiles,
  hackathonCommunityPartners,
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
    expect(hackathonSponsorProfiles).toHaveLength(9)
  })

  it('lists Startit, Superteam, ABC BootCamps, JigJoy, and Kosmonaut as community partners', () => {
    expect(hackathonCommunityPartners.map((partner) => partner.name)).toEqual([
      'Startit',
      'Superteam Balkan',
      'ABC BootCamps',
      'JigJoy',
      'Kosmonaut',
    ])
  })

  it('gives every MCP-capable sponsor a Cursor install config', () => {
    for (const profile of hackathonSponsorProfiles) {
      if (profile.id === 'wispr') {
        expect(profile.mcp).toBeUndefined()
        continue
      }

      expect(profile.mcp?.name.length).toBeGreaterThan(0)
      expect(profile.mcp?.config).toBeTruthy()
    }

    expect(getSponsorProfile('firecrawl')?.mcp?.config).toEqual({ url: 'https://mcp.firecrawl.dev/v2/mcp' })
    expect(getSponsorProfile('convex')?.mcp?.name).toBe('convex')
    expect(getSponsorProfile('exa')?.mcp?.config).toEqual({ url: 'https://mcp.exa.ai/mcp' })
    expect(getSponsorProfile('fal')?.mcp?.config).toEqual({ url: 'https://mcp.fal.ai/mcp' })
    expect(getSponsorProfile('netlify')?.mcp?.config).toEqual({ command: 'npx -y @netlify/mcp' })
  })

  it('does not invent unconfirmed event credits', () => {
    const tbdSponsors = ['firecrawl', 'elevenlabs', 'render']

    for (const id of tbdSponsors) {
      const profile = getSponsorProfile(id)
      expect(profile?.perks.some((perk) => perk.kind === 'confirmed')).toBe(false)
    }
  })

  it('keeps confirmed Daytona, Convex, Wispr, Exa, Netlify, and Fal perks', () => {
    const daytona = getSponsorProfile('daytona')
    const convex = getSponsorProfile('convex')

    expect(daytona?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$100'))).toBe(true)
    expect(convex?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Convex'))).toBe(true)
    expect(getSponsorProfile('wispr')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('3 months'))).toBe(true)
    expect(getSponsorProfile('exa')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$50'))).toBe(true)
    expect(getSponsorProfile('fal')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$50'))).toBe(true)
    expect(getSponsorProfile('netlify')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('3,000'))).toBe(true)
  })

  it('lists Convex cash and Daytona credit prize tracks', () => {
    const sponsors = hackathonPrizes.map((track) => track.sponsor)

    expect(sponsors).toEqual(['Convex', 'Daytona'])
    expect(hackathonPrizes[0]?.places.map((place) => place.amount)).toEqual(['100.000 RSD', '50.000 RSD'])
    expect(hackathonPrizes[1]?.places.map((place) => place.amount)).toEqual([
      '$3,000 credits',
      '$2,000 credits',
      '$1,000 credits',
    ])
  })

  it('lists Nick Tomić first among mentors and keeps judges empty until announced', () => {
    expect(hackathonMentors[0]?.id).toBe('nick-tomic')
    expect(hackathonMentors[0]?.bio).toMatch(/350 SaaS founders/)
    expect(hackathonMentors[0]?.help?.toLowerCase()).toContain('go-to-market')
    expect(hackathonJudges).toEqual([])
  })

  it('keeps a minimal hacker guide with a seven-step timeline', () => {
    expect(hackathonGuidePurpose.title).toBe('Why we run this')
    expect(hackathonGuideTeam.body.toLowerCase()).toContain('solo')
    expect(hackathonGuideSteps.map((step) => step.id)).toEqual([
      'stack',
      'mentors',
      'cursor',
      'mcps',
      'origin',
      'demo',
      'submit',
    ])
  })

  it('recipes only reference known sponsors', () => {
    const ids = new Set(hackathonSponsorProfiles.map((profile) => profile.id))

    for (const recipe of hackathonStackRecipes) {
      expect(recipe.sponsorIds.every((id) => ids.has(id))).toBe(true)
    }
  })
})

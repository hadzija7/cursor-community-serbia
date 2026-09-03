import { describe, expect, it } from 'vitest'
import {
  getSponsorProfile,
  hackathonGuidePurpose,
  hackathonGuideSteps,
  hackathonGuideTeam,
  hackathonHosts,
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
    const marqueeNames = hackathonSponsors.map((sponsor) => sponsor.name).sort()
    const profileNames = hackathonSponsorProfiles.map((profile) => profile.name).sort()
    const stackOnlyNames = ['Grok Bot']

    expect(profileIds).toEqual(stageIds)
    expect(hackathonSponsorProfiles).toHaveLength(11)
    expect(profileNames.filter((name) => !stackOnlyNames.includes(name)).sort()).toEqual(marqueeNames)
    expect(getSponsorProfile('cursor')?.name).toBe('Grok Bot')
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
      // Wispr is desktop-only; Cursor is the host editor (no MCP install target).
      if (profile.id === 'wispr' || profile.id === 'cursor') {
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
    expect(getSponsorProfile('wonder')?.mcp?.config).toEqual({ url: 'https://mcp.wonder.so/mcp' })
  })

  it('does not invent unconfirmed event credits', () => {
    const tbdSponsors = ['elevenlabs', 'render']

    for (const id of tbdSponsors) {
      const profile = getSponsorProfile(id)
      expect(profile?.perks.some((perk) => perk.kind === 'confirmed')).toBe(false)
    }
  })

  it('keeps confirmed Daytona, Convex, Wispr, Exa, Netlify, Fal, Wonder, Firecrawl, and Cursor perks', () => {
    const daytona = getSponsorProfile('daytona')
    const convex = getSponsorProfile('convex')

    expect(daytona?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$100'))).toBe(true)
    expect(convex?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Convex'))).toBe(true)
    expect(getSponsorProfile('wispr')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('3 months'))).toBe(true)
    expect(getSponsorProfile('exa')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$50'))).toBe(true)
    expect(getSponsorProfile('fal')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$50'))).toBe(true)
    expect(getSponsorProfile('netlify')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('3,000'))).toBe(true)
    expect(getSponsorProfile('wonder')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Pro'))).toBe(true)
    expect(getSponsorProfile('firecrawl')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('10,000'))).toBe(true)
    expect(getSponsorProfile('cursor')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('referral'))).toBe(true)
  })

  it('lists Convex cash, Kosmonaut coworking, Daytona credits, and ABC BootCamps scholarships', () => {
    const sponsors = hackathonPrizes.map((track) => track.sponsor)

    expect(sponsors).toEqual(['Convex', 'Kosmonaut', 'Daytona', 'ABC BootCamps'])
    expect(hackathonPrizes[0]?.places.map((place) => place.amount)).toEqual(['100.000 RSD', '50.000 RSD'])
    expect(hackathonPrizes[1]?.category).toBe('Free coworking for top 3 teams')
    expect(hackathonPrizes[1]?.places.map((place) => place.amount)).toEqual([
      '15 coworking entries',
      '10 coworking entries',
      '5 coworking entries',
    ])
    expect(hackathonPrizes[1]?.note).toMatch(/3 months/)
    expect(hackathonPrizes[1]?.note).toMatch(/Kosmonaut platform/)
    expect(hackathonPrizes[2]?.places.map((place) => place.amount)).toEqual([
      '$3,000 credits',
      '$2,000 credits',
      '$1,000 credits',
    ])
    expect(hackathonPrizes[3]?.places.map((place) => place.amount)).toEqual([
      '50% scholarship',
      '40% scholarship',
      '30% scholarship',
    ])
  })

  it('lists Nick Tomić first among mentors, hosts from ambassadors, and keeps judges empty', () => {
    expect(hackathonMentors[0]?.id).toBe('nick-tomic')
    expect(hackathonMentors[0]?.bio).toMatch(/350 SaaS founders/)
    expect(hackathonMentors[0]?.help?.toLowerCase()).toContain('go-to-market')
    expect(hackathonMentors[0]?.links?.x).toBe('https://x.com/dropoutsanta')
    expect(hackathonMentors[0]?.links?.linkedin).toBe('https://www.linkedin.com/in/nicktomic/')
    expect(hackathonHosts.map((host) => host.id)).toEqual(['aleksandar-hadzibabic', 'goran-petkovic'])
    expect(hackathonHosts.every((host) => host.links?.x && host.links.linkedin)).toBe(true)
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

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
    expect(getSponsorProfile('xai')?.name).toBe('x.ai')
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
      // Wispr is desktop-only; Cursor is the host editor; x.ai is Console API key only.
      if (profile.id === 'wispr' || profile.id === 'cursor' || profile.id === 'xai') {
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
    const tbdSponsors = ['render']

    for (const id of tbdSponsors) {
      const profile = getSponsorProfile(id)
      expect(profile?.perks.some((perk) => perk.kind === 'confirmed')).toBe(false)
    }
  })

  it('keeps confirmed Daytona, Convex, Wispr, Exa, Netlify, Fal, Wonder, Firecrawl, Cursor, and x.ai perks', () => {
    const daytona = getSponsorProfile('daytona')
    const convex = getSponsorProfile('convex')
    const xai = getSponsorProfile('xai')

    expect(daytona?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$100'))).toBe(true)
    expect(convex?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Convex'))).toBe(true)
    expect(convex?.perks.some((perk) => /coupon|pro code/i.test(perk.label))).toBe(false)
    expect(getSponsorProfile('wispr')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('3 months'))).toBe(true)
    expect(getSponsorProfile('wispr')?.perks[0]?.detail).toMatch(/check-in/)
    expect(JSON.stringify(getSponsorProfile('wispr')?.perks)).not.toMatch(/wisprflow/i)
    expect(getSponsorProfile('exa')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$50'))).toBe(true)
    expect(getSponsorProfile('fal')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$50'))).toBe(true)
    expect(getSponsorProfile('netlify')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('3,000'))).toBe(true)
    expect(getSponsorProfile('wonder')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Pro'))).toBe(true)
    expect(getSponsorProfile('firecrawl')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('10,000'))).toBe(true)
    expect(getSponsorProfile('cursor')?.perks.filter((perk) => perk.kind === 'confirmed')).toHaveLength(2)
    expect(getSponsorProfile('cursor')?.perks.some((perk) => perk.label.includes('$20 Cursor'))).toBe(true)
    expect(getSponsorProfile('cursor')?.perks.some((perk) => perk.label.includes('$50 Cursor'))).toBe(true)
    expect(xai?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('~$35'))).toBe(true)
    expect(xai?.perks[0]?.detail).toMatch(/check-in/)
    expect(xai?.perks[0]?.detail).toMatch(/console\.x\.ai/)
    expect(xai?.perks[0]?.detail).toMatch(/does not work for Grok Bot/)
    expect(JSON.stringify(xai?.perks)).not.toMatch(/CREDIT_CODE/)
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

  it('lists Nick Tomić first among mentors, hosts including Vladimir, and publishes Ben Kim and Milan Lazarević as judges', () => {
    expect(hackathonMentors.map((mentor) => mentor.id)).toEqual([
      'nick-tomic',
      'miodrag-vilotijevic',
      'miodrag-todorovic',
    ])
    expect(hackathonMentors[0]?.bio).toMatch(/SaaS founder and growth consultant/)
    expect(hackathonMentors[0]?.bio).not.toMatch(/350 SaaS founders/)
    expect(hackathonMentors[0]?.help?.toLowerCase()).toContain('go-to-market')
    expect(hackathonMentors[0]?.links?.x).toBe('https://x.com/dropoutsanta')
    expect(hackathonMentors[0]?.links?.linkedin).toBe('https://www.linkedin.com/in/nicktomic/')
    expect(hackathonMentors[1]?.name).toBe('Miodrag Vilotijević')
    expect(hackathonMentors[1]?.title).toBe('Co-founder and CEO, JigJoy')
    expect(hackathonMentors[1]?.photo).toBe('/images/hackathon/miodrag-vilotijevic.jpg')
    expect(hackathonMentors[1]?.photoPosition).toBe('top')
    expect(hackathonMentors[1]?.bio).toMatch(/Mozaik/)
    expect(hackathonMentors[1]?.bio).not.toMatch(/unconventional ways/)
    expect(hackathonMentors[1]?.help?.toLowerCase()).toContain('domain-driven design')
    expect(hackathonMentors[1]?.links?.x).toBe('https://x.com/Mijuraaa')
    expect(hackathonMentors[1]?.links?.linkedin).toBe(
      'https://www.linkedin.com/in/miodrag-vilotijevic/',
    )
    expect(hackathonMentors[2]?.name).toBe('Miodrag Todorović')
    expect(hackathonMentors[2]?.title).toBe('Co-founder, JigJoy')
    expect(hackathonMentors[2]?.photo).toBe('/images/hackathon/miodrag-todorovic.jpg')
    expect(hackathonMentors[2]?.photoPosition).toBe('center')
    expect(hackathonMentors[2]?.bio).toMatch(/Mozaik Cloud/)
    expect(hackathonMentors[2]?.bio).toMatch(/baro/)
    expect(hackathonMentors[2]?.help?.toLowerCase()).toContain('multi-agent architectures')
    expect(hackathonMentors[2]?.links?.x).toBe('https://x.com/lotus_sbc')
    expect(hackathonMentors[2]?.links?.linkedin).toBe('https://www.linkedin.com/in/lotus015')
    expect(hackathonHosts.map((host) => host.id)).toEqual([
      'aleksandar-hadzibabic',
      'goran-petkovic',
      'vladimir-hristov',
    ])
    expect(hackathonHosts[0]?.bio).toMatch(/SpaceXAI ambassadors/)
    expect(hackathonHosts[1]?.bio).toMatch(/SpaceXAI ambassadors/)
    expect(hackathonHosts[0]?.links?.x && hackathonHosts[0]?.links.linkedin).toBeTruthy()
    expect(hackathonHosts[1]?.links?.x && hackathonHosts[1]?.links.linkedin).toBeTruthy()
    expect(hackathonHosts[2]?.name).toBe('Vladimir Hristov')
    expect(hackathonHosts[2]?.title).toBe('Embedded Software Engineer')
    expect(hackathonHosts[2]?.photo).toBe('/images/hackathon/vladimir-hristov.jpg')
    expect(hackathonHosts[2]?.photoPosition).toBe('top')
    expect(hackathonHosts[2]?.bio).toMatch(/technical documentation/)
    expect(hackathonHosts.every((host) => host.help === 'Whatever you need, we are here to help.')).toBe(
      true,
    )
    expect(hackathonHosts[2]?.links?.linkedin).toBe(
      'https://www.linkedin.com/in/vladimir-hristov-6645011a3/',
    )
    expect(hackathonHosts[2]?.links?.x).toBeUndefined()
    expect(hackathonJudges).toHaveLength(2)
    expect(hackathonJudges[0]?.id).toBe('ben-kim')
    expect(hackathonJudges[0]?.name).toBe('Ben Kim')
    expect(hackathonJudges[0]?.title).toBe('Founder, investor & community builder')
    expect(hackathonJudges[0]?.photo).toBe('/images/hackathon/ben-kim.jpg')
    expect(hackathonJudges[0]?.photoPosition).toBe('center')
    expect(hackathonJudges[0]?.bio).toMatch(/Mexico City/)
    expect(hackathonJudges[0]?.links?.x).toBe('https://x.com/benkimbuilds')
    expect(hackathonJudges[0]?.links?.linkedin).toBe('https://www.linkedin.com/in/benkimbuilds/')
    expect(hackathonJudges[1]?.id).toBe('milan-lazarevic')
    expect(hackathonJudges[1]?.name).toBe('Milan Lazarević')
    expect(hackathonJudges[1]?.title).toBe('Software engineer & ML specialist')
    expect(hackathonJudges[1]?.photo).toBe('/images/hackathon/milan-lazarevic.jpg')
    expect(hackathonJudges[1]?.photoPosition).toBe('center')
    expect(hackathonJudges[1]?.bio).toMatch(/computer vision/)
    expect(hackathonJudges[1]?.links?.x).toBe('https://x.com/MrLaki5')
    expect(hackathonJudges[1]?.links?.linkedin).toBe('https://www.linkedin.com/in/mrlaki5/')
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

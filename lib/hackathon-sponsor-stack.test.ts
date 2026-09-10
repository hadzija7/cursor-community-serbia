import { describe, expect, it } from 'vitest'
import {
  getSponsorProfile,
  hackathonGuideAgenda,
  hackathonGuideJudging,
  hackathonGuideJudgingCriteria,
  hackathonGuidePurpose,
  hackathonGuideRules,
  hackathonGuideRulesIntro,
  hackathonGuideSteps,
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
    expect(hackathonSponsorProfiles).toHaveLength(10)
    expect(profileNames.filter((name) => !stackOnlyNames.includes(name)).sort()).toEqual(marqueeNames)
    expect(getSponsorProfile('cursor')?.name).toBe('Grok Bot')
    expect(getSponsorProfile('xai')?.name).toBe('x.ai')
    expect(getSponsorProfile('netlify')).toBeUndefined()
    expect(hackathonSponsors.some((sponsor) => /netlify/i.test(sponsor.name))).toBe(false)
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
    expect(getSponsorProfile('wonder')?.mcp?.config).toEqual({ url: 'https://mcp.wonder.so/mcp' })
  })

  it('does not invent unconfirmed event credits', () => {
    const tbdSponsors: string[] = []

    for (const id of tbdSponsors) {
      const profile = getSponsorProfile(id)
      expect(profile?.perks.some((perk) => perk.kind === 'confirmed')).toBe(false)
    }

    for (const profile of hackathonSponsorProfiles) {
      expect(profile.perks.some((perk) => perk.kind === 'tbd')).toBe(false)
    }
  })

  it('keeps confirmed Daytona, Convex, Wispr, Exa, Fal, Wonder, Firecrawl, Render, Cursor, and x.ai perks', () => {
    const daytona = getSponsorProfile('daytona')
    const convex = getSponsorProfile('convex')
    const render = getSponsorProfile('render')
    const xai = getSponsorProfile('xai')

    expect(daytona?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$100'))).toBe(true)
    expect(convex?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Convex'))).toBe(true)
    expect(convex?.perks.some((perk) => /coupon|pro code/i.test(perk.label))).toBe(false)
    expect(getSponsorProfile('wispr')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('3 months'))).toBe(true)
    expect(getSponsorProfile('wispr')?.perks[0]?.detail).toMatch(/check-in/)
    expect(JSON.stringify(getSponsorProfile('wispr')?.perks)).not.toMatch(/wisprflow/i)
    expect(getSponsorProfile('exa')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$50'))).toBe(true)
    expect(getSponsorProfile('fal')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('$50'))).toBe(true)
    expect(getSponsorProfile('wonder')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Pro'))).toBe(true)
    expect(getSponsorProfile('firecrawl')?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('10,000'))).toBe(true)
    expect(render?.perks.some((perk) => perk.kind === 'confirmed' && perk.label.includes('Promo credits'))).toBe(true)
    expect(render?.perks[0]?.detail).toMatch(/check-in/)
    expect(render?.perks[0]?.detail).toMatch(/dashboard\.render\.com/)
    expect(render?.perks.some((perk) => perk.kind === 'public' && perk.label.includes('free tier'))).toBe(true)
    expect(JSON.stringify(render?.perks)).not.toMatch(/CREDIT_CODE/)
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

  it('lists Nick Tomić first among mentors, hosts including Vladimir, and publishes Ben Kim, Milan Lazarević, Agrim Singh, and Marija Mladenović as judges', () => {
    expect(hackathonMentors.map((mentor) => mentor.id)).toEqual([
      'nick-tomic',
      'miodrag-vilotijevic',
      'miodrag-todorovic',
      'alexandra-borisova',
      'dusan-radivojevic',
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
    expect(hackathonMentors[1]?.bio).toBe(
      'Co-founder and CEO of JigJoy and creator of Mozaik, an open-source runtime for AI agents.',
    )
    expect(hackathonMentors[1]?.bio).not.toMatch(/unconventional ways/)
    expect(hackathonMentors[1]?.help).toBe(
      'code quality, startup insights, and product positioning.',
    )
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
    expect(hackathonMentors[3]?.name).toBe('Alexandra Borisova')
    expect(hackathonMentors[3]?.title).toBe('SRE & Infra Leader')
    expect(hackathonMentors[3]?.photo).toBe('/images/hackathon/alexandra-borisova.jpg')
    expect(hackathonMentors[3]?.photoPosition).toBe('center')
    expect(hackathonMentors[3]?.bio).toMatch(/Typeable/)
    expect(hackathonMentors[3]?.help?.toLowerCase()).toContain('sre')
    expect(hackathonMentors[3]?.links?.linkedin).toBe(
      'https://www.linkedin.com/in/princessfruittt/',
    )
    expect(hackathonMentors[3]?.links?.x).toBeUndefined()
    expect(hackathonMentors[4]?.name).toBe('Dušan Radivojević')
    expect(hackathonMentors[4]?.title).toBe('Head of AI & Platform, Wonder')
    expect(hackathonMentors[4]?.photo).toBe('/images/hackathon/dusan-radivojevic.jpg')
    expect(hackathonMentors[4]?.photoPosition).toBe('center')
    expect(hackathonMentors[4]?.bio).toMatch(/AI-native design platform/)
    expect(hackathonMentors[4]?.help).toBe('design and AI.')
    expect(hackathonMentors[4]?.links?.x).toBe('https://x.com/radivojevic_1')
    expect(hackathonMentors[4]?.links?.linkedin).toBe(
      'https://www.linkedin.com/in/dusan-g-radivojevic',
    )
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
    expect(hackathonJudges).toHaveLength(4)
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
    expect(hackathonJudges[2]?.id).toBe('agrim-singh')
    expect(hackathonJudges[2]?.name).toBe('Agrim Singh')
    expect(hackathonJudges[2]?.title).toBe('AI adoption, SpaceXAI')
    expect(hackathonJudges[2]?.photo).toBe('/images/hackathon/agrim-singh.jpg')
    expect(hackathonJudges[2]?.photoPosition).toBe('center')
    expect(hackathonJudges[2]?.bio).toMatch(/SEA\/Singapore/)
    expect(hackathonJudges[2]?.bio).toMatch(/65 Labs/)
    expect(hackathonJudges[2]?.links?.x).toBe('https://x.com/agrimsingh')
    expect(hackathonJudges[2]?.links?.linkedin).toBe('https://www.linkedin.com/in/agrims/')
    expect(hackathonJudges[2]?.links?.website).toBeUndefined()
    expect(hackathonJudges[3]?.id).toBe('marija-mladenovic')
    expect(hackathonJudges[3]?.name).toBe('Marija Mladenović')
    expect(hackathonJudges[3]?.title).toBe('Lead product designer & angel investor')
    expect(hackathonJudges[3]?.photo).toBe('/images/hackathon/marija-mladenovic.jpg')
    expect(hackathonJudges[3]?.photoPosition).toBe('top')
    expect(hackathonJudges[3]?.bio).toMatch(/Solflare/)
    expect(hackathonJudges[3]?.bio).toMatch(/machine learning/)
    expect(hackathonJudges[3]?.links?.x).toBe('https://x.com/MarijaHolt')
    expect(hackathonJudges[3]?.links?.linkedin).toBe('https://www.linkedin.com/in/marijamladenovic/')
    expect(hackathonJudges[3]?.links?.website).toBeUndefined()
  })

  it('keeps a minimal hacker guide with rules, judging, and an eight-step timeline', () => {
    expect(hackathonGuidePurpose.title).toBe('Why we run this')
    expect(hackathonGuideRulesIntro.title).toBe('Rules')
    expect(hackathonGuideRules.map((rule) => rule.id)).toEqual([
      'team-size',
      'open-source',
      'what-counts',
      'live-demo',
      'video-demo',
    ])
    expect(hackathonGuideRules[0]?.body).toMatch(/1–3/)
    expect(hackathonGuideAgenda.map((item) => item.id)).toEqual([
      'intro',
      'hacking',
      'demo',
      'deadline',
      'voting',
      'pizza',
    ])
    expect(hackathonGuideAgenda[0]).toMatchObject({
      time: '10:30',
      title: 'Intro & welcome',
    })
    expect(hackathonGuideAgenda[1]).toMatchObject({
      time: '11:00',
      title: 'Hacking',
    })
    expect(hackathonGuideAgenda[1]?.body).toMatch(/starts at 11:00/)
    expect(hackathonGuideAgenda[1]?.body.toLowerCase()).toMatch(/workshop/)
    expect(hackathonGuideAgenda.find((item) => item.id === 'demo')?.time).toBe('17:00 – 19:00')
    expect(hackathonGuideAgenda.find((item) => item.id === 'deadline')?.time).toBe('19:00')
    expect(hackathonGuideAgenda.find((item) => item.id === 'voting')?.time).toBe('19:00 – 19:30')
    expect(hackathonGuideAgenda.find((item) => item.id === 'pizza')?.time).toBe('19:30 – 21:00')
    expect(hackathonGuideJudging.body).toMatch(/19 September/)
    expect(hackathonGuideJudgingCriteria.map((item) => item.id)).toEqual([
      'innovation',
      'working-product',
      'clarity',
      'execution',
      'impact',
    ])
    expect(hackathonGuideJudgingCriteria[0]?.title.toLowerCase()).toContain('innovation')
    expect(hackathonGuideSteps.map((step) => step.id)).toEqual([
      'stack',
      'mentors',
      'cursor',
      'mcps',
      'repo',
      'deploy',
      'demo',
      'submit',
    ])
    expect(hackathonGuideSteps.find((step) => step.id === 'repo')?.body).toMatch(/GitHub/)
    expect(hackathonGuideSteps.find((step) => step.id === 'repo')?.body).not.toMatch(
      /Host the repo on Origin/,
    )
    expect(hackathonGuideSteps.find((step) => step.id === 'deploy')?.body.toLowerCase()).toMatch(
      /public url|live/,
    )
  })

  it('recipes only reference known sponsors', () => {
    const ids = new Set(hackathonSponsorProfiles.map((profile) => profile.id))

    for (const recipe of hackathonStackRecipes) {
      expect(recipe.sponsorIds.every((id) => ids.has(id))).toBe(true)
    }
  })
})

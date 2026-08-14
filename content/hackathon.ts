import { HackathonPrizeTrack, Partner } from '@/lib/types'

export const hackathonConfig = {
  title: 'Cursor Hackathon Serbia',
  tagline: 'Build the future with AI — one full day of hacking, learning, and community.',
  // Static fallback when Luma is unreachable. Live date/location come from
  // `hackathonConfig.lumaUrl` via `/api/hackathon/event` (see lib/hackathon-details.ts).
  date: '2026-09-12',
  displayDate: 'September 12, 2026',
  location: 'Belgrade, Serbia',
  duration: '1 full day',
  lumaUrl: 'https://luma.com/ghvnbjlx',
}

export const hackathonStats = [
  { value: '1 day', label: 'Build sprint with Cursor', accent: 'orange' as const },
  { value: 'Mentors', label: 'Guidance from Cursor ambassadors', accent: 'green' as const },
  { value: 'Prizes', label: 'Awards for top projects', accent: 'yellow' as const },
  { value: 'Community', label: 'Food, drinks, and good vibes', accent: 'purple' as const },
]

/** Prize tracks — one card group per sponsoring prize category. */
export const hackathonPrizes: HackathonPrizeTrack[] = [
  {
    sponsor: 'Convex',
    sponsorLogo: '/images/partners/convex.png',
    sponsorUrl: 'https://convex.dev',
    logoBg: '#14120b',
    logoHeight: 'h-7',
    category: 'Best app that uses Convex',
    places: [
      { place: '1st place', amount: '100.000 RSD', accent: 'orange' },
      { place: '2nd place', amount: '50.000 RSD', accent: 'yellow' },
    ],
  },
]

/** Hackathon sponsors — edit logos in `public/images/partners/` or add new entries. */
export const hackathonSponsors: Partner[] = [
  {
    name: 'ElevenLabs',
    logo: '/images/partners/elevenlabs.svg',
    url: 'https://elevenlabs.io',
    logoBg: '#14120b',
    logoHeight: 'h-6',
  },
  {
    name: 'Firecrawl',
    logo: '/images/partners/firecrawl.svg',
    url: 'https://firecrawl.dev',
    logoBg: '#14120b',
    logoHeight: 'h-8',
  },
  {
    name: 'Render',
    logo: '/images/partners/render.svg',
    url: 'https://render.com',
    logoBg: '#ffffff',
    logoHeight: 'h-6',
    logoWidth: 'w-28',
  },
  {
    name: 'Convex',
    logo: '/images/partners/convex.png',
    url: 'https://convex.dev',
    logoBg: '#14120b',
    logoHeight: 'h-8',
  },
  {
    name: 'Daytona',
    logo: '/images/partners/daytona.svg',
    url: 'https://www.daytona.io',
    logoBg: '#14120b',
    logoHeight: 'h-7',
  },
]

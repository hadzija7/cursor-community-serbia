import { Partner } from '@/lib/types'

export const hackathonConfig = {
  title: 'Cursor Hackathon Serbia',
  tagline: 'Build the future with AI — one full day of hacking, learning, and community.',
  // Static fallback when Luma is unreachable. Live date/location come from
  // `hackathonConfig.lumaUrl` via `/api/hackathon/event` (see lib/hackathon-details.ts).
  date: '2026-08-22',
  displayDate: 'August 22, 2026',
  location: 'Novi Sad, Serbia',
  duration: '1 full day',
  lumaUrl: 'https://luma.com/ghvnbjlx',
}

export const hackathonStats = [
  { value: '1 day', label: 'Build sprint with Cursor', accent: 'orange' as const },
  { value: 'Mentors', label: 'Guidance from Cursor ambassadors', accent: 'green' as const },
  { value: 'Prizes', label: 'Awards for top projects', accent: 'yellow' as const },
  { value: 'Community', label: 'Food, drinks, and good vibes', accent: 'purple' as const },
]

/** Hackathon sponsors — edit logos in `public/images/partners/` or add new entries. */
export const hackathonSponsors: Partner[] = [
  {
    name: 'Cursor',
    logo: '/cursor-logo.svg',
    url: 'https://cursor.com',
    logoBg: '#14120b',
    logoHeight: 'h-8',
  },
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
]

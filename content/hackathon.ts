import {
  HackathonPrizeTrack,
  HackathonSdlcStage,
  HackathonSponsorProfile,
  HackathonStackPick,
  HackathonStackRecipe,
  Partner,
} from '@/lib/types'

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

/** One-day build path — order is left-to-right on `/hackathon/stack`. */
export const hackathonSdlcStages: HackathonSdlcStage[] = [
  {
    id: 'research',
    label: 'Research / web data',
    job: 'Turn live websites into clean data',
    sponsorId: 'firecrawl',
    accent: 'orange',
  },
  {
    id: 'execute',
    label: 'AI sandboxes',
    job: 'Run agent or untrusted code safely',
    sponsorId: 'daytona',
    accent: 'green',
  },
  {
    id: 'backend',
    label: 'Backend / state',
    job: 'Store data and sync the UI live',
    sponsorId: 'convex',
    accent: 'yellow',
  },
  {
    id: 'experience',
    label: 'Voice / audio',
    job: 'Speech in, speech out, voice agents',
    sponsorId: 'elevenlabs',
    accent: 'purple',
  },
  {
    id: 'deploy',
    label: 'Host / infrastructure',
    job: 'Public demo URL from Git',
    sponsorId: 'render',
    accent: 'blue',
  },
]

export const hackathonSponsorProfiles: HackathonSponsorProfile[] = [
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    logo: '/images/partners/firecrawl.svg',
    url: 'https://www.firecrawl.dev',
    docsUrl: 'https://www.firecrawl.dev',
    logoBg: '#14120b',
    logoHeight: 'h-8',
    sdlcStage: 'research',
    oneLiner: 'Give the app live web pages as clean markdown or JSON, not raw HTML.',
    technologies: [
      'Scrape — one URL to markdown, HTML, or JSON',
      'Crawl — follow links from a start URL',
      'Map — list site URLs without scraping bodies',
      'Search — web search with optional full-page content',
      'Extract — structured JSON fields from a page',
      'Interact — click, fill, and paginate in a browser',
      'MCP / CLI / API — including keyless for small usage',
    ],
    useCases: [
      'RAG over a docs site or blog',
      'Research agent that searches, scrapes, and cites sources',
      'Watchlist that extracts price, title, or date from known URLs',
      '“What’s new” brief from a docs tree',
      'Reach data behind clicks you are allowed to automate',
    ],
    perks: [
      { kind: 'tbd', label: 'Event credits', detail: 'Not confirmed yet. Do not assume a pack until a code is published.' },
      { kind: 'public', label: 'Start here: 1,000 free credits / month', detail: 'Public free tier (keyless or after signup), not a hackathon gift.' },
    ],
  },
  {
    id: 'daytona',
    name: 'Daytona',
    logo: '/images/partners/daytona.svg',
    url: 'https://www.daytona.io',
    docsUrl: 'https://www.daytona.io/docs/',
    logoBg: '#14120b',
    logoHeight: 'h-7',
    sdlcStage: 'execute',
    oneLiner: 'Isolated computers that boot in milliseconds so agents can run code off your laptop.',
    technologies: [
      'Sandboxes — isolated Linux (VM / GPU options too)',
      'Code interpreter — exec and stream output',
      'Snapshots — freeze and restore an environment',
      'Computer use — programmatic Linux / Windows / macOS desktops',
      'SDKs + MCP — Python, TypeScript, and Cursor-driven tools',
    ],
    useCases: [
      'Coding agent: write a function, run tests in a sandbox, show the trace',
      'Safe runner for user-pasted scripts',
      'Eval harness: same prompt, several isolated runs',
      'Data-analysis agent that plots a chart in the sandbox',
      'Fan out a few parallel experiments without local Docker',
    ],
    perks: [
      { kind: 'confirmed', label: '$100 credits for every participant' },
      {
        kind: 'confirmed',
        label: 'Winners: $3,000 / $2,000 / $1,000 credits',
        detail: 'TBD whether these are overall places or a Daytona-only track, and how you redeem.',
      },
    ],
  },
  {
    id: 'convex',
    name: 'Convex',
    logo: '/images/partners/convex.png',
    url: 'https://www.convex.dev',
    docsUrl: 'https://www.convex.dev/hackathons/resources',
    logoBg: '#14120b',
    logoHeight: 'h-8',
    sdlcStage: 'backend',
    oneLiner: 'TypeScript backend with a database and live updates — skip Postgres plus sockets for the demo.',
    technologies: [
      'Database — documents and indexes',
      'Queries, mutations, and actions',
      'Realtime — UI stays in sync without WebSockets',
      'Auth — scope rows by user',
      'File storage, cron, and scheduler',
      'Components — packaged backend features',
    ],
    useCases: [
      'Live chat or multiplayer that updates for everyone',
      'Agent memory: store runs, tools, and threads',
      'Signed-in app where each user only sees their data',
      'Live dashboard fed by scrapes or webhooks',
      'Job list: enqueue work, call an API, show status',
    ],
    perks: [
      {
        kind: 'confirmed',
        label: 'Best app that uses Convex',
        detail: '1st 100.000 RSD · 2nd 50.000 RSD. You must actually use Convex.',
      },
      { kind: 'tbd', label: 'Participant coupon / Pro code', detail: 'Not confirmed for this event.' },
      { kind: 'public', label: 'Start here: free for small teams', detail: 'Public Convex tier, not a published event credit.' },
    ],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    logo: '/images/partners/elevenlabs.svg',
    url: 'https://elevenlabs.io',
    docsUrl: 'https://elevenlabs.io/developer',
    logoBg: '#14120b',
    logoHeight: 'h-6',
    sdlcStage: 'experience',
    oneLiner: 'Production speech: text-to-speech, speech-to-text, and full voice agents.',
    technologies: [
      'Text to Speech — including low-latency Flash and streaming',
      'Speech to Text (Scribe)',
      'Agents platform — conversational voice with tools',
      'Voice clone / design / remix',
      'Also: music, sound effects, dubbing',
    ],
    useCases: [
      'Voice tutor: talk in, logic in the middle, speak the answer',
      'Demo narration for judges',
      'Read results aloud for accessibility',
      'Voice agent that calls Firecrawl or Convex as tools',
      'Multilingual greeting for a Serbia + English demo',
    ],
    perks: [
      { kind: 'tbd', label: 'Event credits or prize track', detail: 'Not confirmed yet.' },
      {
        kind: 'public',
        label: 'Start here: 10,000 credits on signup',
        detail: 'ElevenLabs public free tier, not a confirmed hackathon grant.',
      },
    ],
  },
  {
    id: 'render',
    name: 'Render',
    logo: '/images/partners/render.svg',
    url: 'https://render.com',
    docsUrl: 'https://render.com',
    logoBg: '#ffffff',
    logoHeight: 'h-6',
    sdlcStage: 'deploy',
    oneLiner: 'Ship a public URL from Git — web apps, static sites, databases, and workers.',
    technologies: [
      'Web services — deploy a server from a repo',
      'Static sites — frontend plus CDN',
      'Render Postgres — managed SQL if you skip Convex',
      'Redis, cron, and background workers',
      'Private services and Workflows',
    ],
    useCases: [
      'Put the demo on a public HTTPS URL so judges skip localhost',
      'Host a thin API next to a Convex or Daytona agent',
      'Classic fullstack with Postgres if you skip Convex',
      'Worker that polls Firecrawl or processes uploads',
      'Static landing plus a separate API, both from GitHub',
    ],
    perks: [
      { kind: 'tbd', label: 'Event credits or prize track', detail: 'Not confirmed yet.' },
      {
        kind: 'public',
        label: 'Start here: public free tier',
        detail: 'Render’s own free web/static/Postgres options — check current limits. Not an event credit pack.',
      },
    ],
  },
]

export const hackathonStackRecipes: HackathonStackRecipe[] = [
  {
    title: 'Voice research agent',
    summary: 'Scrape or search the web, store answers in Convex, then talk to the result.',
    sponsorIds: ['firecrawl', 'convex', 'elevenlabs'],
  },
  {
    title: 'Coding agent',
    summary: 'Write code in Cursor, run it in a Daytona sandbox, keep runs and logs in Convex.',
    sponsorIds: ['daytona', 'convex'],
  },
  {
    title: 'Live ops dashboard',
    summary: 'Pull live pages with Firecrawl, show them live in Convex, host the dashboard on Render.',
    sponsorIds: ['firecrawl', 'convex', 'render'],
  },
]

export const hackathonStackPicks: HackathonStackPick[] = [
  { need: 'Live website content inside the app', use: 'Firecrawl' },
  { need: 'The agent to run code, tests, or a shell', use: 'Daytona' },
  { need: 'Users, rows, and instant UI updates', use: 'Convex' },
  { need: 'The demo to talk or listen', use: 'ElevenLabs' },
  { need: 'A public HTTPS URL or extra Postgres', use: 'Render' },
]

export const hackathonStackOverlap = [
  'Convex can be the whole backend. Render is the public demo URL and conventional hosting.',
  'Daytona is not production hosting — it is an isolated runtime for agent or untrusted code.',
  'Firecrawl is input. ElevenLabs is output. Neither replaces a backend.',
]

export function getSponsorProfile(id: string): HackathonSponsorProfile | undefined {
  return hackathonSponsorProfiles.find((profile) => profile.id === id)
}

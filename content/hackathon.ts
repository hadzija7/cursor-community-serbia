import {
  HackathonGuideCopy,
  HackathonGuideStep,
  HackathonGuideTopic,
  HackathonPerson,
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
    logoHeight: 'h-8',
    category: 'Best app that uses Convex',
    note: 'You must actually use Convex in the demo.',
    places: [
      { place: '1st place', amount: '100.000 RSD', accent: 'orange' },
      { place: '2nd place', amount: '50.000 RSD', accent: 'yellow' },
    ],
  },
  {
    sponsor: 'Kosmonaut',
    sponsorLogo: '/images/partners/kosmonaut.svg',
    sponsorUrl: 'https://www.kosmonaut.rs/',
    logoBg: '#14120b',
    logoHeight: 'h-8',
    category: 'Free coworking for top 3 teams',
    note: 'Each teammate gets the entries for their place. Use them within 3 months. Register on the Kosmonaut platform to claim.',
    places: [
      { place: '1st place', amount: '15 coworking entries', accent: 'green' },
      { place: '2nd place', amount: '10 coworking entries', accent: 'yellow' },
      { place: '3rd place', amount: '5 coworking entries', accent: 'purple' },
    ],
  },
  {
    sponsor: 'Daytona',
    sponsorLogo: '/images/partners/daytona.svg',
    sponsorUrl: 'https://www.daytona.io',
    logoBg: '#14120b',
    logoHeight: 'h-7',
    category: 'Best app that uses Daytona',
    note: 'You must actually use Daytona. Every participant also receives $100 platform credits.',
    places: [
      { place: '1st place', amount: '$3,000 credits', accent: 'green' },
      { place: '2nd place', amount: '$2,000 credits', accent: 'yellow' },
      { place: '3rd place', amount: '$1,000 credits', accent: 'purple' },
    ],
  },
]

/** Short purpose line for `/hackathon/guide`. */
export const hackathonGuidePurpose: HackathonGuideCopy = {
  title: 'Why we run this',
  body: 'A one-day sprint to ship something real with Cursor and the tech partner tools. Not a polished startup — a working demo the same day.',
}

export const hackathonGuideTeam: HackathonGuideCopy = {
  title: 'Team',
  body: 'Solo or a team. Keep it small enough to ship in a day.',
}

/** Day-of path — order is the visual timeline on `/hackathon/guide`. */
export const hackathonGuideSteps: HackathonGuideStep[] = [
  {
    id: 'stack',
    title: 'Check the Stack',
    body: 'See what each tech partner is for before you start building.',
  },
  {
    id: 'mentors',
    title: 'Consult mentors',
    body: 'Ask early when you stall — product, GTM, or the stack.',
  },
  {
    id: 'cursor',
    title: 'Build in Cursor',
    body: 'The host editor. Agents, rules, and MCPs live here.',
  },
  {
    id: 'mcps',
    title: 'Use partner MCPs',
    body: 'Wire the tools in Cursor. Do not rebuild what tech partners already give you.',
  },
  {
    id: 'origin',
    title: 'Host the repo on Origin',
    body: 'Put the project on Cursor’s git host so the team and judges can find it.',
  },
  {
    id: 'demo',
    title: 'Build a 3-minute demo',
    body: 'One problem, one happy path, one short story. That is what judges watch.',
  },
  {
    id: 'submit',
    title: 'Submit through the form',
    body: 'The submission form lands on the day. Do not skip it.',
  },
]

/** Empty until challenge tracks or themes are confirmed. */
export const hackathonGuideTopics: HackathonGuideTopic[] = []

/** Mentors — first listed is featured first on `/hackathon/mentors`. */
export const hackathonMentors: HackathonPerson[] = [
  {
    id: 'nick-tomic',
    name: 'Nick Tomić',
    title: 'CTO and builder',
    photo: '/images/hackathon/nick-tomic.jpg',
    photoPosition: 'center',
    bio: 'Nick Tomić is a SaaS founder and growth consultant who specializes in helping tech startups build and launch AI products. His expertise is built on extensive research, including interviewing over 350 SaaS founders to understand the keys to product-market fit.',
    help: 'Go-to-market — positioning, story, and how to talk about what you shipped.',
  },
]

/** Judges — add rows as they lock. Empty until then. */
export const hackathonJudges: HackathonPerson[] = []

/** Tech partners (tools for hackers) — edit logos in `public/images/partners/` or add new entries. */
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
  {
    name: 'Wispr Flow',
    logo: '/images/partners/wispr-flow.svg',
    url: 'https://wisprflow.ai/',
    logoBg: '#14120b',
    logoHeight: 'h-7',
  },
  {
    name: 'Exa',
    logo: '/images/partners/exa.png',
    url: 'https://exa.ai/',
    logoBg: '#ffffff',
    logoHeight: 'h-8',
  },
  {
    name: 'Netlify',
    logo: '/images/partners/netlify.svg',
    url: 'https://www.netlify.com/',
    logoBg: '#ffffff',
    logoHeight: 'h-8',
  },
  {
    name: 'Fal.ai',
    logo: '/images/partners/fal.svg',
    url: 'https://fal.ai/',
    logoBg: '#14120b',
    logoHeight: 'h-8',
  },
]

/** Local hosts and community orgs — shown below tech partners on Overview. */
export const hackathonCommunityPartners: Partner[] = [
  {
    name: 'Startit',
    logo: '/images/partners/startit-white.png',
    url: 'https://startit.rs',
    logoBg: '#14120b',
    logoHeight: 'h-8',
  },
  {
    name: 'Superteam Balkan',
    logo: '/images/partners/superteam-balkan.png',
    url: 'https://blkn.superteam.fun/',
    logoBg: '#0f0d06',
    logoHeight: 'h-10',
  },
  {
    name: 'ABC BootCamps',
    logo: '/images/partners/abc-bootcamps.png',
    url: 'https://abcbootcamps.com/',
    logoBg: '#ffffff',
    logoHeight: 'h-10',
  },
  {
    name: 'JigJoy',
    logo: '/images/partners/jigjoy.svg',
    url: 'https://jigjoy.ai/',
    logoBg: '#14120b',
    logoHeight: 'h-10',
  },
  {
    name: 'Kosmonaut',
    logo: '/images/partners/kosmonaut.svg',
    url: 'https://www.kosmonaut.rs/',
    logoBg: '#14120b',
    logoHeight: 'h-8',
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
    id: 'search',
    label: 'Search / web',
    job: 'Find sources the agent does not already have',
    sponsorId: 'exa',
    accent: 'green',
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
    id: 'dictate',
    label: 'Voice input',
    job: 'Dictate into Cursor instead of typing',
    sponsorId: 'wispr',
    accent: 'purple',
  },
  {
    id: 'generate',
    label: 'Generate / media',
    job: 'Images, video, and audio from models',
    sponsorId: 'fal',
    accent: 'orange',
  },
  {
    id: 'deploy',
    label: 'Host / infra',
    job: 'Public demo URL from Git',
    sponsorId: 'render',
    accent: 'blue',
  },
  {
    id: 'ship',
    label: 'Host / frontend',
    job: 'Public site, previews, and a demo URL',
    sponsorId: 'netlify',
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
    mcp: {
      name: 'firecrawl',
      config: { url: 'https://mcp.firecrawl.dev/v2/mcp' },
    },
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
        detail: 'Best app that uses Daytona. How you redeem (code vs dashboard grant) will be announced on the day.',
      },
    ],
    mcp: {
      name: 'daytona-mcp',
      config: { command: 'daytona', args: ['mcp', 'start'] },
      note: 'Install the Daytona CLI and run daytona login first.',
    },
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
    mcp: {
      name: 'convex',
      config: { command: 'npx -y convex@latest mcp start' },
    },
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
    mcp: {
      name: 'elevenlabs',
      config: { url: 'https://api.elevenlabs.io/v1/mcp' },
    },
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
    mcp: {
      name: 'render',
      config: {
        url: 'https://mcp.render.com/mcp',
        auth: { CLIENT_ID: 'cursor' },
      },
    },
  },
  {
    id: 'exa',
    name: 'Exa',
    logo: '/images/partners/exa.png',
    url: 'https://exa.ai/',
    docsUrl: 'https://exa.ai/docs',
    logoBg: '#ffffff',
    logoHeight: 'h-8',
    sdlcStage: 'search',
    oneLiner: 'Neural web search so the agent finds sources — not just a URL you already have.',
    technologies: [
      'Search — query the live web for pages, people, companies, and code',
      'Contents — pull token-efficient excerpts from result URLs',
      'Research / agent — multi-step search with citations',
      'API + MCP — hosted server at mcp.exa.ai',
    ],
    useCases: [
      'Research agent that searches, then cites the pages it used',
      'Find docs or repos the model does not already know',
      'Company or people lookup for a GTM or lead demo',
      'Ground a Convex answer in live sources',
    ],
    perks: [
      { kind: 'confirmed', label: '$50 credits for every participant' },
    ],
    mcp: {
      name: 'exa',
      config: { url: 'https://mcp.exa.ai/mcp' },
    },
  },
  {
    id: 'wispr',
    name: 'Wispr Flow',
    logo: '/images/partners/wispr-flow.svg',
    url: 'https://wisprflow.ai/',
    docsUrl: 'https://docs.wisprflow.ai/articles/6434410694-use-flow-with-cursor-vs-code-and-other-ides',
    logoBg: '#14120b',
    logoHeight: 'h-7',
    sdlcStage: 'dictate',
    oneLiner: 'Dictate into Cursor — speech becomes clean text in the editor and chat.',
    technologies: [
      'Desktop + mobile dictation — Mac, Windows, iPhone, Android',
      'Cleans filler words and formats as you speak',
      'Works in Cursor chat, the editor, and the terminal',
      'File tagging by voice in Cursor chat (say “at main.ts”)',
    ],
    useCases: [
      'Talk the prompt instead of typing a long agent brief',
      'Dictate comments, README, or demo script',
      'Hands-busy coding: speak the next instruction',
    ],
    perks: [
      { kind: 'confirmed', label: '3 months of Pro for every participant' },
    ],
  },
  {
    id: 'fal',
    name: 'Fal.ai',
    logo: '/images/partners/fal.svg',
    url: 'https://fal.ai/',
    docsUrl: 'https://fal.ai/docs/documentation',
    logoBg: '#14120b',
    logoHeight: 'h-8',
    sdlcStage: 'generate',
    oneLiner: 'Run image, video, and audio models through one API so the demo can generate media.',
    technologies: [
      '1,000+ models — image, video, audio, 3D, upscaling',
      'One API / queue for generation jobs',
      'MCP — hosted at mcp.fal.ai (add your fal API key after install)',
    ],
    useCases: [
      'Generate a product image or poster in the demo',
      'Video or audio clip as the punchline of the pitch',
      'Image edit / upscale a user upload',
      'Let Cursor call fal instead of you wiring SDKs by hand',
    ],
    perks: [
      { kind: 'confirmed', label: '$50 credits for every participant' },
    ],
    mcp: {
      name: 'fal-ai',
      config: { url: 'https://mcp.fal.ai/mcp' },
      note: 'After install, add your fal API key in Cursor MCP settings (Authorization: Bearer FAL_KEY).',
    },
  },
  {
    id: 'netlify',
    name: 'Netlify',
    logo: '/images/partners/netlify.svg',
    url: 'https://www.netlify.com/',
    docsUrl: 'https://docs.netlify.com/welcome/build-with-ai/netlify-mcp-server/',
    logoBg: '#ffffff',
    logoHeight: 'h-8',
    sdlcStage: 'ship',
    oneLiner: 'Deploy a public site from Git — previews, forms, and a URL judges can open.',
    technologies: [
      'Sites from Git — Next, static, and serverless functions',
      'Deploy previews on every pull request',
      'Forms, redirects, and edge functions',
      'MCP — npx @netlify/mcp after netlify login',
    ],
    useCases: [
      'Put the frontend on a public HTTPS URL so judges skip localhost',
      'Preview each teammate’s branch without a shared server',
      'Static landing plus functions next to Convex or Daytona',
      'Ask Cursor to create and deploy the Netlify site',
    ],
    perks: [
      { kind: 'confirmed', label: '3,000 credits for every participant' },
    ],
    mcp: {
      name: 'netlify',
      config: { command: 'npx -y @netlify/mcp' },
      note: 'Install Node 22+ and run netlify login first.',
    },
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
  {
    title: 'Search and generate',
    summary: 'Exa finds sources, fal generates the media, Convex stores the thread.',
    sponsorIds: ['exa', 'fal', 'convex'],
  },
]

export const hackathonStackPicks: HackathonStackPick[] = [
  { need: 'Live website content inside the app', use: 'Firecrawl' },
  { need: 'The agent to find sources it does not already have', use: 'Exa' },
  { need: 'The agent to run code, tests, or a shell', use: 'Daytona' },
  { need: 'Users, rows, and instant UI updates', use: 'Convex' },
  { need: 'The demo to talk or listen', use: 'ElevenLabs' },
  { need: 'To dictate into Cursor instead of typing', use: 'Wispr Flow' },
  { need: 'Generated images, video, or audio', use: 'Fal.ai' },
  { need: 'A public HTTPS URL or extra Postgres', use: 'Render' },
  { need: 'A public frontend with deploy previews', use: 'Netlify' },
]

export const hackathonStackOverlap = [
  'Convex can be the whole backend. Render and Netlify are public demo URLs and conventional hosting.',
  'Daytona is not production hosting — it is an isolated runtime for agent or untrusted code.',
  'Firecrawl scrapes a URL you already have. Exa searches the web for sources you do not.',
  'ElevenLabs is speech in the product. Wispr Flow is how you dictate into Cursor.',
  'Fal.ai generates media. It is not search and not hosting.',
]

export function getSponsorProfile(id: string): HackathonSponsorProfile | undefined {
  return hackathonSponsorProfiles.find((profile) => profile.id === id)
}

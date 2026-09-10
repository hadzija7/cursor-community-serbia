import {
  HackathonGuideAgendaItem,
  HackathonGuideCopy,
  HackathonGuideListItem,
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
  title: 'Grok Bot Serbia Hackathon',
  tagline: 'Build the future with AI — one full day of hacking, learning, and community.',
  mascotImage: '/grokbot.svg',
  mascotPeekImage: '/bloub-cercle-neutre-encre-anime.svg',
  headerMark: '/grokbot.svg',
  ogImage: '/images/og-grok-bot-hackathon.jpg',
  // Static fallback when Luma is unreachable. Live date/location come from
  // `hackathonConfig.lumaUrl` via `/api/hackathon/event` (see lib/hackathon-details.ts).
  date: '2026-09-12',
  displayDate: 'September 12, 2026',
  location: 'Belgrade, Serbia',
  duration: '1 full day',
  lumaUrl: 'https://luma.com/ghvnbjlx',
}

export const hackathonStats = [
  { value: '1 day', label: 'Build sprint with Grok Bot', accent: 'orange' as const },
  { value: 'Mentors', label: 'Guidance from hosts and mentors', accent: 'green' as const },
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
  {
    sponsor: 'ABC BootCamps',
    sponsorLogo: '/images/partners/abc-bootcamps.png',
    sponsorUrl: 'https://abcbootcamps.com/',
    logoBg: '#ffffff',
    logoHeight: 'h-10',
    category: 'Scholarships to ABC Silicon Valley 2027',
    note: 'Percentages apply to ABC Silicon Valley 2027 tuition. Winners claim through ABC BootCamps after the event.',
    places: [
      { place: '1st place', amount: '50% scholarship', accent: 'orange' },
      { place: '2nd place', amount: '40% scholarship', accent: 'yellow' },
      { place: '3rd place', amount: '30% scholarship', accent: 'purple' },
    ],
  },
]

/** Short purpose line for `/hackathon/guide`. */
export const hackathonGuidePurpose: HackathonGuideCopy = {
  title: 'Why we run this',
  body: 'A one-day sprint to ship something real with Grok Bot and the tech partner tools. Cursor works too — not a polished startup, a working demo the same day.',
}

/** Eligibility rules for `/hackathon/guide` — replaces the old Team one-liner. */
export const hackathonGuideRulesIntro: HackathonGuideCopy = {
  title: 'Rules',
  body: 'Eligibility for the day. Keep the team small, ship in the open, and show a live demo plus a short video.',
}

export const hackathonGuideRules: HackathonGuideListItem[] = [
  {
    id: 'team-size',
    title: 'Team size',
    body: '1–3 people per project — solo or a small team, small enough to ship in a day.',
  },
  {
    id: 'open-source',
    title: 'Open source',
    body: 'The repository must be public / open source.',
  },
  {
    id: 'what-counts',
    title: 'What counts',
    body: 'You may start from a pre-existing project, but only what you build during the hackathon is judged — demo the new work.',
  },
  {
    id: 'live-demo',
    title: 'Live demo',
    body: 'A deployed version of the app is required — a public live URL.',
  },
  {
    id: 'video-demo',
    title: 'Video demo',
    body: 'A short video demo showing the product is required.',
  },
]

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
    title: 'Build in Grok Bot',
    body: 'The host editor for this hackathon. Agents, rules, and MCPs live here — Cursor works too.',
  },
  {
    id: 'mcps',
    title: 'Use partner MCPs',
    body: 'Wire the tools in Grok Bot (or Cursor). Do not rebuild what tech partners already give you.',
  },
  {
    id: 'repo',
    title: 'Host the repo publicly',
    body: 'Put the project somewhere public — GitHub, Origin, or another platform — so the team and judges can find it.',
  },
  {
    id: 'deploy',
    title: 'Deploy a live demo',
    body: 'Ship a deployed app with a public URL. Judges need a live link, not localhost.',
  },
  {
    id: 'demo',
    title: 'Build a 3-minute demo',
    body: 'One problem, one happy path, one short story. That is what judges watch.',
  },
  {
    id: 'submit',
    title: 'Submit through the form',
    body: 'Open the submission form when you are checked in. Deadline is 7 PM — you can update your entry earlier the same day.',
    href: '/hackathon/submit',
    cta: 'Open submit form',
  },
]

/** Day-of schedule for `/hackathon/guide`. */
export const hackathonGuideAgenda: HackathonGuideAgendaItem[] = [
  {
    id: 'intro',
    time: '10:30',
    title: 'Intro & welcome',
    body: 'Opening presentation about the hackathon — what to expect and how the day runs.',
  },
  {
    id: 'hacking',
    time: '11:00',
    title: 'Hacking',
    body: 'Hacking starts at 11:00. Network, build, and exchange ideas. Optional workshops run during the day — drop in if you want. Relaxed atmosphere — no pressure, just ship.',
  },
  {
    id: 'demo',
    time: '17:00 – 19:00',
    title: 'Demo showcase',
    body: 'Optional. Share what you are building with others if you want — not mandatory.',
  },
  {
    id: 'deadline',
    time: '19:00',
    title: 'Submission deadline',
    body: 'Hacking ends. Submit your project through the form by 7 PM.',
  },
  {
    id: 'voting',
    time: '19:00 – 19:30',
    title: 'Community voting',
    body: 'Cast your vote for favorite projects while demos wrap and pizza gets ready.',
  },
  {
    id: 'pizza',
    time: '19:30 – 21:00',
    title: 'Pizza party',
    body: 'Food, drinks, and wind-down through the end of the night. Doors close at 9 PM.',
  },
]

/** Judging window — results after the live day. */
export const hackathonGuideJudging: HackathonGuideCopy = {
  title: 'Judging & winners',
  body: 'Judging happens after the event. Winners are announced on 19 September — about one week later. Innovation comes first.',
}

/** Judging criteria — innovation-first, listed under the winners announcement. */
export const hackathonGuideJudgingCriteria: HackathonGuideListItem[] = [
  {
    id: 'innovation',
    title: 'Innovation (primary)',
    body: 'Originality of the idea and creative use of agents / partner tools.',
  },
  {
    id: 'working-product',
    title: 'Working product',
    body: 'Live URL + video that clearly show what was built.',
  },
  {
    id: 'clarity',
    title: 'Problem & solution clarity',
    body: 'Judges understand the story quickly.',
  },
  {
    id: 'execution',
    title: 'Execution',
    body: 'Quality of the happy path shipped during the event.',
  },
  {
    id: 'impact',
    title: 'Impact potential',
    body: 'Useful beyond the weekend.',
  },
]

/**
 * Optional idea verticals. Build anything is allowed — these are sparks if you need them.
 */
export const hackathonGuideTopicsIntro: HackathonGuideCopy = {
  title: 'Idea sparks',
  body: 'You can build whatever you want. These three verticals are optional suggestions if you do not already have an idea — not required tracks.',
}

export const hackathonGuideTopics: HackathonGuideTopic[] = [
  {
    id: 'fintech',
    title: 'FinTech agents',
    summary:
      'Autonomous agents that execute payments and transactions for you — on blockchain or traditional financial rails.',
  },
  {
    id: 'gaming-art',
    title: 'Gaming, visual & art',
    summary: 'AI that helps create, play, or experience games, visuals, and art.',
  },
  {
    id: 'personal-assistant',
    title: 'Personal assistant',
    summary:
      'A helpful assistant with strong UX — look up flights, plan your day, and talk by voice.',
  },
]

/** Mentors — first listed is featured first on `/hackathon/mentors`. */
export const hackathonMentors: HackathonPerson[] = [
  {
    id: 'nick-tomic',
    name: 'Nick Tomić',
    title: 'CTO and builder',
    photo: '/images/hackathon/nick-tomic.jpg',
    photoPosition: 'center',
    bio: 'Nick Tomić is a SaaS founder and growth consultant who specializes in helping tech startups build and launch AI products.',
    help: 'Go-to-market — positioning, story, and how to talk about what you shipped.',
    links: {
      x: 'https://x.com/dropoutsanta',
      linkedin: 'https://www.linkedin.com/in/nicktomic/',
    },
  },
  {
    id: 'miodrag-vilotijevic',
    name: 'Miodrag Vilotijević',
    title: 'Co-founder and CEO, JigJoy',
    photo: '/images/hackathon/miodrag-vilotijevic.jpg',
    photoPosition: 'top',
    bio: 'Co-founder and CEO of JigJoy and creator of Mozaik, an open-source runtime for AI agents.',
    help: 'code quality, startup insights, and product positioning.',
    links: {
      x: 'https://x.com/Mijuraaa',
      linkedin: 'https://www.linkedin.com/in/miodrag-vilotijevic/',
    },
  },
  {
    id: 'miodrag-todorovic',
    name: 'Miodrag Todorović',
    title: 'Co-founder, JigJoy',
    photo: '/images/hackathon/miodrag-todorovic.jpg',
    photoPosition: 'center',
    bio: 'I build tools for running AI agents in production: Mozaik Cloud, baro, and the agent workflows we use at JigJoy.',
    help: 'Multi-agent architectures, Grok Bot, shipping a working demo in a weekend.',
    links: {
      x: 'https://x.com/lotus_sbc',
      linkedin: 'https://www.linkedin.com/in/lotus015',
    },
  },
  {
    id: 'alexandra-borisova',
    name: 'Alexandra Borisova',
    title: 'SRE & Infra Leader',
    photo: '/images/hackathon/alexandra-borisova.jpg',
    photoPosition: 'center',
    bio: 'DevOps/SRE at Typeable — AWS, Kubernetes, and observability. Also explores agentic harnesses on AWS and Kubernetes.',
    help: 'SRE & platform engineering, AWS/Kubernetes, observability, IaC and CI/CD.',
    links: {
      linkedin: 'https://www.linkedin.com/in/princessfruittt/',
    },
  },
  {
    id: 'dusan-radivojevic',
    name: 'Dušan Radivojević',
    title: 'Head of AI & Platform, Wonder',
    photo: '/images/hackathon/dusan-radivojevic.jpg',
    photoPosition: 'center',
    bio: 'Bridging the gap between design and code by building an AI-native design platform where design is equal to code and creativity is increased.',
    help: 'design and AI.',
    links: {
      x: 'https://x.com/radivojevic_1',
      linkedin: 'https://www.linkedin.com/in/dusan-g-radivojevic',
    },
  },
]

/** Day-of hosts — ambassador photos/socials match the homepage; additional hosts use `public/images/hackathon/`. */
export const hackathonHosts: HackathonPerson[] = [
  {
    id: 'aleksandar-hadzibabic',
    name: 'Aleksandar Hadžibabić',
    title: 'Community Lead for Novi Sad',
    photo: '/images/ambassadors/aleks-cursor.jpg',
    photoPosition: 'top',
    bio: 'SpaceXAI ambassadors and one of the hosts running the room.',
    help: 'Whatever you need, we are here to help.',
    links: {
      x: 'https://x.com/AHadzibabic',
      linkedin: 'https://www.linkedin.com/in/ah999/',
    },
  },
  {
    id: 'goran-petkovic',
    name: 'Goran Petković',
    title: 'Community Lead for Belgrade',
    photo: '/images/ambassadors/goran.png',
    bio: 'SpaceXAI ambassadors and one of the hosts running the room.',
    help: 'Whatever you need, we are here to help.',
    links: {
      x: 'https://x.com/goranux',
      linkedin: 'https://www.linkedin.com/in/petkovicg/',
    },
  },
  {
    id: 'vladimir-hristov',
    name: 'Vladimir Hristov',
    title: 'Embedded Software Engineer',
    photo: '/images/hackathon/vladimir-hristov.jpg',
    photoPosition: 'top',
    bio: 'Embedded Software Engineer transitioning into AI. Building tools for processing technical documentation.',
    help: 'Whatever you need, we are here to help.',
    links: {
      linkedin: 'https://www.linkedin.com/in/vladimir-hristov-6645011a3/',
    },
  },
]

/** Judges — published as they lock. */
export const hackathonJudges: HackathonPerson[] = [
  {
    id: 'ben-kim',
    name: 'Ben Kim',
    title: 'Founder, investor & community builder',
    photo: '/images/hackathon/ben-kim.jpg',
    photoPosition: 'center',
    bio: 'Founder, investor, community builder, and developer who comes from Silicon Valley but now lives in Mexico City. Codex and SpaceX ambassador.',
    links: {
      x: 'https://x.com/benkimbuilds',
      linkedin: 'https://www.linkedin.com/in/benkimbuilds/',
    },
  },
  {
    id: 'milan-lazarevic',
    name: 'Milan Lazarević',
    title: 'Software engineer & ML specialist',
    photo: '/images/hackathon/milan-lazarevic.jpg',
    photoPosition: 'center',
    bio: 'Software engineer with 7+ years in ML — computer vision, edge AI, LLMs, agents, and RAG. Focused on optimized inference and real-time, context-aware apps.',
    links: {
      x: 'https://x.com/MrLaki5',
      linkedin: 'https://www.linkedin.com/in/mrlaki5/',
    },
  },
  {
    id: 'agrim-singh',
    name: 'Agrim Singh',
    title: 'AI adoption, SpaceXAI',
    photo: '/images/hackathon/agrim-singh.jpg',
    photoPosition: 'center',
    bio: 'Leads AI adoption at SpaceXAI and the regional community for SEA/Singapore. Teaches at Code with AI and runs 65 Labs. Whisky guru and DJ.',
    links: {
      x: 'https://x.com/agrimsingh',
      linkedin: 'https://www.linkedin.com/in/agrims/',
    },
  },
  {
    id: 'marija-mladenovic',
    name: 'Marija Mladenović',
    title: 'Lead product designer & angel investor',
    photo: '/images/hackathon/marija-mladenovic.jpg',
    photoPosition: 'top',
    bio: 'Fifteen years in product and design across fintech, crypto, gaming and AI. Led design and product on two live games, and now works at Solflare on trading and privacy. Former startup founder with a data science and machine learning background.',
    links: {
      x: 'https://x.com/MarijaHolt',
      linkedin: 'https://www.linkedin.com/in/marijamladenovic/',
    },
  },
]

/** Tech partners (tools for hackers) — edit logos in `public/images/partners/` or add new entries. */
export const hackathonSponsors: Partner[] = [
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
    name: 'Fal.ai',
    logo: '/images/partners/fal.svg',
    url: 'https://fal.ai/',
    logoBg: '#14120b',
    logoHeight: 'h-8',
  },
  {
    name: 'Wonder',
    logo: '/images/partners/wonder.png',
    url: 'https://wonder.design/',
    logoBg: '#14120b',
    logoHeight: 'h-7',
    logoWidth: 'w-32',
  },
  {
    name: 'x.ai',
    logo: '/images/partners/spacexai.svg',
    url: 'https://x.ai/',
    logoBg: '#ffffff',
    logoHeight: 'h-7',
    logoWidth: 'w-28',
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
    id: 'editor',
    label: 'Editor / host',
    job: 'Build the project in Grok Bot',
    sponsorId: 'cursor',
    accent: 'orange',
  },
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
    id: 'design',
    label: 'Design / UI',
    job: 'Design the interface as shippable React',
    sponsorId: 'wonder',
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
    id: 'dictate',
    label: 'Voice input',
    job: 'Dictate into Grok Bot instead of typing',
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
    id: 'models',
    label: 'API / models',
    job: 'Call SpaceXAI / x.ai Voice, Chat, Imagine, Grok Build',
    sponsorId: 'xai',
    accent: 'green',
  },
  {
    id: 'deploy',
    label: 'Host / infra',
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
      { kind: 'confirmed', label: '10,000 credits for every participant' },
      { kind: 'public', label: 'Start here: 1,000 free credits / month', detail: 'Public free tier (keyless or after signup), not a hackathon gift.' },
    ],
    mcp: {
      name: 'firecrawl',
      config: { url: 'https://mcp.firecrawl.dev/v2/mcp' },
    },
  },
  {
    id: 'cursor',
    name: 'Grok Bot',
    logo: '/grokbot.svg',
    url: 'https://cursor.com',
    docsUrl: 'https://cursor.com/docs',
    logoBg: '#14120b',
    logoHeight: 'h-10',
    sdlcStage: 'editor',
    oneLiner:
      'The host editor for this hackathon — build with Grok Bot (Cursor works too). Claim both $20 and $50 Cursor credit referrals when you check in.',
    technologies: [
      'Agentic coding in the editor and chat',
      'MCP servers for partner tools',
      'Inline edits, terminal, and multi-file refactors',
      'Grok Bot Serbia Hackathon — build and ship the same day',
    ],
    useCases: [
      'Ship the demo end-to-end in one day',
      'Wire partner MCPs without leaving the editor',
      'Pair with teammates on the same repo',
    ],
    perks: [
      {
        kind: 'confirmed',
        label: '$20 Cursor credits for every checked-in participant',
        detail: 'Unique referral from the $20 pool — claim once, copy, and redeem. First come, first served.',
      },
      {
        kind: 'confirmed',
        label: '$50 Cursor credits for every checked-in participant',
        detail: 'Separate $50 Cursor pool — claim both. First come, first served.',
      },
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
      {
        kind: 'confirmed',
        label: '$100 credits for every participant',
        detail:
          'Claim your coupon on the Stack page after check-in. Redeem at app.daytona.io → Billing → paste code → Redeem.',
      },
      {
        kind: 'confirmed',
        label: 'Winners: $3,000 / $2,000 / $1,000 credits',
        detail: 'Best app that uses Daytona. Winner redemption is announced on the day.',
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
      { kind: 'public', label: 'Start here: free for small teams', detail: 'Public Convex tier, not a published event credit.' },
    ],
    mcp: {
      name: 'convex',
      config: { command: 'npx -y convex@latest mcp start' },
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
      {
        kind: 'confirmed',
        label: 'Promo credits for every checked-in participant',
        detail:
          'Claim on the Stack page after check-in. Redeem at dashboard.render.com → Billing → Credit Balance → Enter promo code → Apply.',
      },
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
    oneLiner: 'Dictate into Grok Bot — speech becomes clean text in the editor and chat.',
    technologies: [
      'Desktop + mobile dictation — Mac, Windows, iPhone, Android',
      'Cleans filler words and formats as you speak',
      'Works in Grok Bot / Cursor chat, the editor, and the terminal',
      'File tagging by voice in chat (say “at main.ts”)',
    ],
    useCases: [
      'Talk the prompt instead of typing a long agent brief',
      'Dictate comments, README, or demo script',
      'Hands-busy coding: speak the next instruction',
    ],
    perks: [
      {
        kind: 'confirmed',
        label: '3 months of Pro for every participant',
        detail: 'Claim on the Stack page after check-in.',
      },
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
    id: 'wonder',
    name: 'Wonder',
    logo: '/images/partners/wonder.png',
    url: 'https://wonder.design/',
    docsUrl: 'https://wonder.design/docs/mcp',
    logoBg: '#14120b',
    logoHeight: 'h-7',
    sdlcStage: 'design',
    oneLiner: 'Design on a canvas that is already production React + Tailwind — not a handoff mockup.',
    technologies: [
      'Canvas, layers, and components that map 1:1 to code',
      'AI chat to generate and iterate the design',
      'Export production-ready React + Tailwind (or CSS)',
      'MCP — hosted at mcp.wonder.so so Cursor stays in sync with the canvas',
    ],
    useCases: [
      'Design the demo UI in Wonder, then ship the React it already is',
      'Iterate a landing or product screen with AI on the canvas',
      'Ask Cursor to pull or push design changes over MCP',
      'Skip Figma-to-code translation on a one-day sprint',
    ],
    perks: [
      { kind: 'confirmed', label: 'Pro plan for every participant' },
    ],
    mcp: {
      name: 'wonder',
      config: { url: 'https://mcp.wonder.so/mcp' },
      note: 'After install, authenticate Wonder in Cursor MCP settings (browser sign-in).',
    },
  },
  {
    id: 'xai',
    name: 'x.ai',
    logo: '/images/partners/spacexai.svg',
    url: 'https://x.ai/',
    docsUrl: 'https://docs.x.ai/developers/model-capabilities/audio/voice',
    logoBg: '#ffffff',
    logoHeight: 'h-7',
    sdlcStage: 'models',
    oneLiner:
      'SpaceXAI / x.ai API — Voice, Chat, Imagine, and Grok Build via a Console API key (not Grok Bot).',
    technologies: [
      'Voice API — realtime audio agents (docs.x.ai voice capabilities)',
      'Chat / Imagine / Grok Build — models through the Console API',
      'Console API key — wire into your app backend or agent',
      'Voice landing — https://x.ai/voice',
    ],
    useCases: [
      'Voice agent demo that talks over the x.ai Voice API',
      'Chat completion or multimodal Imagine calls from your backend',
      'Grok Build workflows driven by a Console key',
      'Anything that needs x.ai models outside Grok Bot',
    ],
    perks: [
      {
        kind: 'confirmed',
        label: '~$35 API credits per Console team',
        detail:
          'Claim on the Stack page after check-in. Redeem at console.x.ai → Billing → Redeem promo code. Valid Saturday 12 Sep 2026 (Belgrade time). 160 total redemptions, one per team. Works for Voice / Chat / Imagine / Grok Build via Console API key — does not work for Grok Bot.',
      },
    ],
  },
]

export const hackathonStackRecipes: HackathonStackRecipe[] = [
  {
    title: 'Web research agent',
    summary: 'Scrape live pages with Firecrawl, store answers in Convex, keep the UI live.',
    sponsorIds: ['firecrawl', 'convex'],
  },
  {
    title: 'Coding agent',
    summary: 'Write code in Grok Bot, run it in a Daytona sandbox, keep runs and logs in Convex.',
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
  {
    title: 'Designed UI, live app',
    summary: 'Design the screen in Wonder, keep state in Convex, host the public URL on Render.',
    sponsorIds: ['wonder', 'convex', 'render'],
  },
]

export const hackathonStackPicks: HackathonStackPick[] = [
  { need: 'An AI editor to build the whole demo', use: 'Grok Bot' },
  { need: 'Live website content inside the app', use: 'Firecrawl' },
  { need: 'The agent to find sources it does not already have', use: 'Exa' },
  { need: 'The agent to run code, tests, or a shell', use: 'Daytona' },
  { need: 'Users, rows, and instant UI updates', use: 'Convex' },
  { need: 'To dictate into Grok Bot instead of typing', use: 'Wispr Flow' },
  { need: 'Generated images, video, or audio', use: 'Fal.ai' },
  { need: 'x.ai Voice / Chat / Imagine / Grok Build via API key', use: 'x.ai' },
  { need: 'A designed UI that is already React + Tailwind', use: 'Wonder' },
  { need: 'A public HTTPS URL or extra Postgres', use: 'Render' },
]

export const hackathonStackOverlap = [
  'Convex can be the whole backend. Render is a public demo URL and conventional hosting.',
  'Daytona is not production hosting — it is an isolated runtime for agent or untrusted code.',
  'Firecrawl scrapes a URL you already have. Exa searches the web for sources you do not.',
  'Wispr Flow is how you dictate into Grok Bot (or Cursor) — voice input for building, not TTS in the product.',
  'x.ai API credits power Voice / Chat / Imagine / Grok Build via a Console key — they do not apply to Grok Bot.',
  'Fal.ai generates media. It is not search and not hosting.',
  'Wonder is the design canvas that ships as React. Fal.ai generates media. They are not the same job.',
]

export function getSponsorProfile(id: string): HackathonSponsorProfile | undefined {
  return hackathonSponsorProfiles.find((profile) => profile.id === id)
}

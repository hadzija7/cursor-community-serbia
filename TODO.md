# Cursor Community Serbia — Task Plan

## Phase 1: Foundation (Current)
- [x] Scaffold agent-friendly structure (AGENTS.md, docs, specs, rules)
- [ ] Verify all specs reflect current implementation
- [x] Add/expand unit tests for subscribe API (mailing list + Luma)
- [ ] Add/expand unit tests for education config

## Phase 2: Content & Polish
- [x] Site Open Graph / LinkedIn share image: Cursor Serbia logo (`public/images/og-cursor-serbia.jpg` via root + hackathon metadata)
- [x] Homepage hero bento: Cannes event photo via Google Drive (`content/header-photos.ts`, Drive id `1yDEyEWC-1WACUkMkRIY_Y5EpkJh0Xkkd`)
- [x] Past Events homepage section: full-bleed band, content 80vw centered, responsive grid (3 columns on large screens)
- [x] Shared orange `SectionEyebrow` for homepage + education section headers (Past Events, Hosting Partners, Featured match Ambassadors / Upcoming)
- [x] Coworking day slide deck (`/education/coworking-day`, 8 slides: brainstorming + Obsidian/Cursor PKM)
- [x] Live Luma upcoming-events sync with static fallback (`/api/events/upcoming`, `lib/luma.ts`)
- [x] Split Luma calendars: Belgrade + Novi Sad API keys (`LUMA_BELGRADE_API_KEY`, `LUMA_NOVI_SAD_API_KEY`); subscriber import to both
- [x] Recap photo gallery: keyboard arrows in fullscreen lightbox (`PhotoGallery`)
- [x] Add Cursor Meetup Novi Sad past event recap (Mar 17, 2026)
- [x] Add Cursor Coworking Niš recap (Mar 20, 2026) with presentation video + interviews
- [x] Add Cafe Cursor Cannes recap (Apr 2, 2026); Luma https://luma.com/hswzhn5m
- [x] Add Cursor Belgrade Hub201 recap (Apr 7, 2026); Luma https://luma.com/yvpg9ijv
- [x] Add Cursor Meetup Novi Sad Dec 23, 2025 recap; Luma https://luma.com/udbedo7b
- [x] Add Cursor Coworking Day Belgrade recap (May 15, 2026); Luma https://luma.com/9tlvu6ij
- [x] Add Cursor Meetup Novi Sad May 26, 2026 recap (Memclaw); Luma https://luma.com/jn59jzyp
- [x] Add Cafe Cursor Belgrade Summer Edition recap (Jun 28, 2026); Luma https://luma.com/cursor-belgrade
- [x] Add Cursor Meetup Novi Sad Aug 20, 2026 recap (Creative Space 75); Luma https://luma.com/kd163iko
- [x] Add Cafe Cursor Belgrade August recap (Aug 22, 2026); Luma https://luma.com/cursor-belgrade-august
- [x] Hackathon landing page (`/hackathon`): sponsor marquee, sponsorship form, API route; hero + highlights layout (TUM-inspired, orange accent)
- [x] Hackathon content: Belgrade, September 12, 2026; Luma `https://luma.com/ghvnbjlx`, CTA "Sponsor event"
- [x] Hackathon rebrand: Grok Bot Serbia Hackathon; Grok Bot mascot next to the title on homepage promo + Overview hero (`/images/hackathon/grok-bot.png`)
- [x] Hackathon share metadata: OG/Twitter image is Grok Bot poster (`/images/og-grok-bot-hackathon.jpg`) instead of community Cursor thumbnail
- [x] Hackathon date/location synced from Luma event page (`/api/hackathon/event`, static fallback)
  - [x] Hackathon sponsorship → Google Sheets via Apps Script webhook template (`scripts/hackathon-sponsor-google-sheet.gs`)
  - [x] Hackathon sponsors: added Convex to marquee
  - [x] Hackathon prizes section above sponsors (Convex: Best app that uses Convex — 1st/2nd RSD)
  - [x] Hackathon prizes: Kosmonaut coworking for top 3 teams (15 / 10 / 5 entries, use within 3 months, claim on kosmonaut.rs)
  - [x] Hackathon sponsors: added Daytona; removed Cursor (host, not sponsor)
  - [x] Hackathon sponsor stack preview (`/hackathon/stack`): grouped cards, path, read-more
  - [x] Hackathon tabbed mini-site (Overview / Guide / Mentors / Prizes / Stack) + `hackathon.*` host rewrite
  - [x] Hackathon Mentors tab (`/hackathon/mentors`): Hosts first (Aleksandar + Goran), then Mentors (Nick with X + LinkedIn), then judges; 2-col cards from `md`
  - [x] Hackathon prizes: added Daytona credit track ($3,000 / $2,000 / $1,000 + $100 each)
  - [x] Hackathon prizes: ABC BootCamps scholarships (50% / 40% / 30% to ABC Silicon Valley 2027)
  - [x] Daytona participant coupon: `CREDIT_CODE_DAYTONA` + claim UI redeem tip (Billing Dashboard)
  - [x] Hackathon Guide tab (`/hackathon/guide`): why, team, numbered timeline, topics
  - [x] Hackathon Stack: Add to Cursor MCP install on each sponsor modal
  - [x] Hackathon Stack: Add to Cursor uses `cursor://` deeplink (not the auto-closing install-mcp tab)
  - [x] Hacker Google auth + Luma check-in status; claim shared env codes + unique Cursor referral pool
  - [x] Hackathon Overview: community partners band (Startit, Superteam Balkan) below sponsors
  - [x] Hackathon: tech companies labeled Tech partners (vs Community partners); Become a sponsor unchanged
  - [x] Hackathon Overview: community partners use the same scrolling marquee as tech partners
  - [x] Hackathon community partners: added ABC BootCamps, JigJoy, Kosmonaut
  - [x] Superteam Balkan logo: transparent PNG (no black JPEG frame), sized a step above Startit (`h-10`)
  - [x] Hackathon tech partners + Stack: Wispr Flow, Exa, Netlify, Fal.ai (confirmed credits)
  - [x] Hackathon tech partners + Stack: Wonder (Design / UI; Pro for all participants)
  - [x] Exa logo: official icon + “exa” wordmark on a white pad
  - [x] ABC BootCamps logo: official overlapping ABC + BOOTCAMP mark on white pad (`h-10`)
  - [x] Hackathon header brand is Grok Bot Serbia Hackathon (mascot + title); marketing copy prioritizes Grok Bot
  - [x] Hackathon Overview hero: Grok Bot peek is in-flow and compact on mobile (no text overlap)
  - [x] Hackathon Overview hero: Grok Bot uses muted looping MP4 (`mascotPeekVideo`) with static PNG poster + `prefers-reduced-motion` fallback
  - [x] Hackathon sponsor form lives on Overview (`#become-a-sponsor`); `/hackathon/sponsor` redirects there; no Sponsor tab
  - [x] Hero "Sponsor event" always scrolls to Overview `#become-a-sponsor` (same-page hash + `scroll-mt-24`)
  - [ ] Review and update content (events, ambassadors, partners) for Serbia

- [ ] Ensure education resources are complete and linked correctly
- [ ] Verify i18n keys and add Serbian locale if needed

## Phase 3: Quality & Observability
- [ ] Improve test coverage per `specs/testing-strategy.md`
- [ ] Document deployment and env setup for contributors
- [ ] Add CI checks for build, lint, test

## Verification Checklist (before marking phase complete)
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] `specs/README.md` statuses updated
- [ ] `docs/quality.md` grades reflect reality

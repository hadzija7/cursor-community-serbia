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
- [x] Hackathon landing page (`/hackathon`): sponsor marquee, sponsorship form, API route; hero + highlights layout (TUM-inspired, orange accent)
- [x] Hackathon content: Belgrade, September 12, 2026; Luma `https://luma.com/ghvnbjlx`, CTA "Sponsor event"
- [x] Hackathon date/location synced from Luma event page (`/api/hackathon/event`, static fallback)
  - [x] Hackathon sponsorship → Google Sheets via Apps Script webhook template (`scripts/hackathon-sponsor-google-sheet.gs`)
  - [x] Hackathon sponsors: added Convex to marquee
  - [x] Hackathon prizes section above sponsors (Convex: Best app that uses Convex — 1st/2nd RSD)
  - [x] Hackathon sponsors: added Daytona; removed Cursor (host, not sponsor)
  - [x] Hackathon sponsor stack preview (`/hackathon/stack`): grouped cards, path, read-more
  - [x] Hackathon tabbed mini-site (Overview / Prizes / Stack) + `hackathon.*` host rewrite
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

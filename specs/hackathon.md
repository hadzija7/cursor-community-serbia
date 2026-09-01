# Hackathon Specification

## Overview

Hackathon mini-site with tabs (Overview, Guide, Mentors, Prizes, Stack). Served at `/hackathon` on the community host, and at the root of `hackathon.cursorserbia.com` when that subdomain is attached.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-09-01 |

## Page layout

Inspired by conference landing patterns (e.g. TUM Blockchain Conference): full-width hero with gradient orange glow, scannable fact cards (when / where / duration), stat-style highlight grid, and section eyebrow labels. Palette stays on Cursor black (`cursor-bg`), white (`cursor-text`), and orange (`cursor-accent-orange`).

## Architecture

### Routes

| Route | Purpose |
|-------|---------|
| `/hackathon` | Overview tab (hero, highlights, tech partners marquee, community partners, become-a-sponsor form) |
| `/hackathon/guide` | Guide tab: purpose, team size, shipping defaults, hacker guidelines; topics list is empty until tracks lock |
| `/hackathon/mentors` | Mentors and judges tab; judges stay empty until announced |
| `/hackathon/stack` | Stack tab: expertise group panels + card modal |
| `/hackathon/prizes` | Prizes tab |
| `/hackathon/sponsor` | Redirects to Overview `#become-a-sponsor` (bookmarks / `hackathon.*` `/sponsor` rewrite) |
| `/api/hackathon/event` | GET live date/location from Luma (static fallback) |
| `/api/hackathon/sponsor` | POST sponsorship applications |

On host `hackathon.*` (e.g. `hackathon.cursorserbia.com` or `hackathon.localhost`), `middleware.ts` rewrites `/` → `/hackathon`, `/stack` → `/hackathon/stack`, and so on. Community chrome is replaced by `HackathonSiteHeader` tabs.

When `NEXT_PUBLIC_HACKATHON_SITE_URL` is set, `/hackathon` on the main domain redirects to that host. Do not set the env until the Vercel domain is live.

### Key Components

- `app/hackathon/page.tsx` — Overview tab (hero, highlights, marquee, become-a-sponsor form)
- `app/hackathon/guide/page.tsx` — Guide tab
- `app/hackathon/mentors/page.tsx` — Mentors and judges tab
- `app/hackathon/stack/page.tsx` — Stack tab
- `app/hackathon/prizes/page.tsx` — Prizes tab
- `app/hackathon/sponsor/page.tsx` — Redirect to Overview `#become-a-sponsor`
- `app/hackathon/layout.tsx` — Route metadata + `HackathonSiteHeader`
- `components/HackathonSiteHeader.tsx` — Hackathon-only chrome and tabs (Overview / Guide / Mentors / Prizes / Stack)
- `components/HackathonGuide.tsx` — Purpose, team, shipping, guidelines, and extensible topics
- `components/HackathonPeople.tsx` — Mentor and judge cards (`/hackathon/mentors`)
- `middleware.ts` — Subdomain rewrite + optional main-host redirect
- `lib/hackathon-site.ts` — Host detection and public hrefs
- `components/HackathonHero.tsx` — Full-width hero with date/location/duration cards and CTAs; Grok Bot mascot peeks above the duration card
- `components/HackathonHighlights.tsx` — Stat-style highlight grid (TUM-inspired)
- `components/HackathonPrizes.tsx` — Prize tracks with per-place cards (above sponsors)
- `components/SponsorMarquee.tsx` — Tech partner and community partner marquees (Startit, Superteam Balkan, ABC BootCamps, JigJoy, Kosmonaut)
- `components/HackathonSponsorshipForm.tsx` — Sponsorship application form
- `components/HackathonSponsorStack.tsx` — Expertise group panels + compact card modal (`/hackathon/stack`)
- `content/hackathon.ts` — Static fallback copy, Luma URL, prize tracks, sponsor logos, stack profiles, stat cards
- `lib/hackathon-details.ts` — Resolve date/location from Luma slug with static fallback
- `lib/use-hackathon-details.ts` — Client hook polling `/api/hackathon/event`

### Sponsor Marquee

- Full-bleed horizontal band with duplicated sponsor list for seamless loop
- Constrained to page content width (`max-w-3xl`); rounded border container with edge fade masks
- `app/globals.css` `sponsor-marquee-track` animation (continuous left-to-right tunnel); respects `prefers-reduced-motion`
- Sponsor data uses existing `Partner` type from `lib/types.ts`

## Backends (sponsorship form)

### Postgres (recommended)

- Table: `hackathon_sponsor_applications` in `db/schema.sql`
- Env: `POSTGRES_URL` or `DATABASE_URL`

### Webhook

- Env: `HACKATHON_SPONSOR_WEBHOOK_URL` (optional dedicated endpoint)
- Falls back to `MAILING_LIST_WEBHOOK_URL` when dedicated URL is unset
- Payload: `{ companyName, contactName, email, website, message, source, community, submittedAt }`
- Optional auth: `HACKATHON_SPONSOR_API_KEY` or `MAILING_LIST_API_KEY` in `x-api-key` header

### Google Sheets (via Apps Script)

Recommended team inbox: keep the branded form, append rows to a Sheet with a Google Apps Script web app.

1. Create a Google Sheet; tab name `Applications` (or match `SHEET_NAME` in the script).
2. Optional header row: `submittedAt | companyName | contactName | email | website | message | source | community`
3. Paste [`scripts/hackathon-sponsor-google-sheet.gs`](../scripts/hackathon-sponsor-google-sheet.gs) into Extensions → Apps Script; set `SECRET`.
4. Deploy as Web app (Execute as: Me, Who has access: Anyone).
5. Set env: `HACKATHON_SPONSOR_WEBHOOK_URL=https://script.google.com/macros/s/.../exec?key=YOUR_SECRET`
6. Omit `HACKATHON_SPONSOR_API_KEY` for this path — Apps Script reads `?key=` instead of `x-api-key`.

Delivery uses `lib/post-webhook.ts` so Apps Script 302 redirects keep the POST body, and JSON `{ ok: false }` is treated as failure when Sheets is the only backend.

Postgres can stay configured; webhook notify runs after a successful insert (notify failures are logged, not surfaced). If the DB insert fails (e.g. missing table) and a webhook URL is set, the request falls through to the webhook so Sheets still receives the row. Create the table with `pnpm db:setup`.

## Content

Edit `content/hackathon.ts` for:

- Event title (`Grok Bot Serbia Hackathon`), tagline, `mascotImage` (promo), `mascotPeekImage` (Overview hero), duration, and **Luma URL** (source of truth for live sync)
- Static fallback `date` / `displayDate` / `location` (Belgrade, September 12, 2026 — used when Luma is unreachable)
- Highlights grid (`hackathonStats`)
- Prize tracks (`hackathonPrizes`: Convex cash 100.000 / 50.000 RSD; Kosmonaut coworking — 15 / 10 / 5 entries per teammate on the top 3 teams, use within 3 months, claimed on their platform; Daytona credits $3,000 / $2,000 / $1,000 plus $100 for every participant)
- Hacker guide (`hackathonGuidePurpose`, `hackathonGuideTeam`, `hackathonGuideSteps`, `hackathonGuideTopics`) — source for `/hackathon/guide`
- Mentors and judges (`hackathonMentors`, `hackathonJudges`) — source for `/hackathon/mentors`
- Tech partner logos (`hackathonSponsors`: ElevenLabs, Firecrawl, Render, Convex, Daytona, Wispr Flow, Exa, Netlify, Fal.ai, Wonder) — Overview heading is **Tech partners**
- Community partners (`hackathonCommunityPartners`: Startit, Superteam Balkan, ABC BootCamps, JigJoy, Kosmonaut) — Overview, below tech partners
- Superteam Balkan uses a transparent PNG wordmark (`/images/partners/superteam-balkan.png`) at `h-10` (a step above Startit’s `h-8`) so the old JPEG black frame does not show on the dark marquee. ABC uses the official overlapping ABC + BOOTCAMP mark (`abc-bootcamps.png`) on a white pad (`logoBg: '#ffffff'`) at `h-10` so the dark wordmark stays readable on the dark marquee
- Sponsor stack (`hackathonSdlcStages`, `hackathonSponsorProfiles` including `mcp`, recipes, picks) — source for `/hackathon/stack` and `docs/hackathon/sponsor-cheat-sheet.md`

### Sponsor stack tab

- Route: `/hackathon/stack` (Stack tab)
- Flat 2-column grid of sponsor cards (not a linear pipeline). Area label lives on the card (e.g. Host / infra, Voice / audio); details open in a modal
- Each modal has an **Add to Cursor** button (title row) that uses the official `cursor://anysphere.cursor-deeplink/mcp/install` deeplink (same tab — do not open `https://cursor.com/en/install-mcp`, which auto-closes). Configs live on `hackathonSponsorProfiles[].mcp` and are encoded by `lib/cursor-mcp-install.ts`
- Cursor is host, not a sponsor. Wispr Flow is a tech partner (dictation into Cursor); ElevenLabs stays product voice
- Confirmed perks only: Daytona $100 + winner credits (Best app that uses Daytona); Convex 100.000 / 50.000 RSD; Kosmonaut coworking for top 3 teams (15 / 10 / 5 entries per teammate, use within 3 months, claim on kosmonaut.rs); Wispr Flow 3 months Pro; Exa $50 credits each; Fal.ai $50 credits each; Netlify 3,000 credits for all participants; Wonder Pro for all participants
- Stack area cards also cover Exa (Search / web), Wonder (Design / UI), Wispr Flow (Voice input), Fal.ai (Generate / media), and Netlify (Host / frontend). Wispr has no public MCP install URL — desktop app only. Wonder MCP is `https://mcp.wonder.so/mcp` (OAuth after install)

### Guide tab

- Route: `/hackathon/guide` (Guide tab)
- Minimal briefing: why, team (solo or a team), numbered guidelines timeline, topics
- Timeline: Stack → mentors → Cursor → partner MCPs → Origin → 3-minute demo → submit form (plain text, no step links)
- Content-first: add theme rows to `hackathonGuideTopics` when tracks lock; do not invent topics
- Types: `HackathonGuideCopy` / `HackathonGuideStep` / `HackathonGuideTopic` in `lib/types.ts`

### Mentors and judges tab

- Route: `/hackathon/mentors` (Mentors tab)
- Two sections: mentors (published) and judges (empty until announced)
- First mentor: Nick Tomić — CTO and builder; SaaS / AI GTM bio; ask about GTM
- Photos in `public/images/hackathon/`
- Types: `HackathonPerson` in `lib/types.ts`

### Prizes section

- Rendered on the Prizes tab (`#prizes`)
- One track group per sponsoring prize category; place cards show place + amount only (sponsor name lives on the track header logo); optional `note` for track rules or participation perks
- Types: `HackathonPrizeTrack` / `HackathonPrizePlace` in `lib/types.ts`

### Live date & location from Luma

- `hackathonConfig.lumaUrl` (e.g. `https://luma.com/ghvnbjlx`) drives sync
- Server: `fetchLumaEventBySlug` reads the public Luma event page (no API key); `resolveHackathonDetails` merges date/location onto static copy
- Client: `useHackathonDetails` polls `/api/hackathon/event` every 5 minutes (same pattern as upcoming events)
- Title, tagline, mascot image, and duration stay content-owned so marketing copy does not flip with Luma’s event name
- Homepage promo card (`HackathonPromoCard`) shows `hackathonConfig.mascotImage` next to the title
- Overview hero peeks `hackathonConfig.mascotPeekImage` above the duration card; dark pixels are knocked out and `mix-blend-lighten` so it sits on the page background instead of a boxed image

Hero CTAs: Register (Luma) and Sponsor event (`hackathon.viewSponsorsCta`). Sponsor event always scrolls to Overview `#become-a-sponsor` — including a second click while already on Overview with that hash. Off Overview (Guide / Mentors / Prizes / Stack) it navigates to the Overview form. The form section uses `scroll-mt-24` so header chrome does not cover the heading. Guide, Mentors, and Stack are header tabs only.

## Subdomain (Vercel + DNS)

The app is ready for `hackathon.cursorserbia.com`. Creating the hostname is a dashboard step:

1. Vercel → this project → **Settings → Domains → Add** → `hackathon.cursorserbia.com`.
2. If the apex already uses Vercel nameservers, wait until the domain is **Valid**.
3. Otherwise add a CNAME at the DNS host: name `hackathon`, value `cname.vercel-dns.com`.
4. After it is green, set Vercel env `NEXT_PUBLIC_HACKATHON_SITE_URL=https://hackathon.cursorserbia.com` and redeploy.
5. Local preview without DNS: `http://hackathon.localhost:3001/` (Chrome/Firefox treat `*.localhost` as loopback).

## Verification

- [ ] `/hackathon` loads the Overview tab (hero, highlights, marquee, become-a-sponsor form)
- [ ] Hero "Sponsor event" always scrolls to `#become-a-sponsor` (Overview with or without hash; from Prizes/Stack)
- [ ] Tabs switch to Guide, Mentors, Prizes, and Stack (no Sponsor tab)
- [ ] `/hackathon/mentors` shows Nick Tomić first and an empty judges placeholder
- [ ] `/hackathon/guide` shows purpose, team size, shipping defaults, and an empty Topics placeholder
- [ ] `/hackathon/sponsor` redirects to Overview `#become-a-sponsor`
- [ ] `http://hackathon.localhost:<port>/` rewrites to the Overview tab
- [ ] Date/location update when Luma event changes (or fall back to static)
- [ ] Marquee animates smoothly and pauses on hover
- [ ] Sponsorship form validates required fields
- [ ] Postgres path stores applications
- [ ] Webhook path forwards payload
- [ ] Google Sheets Apps Script receives a test row when `HACKATHON_SPONSOR_WEBHOOK_URL` is set
- [ ] `/hackathon/stack` shows expertise group panels; card click opens a compact modal

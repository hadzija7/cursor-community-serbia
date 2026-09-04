# Hackathon Specification

## Overview

Hackathon mini-site with tabs (Overview, Guide, Mentors, Prizes, Stack). Served at `/hackathon` on the community host, and at the root of `hackathon.cursorserbia.com` when that subdomain is attached.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-09-04 |

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
| `/hackathon/submit` | Project submission form (checked-in Google-auth hackers only) |
| `/hackathon/sponsor` | Redirects to Overview `#become-a-sponsor` (bookmarks / `hackathon.*` `/sponsor` rewrite) |
| `/api/hackathon/event` | GET live date/location from Luma (static fallback) |
| `/api/hackathon/sponsor` | POST sponsorship applications |
| `/api/hackathon/submit` | POST project submission (auth + Luma `checked_in` required; upserts one row per email) |
| `/api/auth/[...nextauth]` | Google OAuth sign-in/sign-out (NextAuth.js v5) |
| `/api/hackathon/attendee-status` | GET Luma guest status for authenticated user |
| `/api/hackathon/claim-credits` | POST claim sponsor credit code (requires check-in) |

On host `hackathon.*` (e.g. `hackathon.cursorserbia.com` or `hackathon.localhost`), `middleware.ts` rewrites `/` → `/hackathon`, `/stack` → `/hackathon/stack`, `/submit` → `/hackathon/submit`, and so on. Community chrome is replaced by `HackathonSiteHeader` tabs.

When `NEXT_PUBLIC_HACKATHON_SITE_URL` is set, `/hackathon` on the main domain redirects to that host. Do not set the env until the Vercel domain is live.

### Key Components

- `app/hackathon/page.tsx` — Overview tab (hero, highlights, marquee, become-a-sponsor form)
- `app/hackathon/guide/page.tsx` — Guide tab
- `app/hackathon/mentors/page.tsx` — Mentors and judges tab
- `app/hackathon/stack/page.tsx` — Stack tab
- `app/hackathon/prizes/page.tsx` — Prizes tab
- `app/hackathon/submit/page.tsx` — Project submission tab
- `app/hackathon/sponsor/page.tsx` — Redirect to Overview `#become-a-sponsor`
- `app/hackathon/layout.tsx` — Route metadata + `HackathonSiteHeader`; OG/Twitter share image is `hackathonConfig.ogImage` (`/images/og-grok-bot-hackathon.jpg`)
- `components/HackathonSiteHeader.tsx` — Hackathon-only chrome and tabs (Overview / Guide / Mentors / Prizes / Stack / Submit); brand is full-circle `/grokbot.svg` mark + “Grok Bot Serbia Hackathon”
- `components/HackathonGuide.tsx` — Purpose, team, shipping, guidelines, and extensible topics
- `components/HackathonProjectSubmitForm.tsx` — Project submission form (login / check-in gates + fields)
- `components/HackathonPeople.tsx` — Mentor, host, and judge cards (`/hackathon/mentors`)
- `middleware.ts` — Subdomain rewrite + optional main-host redirect
- `lib/hackathon-site.ts` — Host detection and public hrefs
- `lib/hackathon-checkin.ts` — Shared Luma `checked_in` gate (credit claims + project submit)
- `lib/github-repo.ts` — GitHub URL parse + public-repo check via unauthenticated API
- `lib/project-submission.ts` — Field validation for project submissions
- `components/HackathonHero.tsx` — Full-width hero with date/location/duration cards and CTAs; Grok Bot mascot sits under the tagline on mobile and peeks beside the title from `sm` up
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
- Table: `hackathon_project_submissions` in `db/schema.sql` (one row per attendee email; upsert on resubmit)
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
- Prize tracks (`hackathonPrizes`: Convex cash 100.000 / 50.000 RSD; Kosmonaut coworking — 15 / 10 / 5 entries per teammate on the top 3 teams, use within 3 months, claimed on their platform; Daytona credits $3,000 / $2,000 / $1,000 plus $100 for every participant; ABC BootCamps — 50% / 40% / 30% scholarships to ABC Silicon Valley 2027)
- Hacker guide (`hackathonGuidePurpose`, `hackathonGuideTeam`, `hackathonGuideSteps`, `hackathonGuideTopics`) — source for `/hackathon/guide`
- Mentors, hosts, and judges (`hackathonMentors`, `hackathonHosts`, `hackathonJudges`) — source for `/hackathon/mentors`
- Tech partner logos (`hackathonSponsors`: ElevenLabs, Firecrawl, Render, Convex, Daytona, Wispr Flow, Exa, Netlify, Fal.ai, Wonder) — Overview heading is **Tech partners**
- Community partners (`hackathonCommunityPartners`: Startit, Superteam Balkan, ABC BootCamps, JigJoy, Kosmonaut) — Overview, below tech partners
- Superteam Balkan uses a transparent PNG wordmark (`/images/partners/superteam-balkan.png`) at `h-10` (a step above Startit’s `h-8`) so the old JPEG black frame does not show on the dark marquee. ABC uses the official overlapping ABC + BOOTCAMP mark (`abc-bootcamps.png`) on a white pad (`logoBg: '#ffffff'`) at `h-10` so the dark wordmark stays readable on the dark marquee
- Sponsor stack (`hackathonSdlcStages`, `hackathonSponsorProfiles` including `mcp`, recipes, picks) — source for `/hackathon/stack` and `docs/hackathon/sponsor-cheat-sheet.md`

### Sponsor stack tab

- Route: `/hackathon/stack` (Stack tab)
- Flat 2-column grid of sponsor cards (not a linear pipeline). Area label lives on the card (e.g. Host / infra, Voice / audio); details open in a modal
- Each modal has an **Add to Cursor** button (title row) that uses the official `cursor://anysphere.cursor-deeplink/mcp/install` deeplink (same tab — do not open `https://cursor.com/en/install-mcp`, which auto-closes). Configs live on `hackathonSponsorProfiles[].mcp` and are encoded by `lib/cursor-mcp-install.ts`
- Cursor is host, not a sponsor. Wispr Flow is a tech partner (dictation into Cursor); ElevenLabs stays product voice
- Confirmed perks only: Daytona $100 coupon (claim via `CREDIT_CODE_DAYTONA`, redeem in app.daytona.io Billing) + winner credits (Best app that uses Daytona); Convex 100.000 / 50.000 RSD; Kosmonaut coworking for top 3 teams (15 / 10 / 5 entries per teammate, use within 3 months, claim on kosmonaut.rs); ABC BootCamps scholarships for top 3 (50% / 40% / 30% to ABC Silicon Valley 2027); Wispr Flow 3 months Pro; Exa $50 credits each; Fal.ai $50 credits each; Netlify 3,000 credits for all participants; Wonder Pro for all participants
- Stack path starts with **Grok Bot** (Editor / host; Cursor works too), then Firecrawl, Exa, Wonder, Daytona, Convex, ElevenLabs, Wispr, Fal.ai, Render, Netlify
- Marketing copy prioritizes Grok Bot; Cursor remains supported and named where the product action is Cursor-specific (MCP install deeplink, Cursor Pro referral, Origin)
- Stack area cards also cover Exa (Search / web), Wonder (Design / UI), Wispr Flow (Voice input), Fal.ai (Generate / media), and Netlify (Host / frontend). Wispr has no public MCP install URL — desktop app only. Wonder MCP is `https://mcp.wonder.so/mcp` (OAuth after install)

### Guide tab

- Route: `/hackathon/guide` (Guide tab)
- Minimal briefing: why, team (solo or a team), numbered guidelines timeline, topics
- Timeline: Stack → mentors → Cursor → partner MCPs → Origin → 3-minute demo → submit form (submit step links to `/hackathon/submit`)
- Content-first: add theme rows to `hackathonGuideTopics` when tracks lock; do not invent topics
- Types: `HackathonGuideCopy` / `HackathonGuideStep` / `HackathonGuideTopic` in `lib/types.ts`

### Mentors and judges tab

- Route: `/hackathon/mentors` (Mentors tab)
- Three sections in order: hosts (published), mentors (published), judges (empty until announced)
- Cards use a 1-column grid on small screens and 2 columns from `md` up
- First mentor: Nick Tomić — CTO and builder; SaaS / AI GTM bio; ask about GTM; X `dropoutsanta`, LinkedIn `nicktomic`
- Hosts: Aleksandar Hadžibabić and Goran Petković — photos and socials match homepage ambassadors; ask about anything
- Mentor photos in `public/images/hackathon/`; host photos reuse `public/images/ambassadors/`
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
- Overview hero shows `hackathonConfig.mascotPeekImage` under the tagline on mobile (compact, in flow) and peeks beside the title from `sm` up; dark pixels are knocked out and `mix-blend-lighten` so it sits on the page background instead of a boxed image

Hero CTAs: Register on Luma (external Luma event link), View on Luma (when already registered/checked in), and Sponsor event (`hackathon.viewSponsorsCta`). Google login is navbar-only. Sponsor event always scrolls to Overview `#become-a-sponsor` — including a second click while already on Overview with that hash. Off Overview (Guide / Mentors / Prizes / Stack) it navigates to the Overview form. The form section uses `scroll-mt-24` so header chrome does not cover the heading. Guide, Mentors, and Stack are header tabs only.

## Hacker Auth (Google OAuth)

Hackathon attendees sign in with Google via NextAuth.js v5 (JWT strategy, no DB adapter). The hero primary CTA is "Register on Luma"; the navbar shows "Log in". After sign-in the header shows the user's email and Luma status badge (Checked in / Registered / Not registered).

### Components

- `lib/auth.ts` — NextAuth config with Google provider
- `app/api/auth/[...nextauth]/route.ts` — Route handler
- `components/SessionProvider.tsx` — Client-side session provider (wraps hackathon layout)
- `components/HackerAuthButton.tsx` — Login button / profile dropdown / status badge
- `lib/use-hacker-status.ts` — Client hook fetching `/api/hackathon/attendee-status`

### Luma status check

`/api/hackathon/attendee-status` uses the authenticated user's email to query the Luma guests list API (`GET /v1/events/guests/list`). A guest is `checked_in` if any `event_tickets[].checked_in_at` is set, `registered` if `approval_status` is `approved` without check-in, or `not_found` otherwise.

### Credit claiming

Checked-in attendees can claim sponsor credit codes on the Stack page. Each sponsor modal with confirmed perks shows a "Claim Credits" control under the one-liner.

- **Shared codes** (Daytona, Exa, Firecrawl, Wonder, …): stored as env vars (`CREDIT_CODE_DAYTONA`, `CREDIT_CODE_EXA`, etc.). Every claimant gets the same value; claims are recorded in `hackathon_credit_claims`. Daytona claim UI shows Billing redeem steps (app.daytona.io → Billing → paste → Redeem).
- **Unique pool codes** (Grok Bot / Cursor Pro referral links): stored in `hackathon_referral_codes`. Claim assigns the next unclaimed row to the attendee (idempotent per email). After claim, the modal shows the full referral URL with Copy / Open, plus a setup tip: $20 Cursor credits → upgrade to Pro → log in to Grok Bot with Cursor.
- `/api/hackathon/claim-credits` verifies Luma check-in, then returns the code
- Seed Cursor links with `pnpm db:seed:cursor-referrals` from the gitignored `db/data/cursor-referrals.txt` (see `.example`; never commit live URLs)

### Project submissions

Checked-in attendees submit one project for judging via `/hackathon/submit` (header **Submit** tab). Demo recording is a URL only (YouTube / Loom / similar) — no file upload.

**Access control** (same gate as credit claims via `lib/hackathon-checkin.ts`):

| Client state | UI | API |
|--------------|----|-----|
| Not signed in | Google login CTA | `401 Not authenticated` |
| Signed in, Luma `registered` | Check-in-first message | `403` with clear check-in message |
| Signed in, Luma `not_found` | Register on Luma CTA | `403` |
| Signed in, Luma `checked_in` | Form | Accepts POST |

**Fields (all required):** project title (short), project description (multi-line), public GitHub repo URL, demo recording URL (3–5 min helper text), live demo http(s) URL.

**GitHub validation:** URL must parse as `github.com/owner/repo`; server verifies the repo is public via unauthenticated `GET https://api.github.com/repos/{owner}/{repo}` (404 / private rejected).

**Persistence:** table `hackathon_project_submissions` in `db/schema.sql` / `pnpm db:setup`. One row per email (`UNIQUE(email)`); resubmit upserts and bumps `updated_at`.

**Components / routes:**

- `app/hackathon/submit/page.tsx` + `components/HackathonProjectSubmitForm.tsx`
- `POST /api/hackathon/submit`
- `lib/project-submission.ts`, `lib/github-repo.ts`

### Env vars

| Variable | Purpose |
|----------|---------|
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_SECRET` | NextAuth JWT signing secret (`openssl rand -base64 32`) |
| `CREDIT_CODE_*` | Shared per-sponsor promo codes (e.g. `CREDIT_CODE_DAYTONA`, `CREDIT_CODE_EXA`) |

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
- [ ] Tabs switch to Guide, Mentors, Prizes, Stack, and Submit (no Sponsor tab)
- [ ] `/hackathon/mentors` shows Hosts (Aleksandar + Goran side by side from `md`), then Mentors (Nick with X + LinkedIn), then an empty judges placeholder
- [ ] `/hackathon/guide` shows purpose, team size, shipping defaults, and an empty Topics placeholder
- [ ] Guide submit step links to `/hackathon/submit`
- [ ] `/hackathon/submit` shows login CTA when signed out; check-in message when registered; form when checked in
- [ ] `POST /api/hackathon/submit` rejects unauthenticated and not-checked-in callers; upserts one row per email
- [ ] GitHub URL must be a public repo (shape + API check)
- [ ] `/hackathon/sponsor` redirects to Overview `#become-a-sponsor`
- [ ] `http://hackathon.localhost:<port>/` rewrites to the Overview tab
- [ ] `http://hackathon.localhost:<port>/submit` rewrites to the Submit tab
- [ ] Date/location update when Luma event changes (or fall back to static)
- [ ] Marquee animates smoothly and pauses on hover
- [ ] Sponsorship form validates required fields
- [ ] Postgres path stores applications
- [ ] Webhook path forwards payload
- [ ] Google Sheets Apps Script receives a test row when `HACKATHON_SPONSOR_WEBHOOK_URL` is set
- [ ] `/hackathon/stack` shows expertise group panels; card click opens a compact modal

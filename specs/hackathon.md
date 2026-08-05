# Hackathon Specification

## Overview

Dedicated hackathon landing page at `/hackathon` with event details, animated sponsor marquee, and sponsorship application form.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-08-05 |

## Page layout

Inspired by conference landing patterns (e.g. TUM Blockchain Conference): full-width hero with gradient orange glow, scannable fact cards (when / where / duration), stat-style highlight grid, and section eyebrow labels. Palette stays on Cursor black (`cursor-bg`), white (`cursor-text`), and orange (`cursor-accent-orange`).

## Architecture

### Routes

| Route | Purpose |
|-------|---------|
| `/hackathon` | Hackathon landing page (details, prizes, sponsors, sponsorship form) |
| `/api/hackathon/event` | GET live date/location from Luma (static fallback) |
| `/api/hackathon/sponsor` | POST sponsorship applications |

### Key Components

- `app/hackathon/page.tsx` — Page composition (Navbar, hero, highlights, prizes, sponsors, form)
- `app/hackathon/layout.tsx` — Route metadata
- `components/HackathonHero.tsx` — Full-width hero with date/location/duration cards and CTAs
- `components/HackathonHighlights.tsx` — Stat-style highlight grid (TUM-inspired)
- `components/HackathonPrizes.tsx` — Prize tracks with per-place cards (above sponsors)
- `components/SponsorMarquee.tsx` — Infinite horizontal sponsor logo animation
- `components/HackathonSponsorshipForm.tsx` — Sponsorship application form
- `content/hackathon.ts` — Static fallback copy, Luma URL, prize tracks, sponsor logos, stat cards
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

- Event title, tagline, duration, and **Luma URL** (source of truth for live sync)
- Static fallback `date` / `displayDate` / `location` (used when Luma is unreachable)
- Highlights grid (`hackathonStats`)
- Prize tracks (`hackathonPrizes`: Convex — Best app that uses Convex; 1st 100.000 RSD, 2nd 50.000 RSD)
- Sponsor logos (`hackathonSponsors`: Cursor, ElevenLabs, Firecrawl, Render, Convex)

### Prizes section

- Rendered above the sponsor marquee (`#prizes`)
- One track group per sponsoring prize category; place cards (1st/2nd) use highlight accent styles
- Types: `HackathonPrizeTrack` / `HackathonPrizePlace` in `lib/types.ts`

### Live date & location from Luma

- `hackathonConfig.lumaUrl` (e.g. `https://luma.com/ghvnbjlx`) drives sync
- Server: `fetchLumaEventBySlug` reads the public Luma event page (no API key); `resolveHackathonDetails` merges date/location onto static copy
- Client: `useHackathonDetails` polls `/api/hackathon/event` every 5 minutes (same pattern as upcoming events)
- Title, tagline, and duration stay content-owned so marketing copy does not flip with Luma’s event name

Hero secondary CTA label is "Sponsor event" (`hackathon.viewSponsorsCta` in `content/locales/en.json`), linking to `#sponsors`.

## Verification

- [ ] `/hackathon` loads with event details and sponsor marquee
- [ ] Date/location update when Luma event changes (or fall back to static)
- [ ] Marquee animates smoothly and pauses on hover
- [ ] Sponsorship form validates required fields
- [ ] Postgres path stores applications
- [ ] Webhook path forwards payload
- [ ] Google Sheets Apps Script receives a test row when `HACKATHON_SPONSOR_WEBHOOK_URL` is set

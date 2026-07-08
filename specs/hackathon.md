# Hackathon Specification

## Overview

Dedicated hackathon landing page at `/hackathon` with event details, animated sponsor marquee, and sponsorship application form.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-07-08 |

## Page layout

Inspired by conference landing patterns (e.g. TUM Blockchain Conference): full-width hero with gradient orange glow, scannable fact cards (when / where / duration), stat-style highlight grid, and section eyebrow labels. Palette stays on Cursor black (`cursor-bg`), white (`cursor-text`), and orange (`cursor-accent-orange`).

## Architecture

### Routes

| Route | Purpose |
|-------|---------|
| `/hackathon` | Hackathon landing page (details, sponsors, sponsorship form) |
| `/api/hackathon/sponsor` | POST sponsorship applications |

### Key Components

- `app/hackathon/page.tsx` — Page composition (Navbar, hero, highlights, sponsors, form)
- `app/hackathon/layout.tsx` — Route metadata
- `components/HackathonHero.tsx` — Full-width hero with date/location/duration cards and CTAs
- `components/HackathonHighlights.tsx` — Stat-style highlight grid (TUM-inspired)
- `components/SponsorMarquee.tsx` — Infinite horizontal sponsor logo animation
- `components/HackathonSponsorshipForm.tsx` — Sponsorship application form
- `content/hackathon.ts` — Event copy, dates, Luma URL, sponsor logos, stat cards

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

## Content

Edit `content/hackathon.ts` for:

- Event title, tagline, dates, location, Luma URL
- Highlights grid (`hackathonStats`)
- Sponsor logos (`hackathonSponsors`)

## Verification

- [ ] `/hackathon` loads with event details and sponsor marquee
- [ ] Marquee animates smoothly and pauses on hover
- [ ] Sponsorship form validates required fields
- [ ] Postgres path stores applications
- [ ] Webhook path forwards payload

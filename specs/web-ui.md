# Web UI Specification

## Overview

The Cursor Community Serbia site is a Next.js 16 App Router application presenting a community homepage, event listings, recaps, subscribe page, and education section.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-03-21 |

## Architecture

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage (hero, events, ambassadors, partners) |
| `/api/events/upcoming` | Server route returning upcoming events (managed + listed merge, static fallback) |
| `/subscribe` | Mailing list subscription |
| `/education` | Educational resources (presentations, PDFs) |
| `/recaps/[slug]` | Event recap pages (`EventRecap`: summary; optional YouTube presentation grid with metadata from YouTube player response via `getRecapYoutubePresentationCards`; non-YouTube `videoUrl` stays a single embed; optional `interviews[]`, gallery) |
| `/slides/[id]` | Optional workshop slides |
| `/education/coworking-day/[id]` | Coworking day kickoff deck (8 slides) |

### Key Components

- `app/page.tsx` — Homepage composition
- `components/HeroHeader.tsx` — Hero + bento photo grid
- `components/UpcomingEvents.tsx`, `components/PastEvents.tsx` — Event lists
- `components/EventCountdown.tsx` — Countdown driven by live upcoming events
- `lib/use-upcoming-events.ts` — Client polling hook for upcoming events API
- `lib/luma.ts` — Server-side Luma API mapping and calendar page parsing
- `components/AmbassadorSection.tsx` — Ambassador cards
- `components/Partners.tsx` — Partner logos
- `components/SubscribeForm.tsx` — Mailing list form
- `components/PhotoGallery.tsx` — Recap image grid; fullscreen lightbox with prev/next controls and **ArrowLeft / ArrowRight** keyboard navigation when multiple photos
- `app/education/page.tsx` — Education landing page

### Layout & Theming

- `app/layout.tsx` — Root layout, metadata, favicon
- `app/globals.css` — Tailwind, Cursor Serbia theme (dark background `#14120b`, light text `#edecec`)
- `tailwind.config.ts` — Cursor color palette

## Dependencies

- Next.js 16, React 19
- Framer Motion, Lucide React
- Content from `content/` (site config, events, ambassadors, partners, education)
- Optional live events from Luma API and public calendar page via `app/api/events/upcoming/route.ts`

## Verification

- [ ] Homepage loads without errors
- [ ] Upcoming events reflect Luma data when configured
- [ ] Homepage shows static fallback when Luma is unavailable
- [ ] Subscribe form submits
- [ ] Education resources open correctly
- [ ] Favicon displays Cursor logo

# Web UI Specification

## Overview

The Cursor Community Serbia site is a Next.js 16 App Router application presenting a community homepage, event listings, recaps, subscribe page, and education section.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-04-14 |

## Architecture

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage (hero, events, ambassadors, partners) |
| `/api/events/upcoming` | Server route returning upcoming events from Belgrade + Novi Sad Luma calendars (static fallback) |
| `/api/hackathon/event` | Live hackathon date/location from Luma event page (static fallback) |
| `/subscribe` | Mailing list subscription |
| `/education` | Educational resources (presentations, PDFs) |
| `/hackathon` | Hackathon landing (details, sponsor marquee, sponsorship form) |
| `/recaps/[slug]` | Event recap pages (`EventRecap`: summary; **Video Recap** section for main `videoUrl` and optional `extraVideoRecaps` (Drive embeds); optional **Presentation** grid for `extraPresentations`; YouTube posters from `lib/youtube-metadata.ts`; Open Graph + JSON-LD `image` use first gallery photo; optional `interviews[]` (YouTube or Drive), gallery) |
| `/slides/[id]` | Optional workshop slides |
| `/education/coworking-day/[id]` | Coworking day kickoff deck (8 slides) |

### Key Components

- `app/page.tsx` — Homepage composition
- `components/HeroHeader.tsx` — Hero + bento photo grid
- `components/UpcomingEvents.tsx` — Upcoming event stack
- `components/PastEvents.tsx` — Past events with recaps: responsive grid (1 / 2 / 3 columns); **full-bleed** section (`w-screen ml-[calc(50%-50vw)]`) so the band spans the viewport while nested content is **80vw** wide and centered; card layout with hero thumbnail, metadata, recap CTA
- `components/EventCountdown.tsx` — Countdown driven by live upcoming events
- `lib/use-upcoming-events.ts` — Client polling hook for upcoming events API
- `lib/luma.ts` — Server-side Luma API mapping; city calendar env helpers (`getLumaCityCalendars`)
- `components/AmbassadorSection.tsx` — Ambassador cards
- `components/Partners.tsx` — Partner logos
- `components/HackathonPromoCard.tsx` — Homepage hero hackathon promo card (top-left overlay; orange accent; live date/location via `useHackathonDetails`)
- `lib/use-hackathon-details.ts` — Client poll of `/api/hackathon/event`
- `components/HackathonHero.tsx` — Hackathon page hero (facts + CTAs)
- `components/HackathonHighlights.tsx` — Hackathon stat-style highlight grid
- `components/SponsorMarquee.tsx` — Hackathon sponsor marquee animation
- `components/HackathonSponsorshipForm.tsx` — Hackathon sponsorship application form
- `components/SubscribeForm.tsx` — Mailing list form
- `components/PhotoGallery.tsx` — Recap image grid; fullscreen lightbox with prev/next controls and **ArrowLeft / ArrowRight** keyboard navigation when multiple photos
- `app/education/page.tsx` — Education landing page
- `app/hackathon/page.tsx` — Hackathon landing page

### Layout & Theming

- `app/layout.tsx` — Root layout, metadata, favicon
- `app/globals.css` — Tailwind, Cursor Serbia theme (dark background `#14120b`, light text `#edecec`)
- `tailwind.config.ts` — Cursor color palette

## Dependencies

- Next.js 16, React 19
- Framer Motion, Lucide React
- Content from `content/` (site config, events, ambassadors, partners, education)
- Optional live events from Belgrade and Novi Sad Luma calendars via `app/api/events/upcoming/route.ts`

## Verification

- [ ] Homepage loads without errors
- [ ] Upcoming events reflect Luma data when configured
- [ ] Homepage shows static fallback when Luma is unavailable
- [ ] Subscribe form submits
- [ ] Education resources open correctly
- [ ] Favicon displays Cursor logo

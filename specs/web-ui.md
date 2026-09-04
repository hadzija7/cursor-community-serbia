# Web UI Specification

## Overview

The Cursor Community Serbia site is a Next.js 16 App Router application presenting a community homepage, event listings, recaps, subscribe page, and education section.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-09-01 |

## Architecture

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage (hero, events, ambassadors, partners) |
| `/api/events/upcoming` | Server route returning upcoming events from Belgrade + Novi Sad Luma calendars (static fallback) |
| `/api/hackathon/event` | Live hackathon date/location from Luma event page (static fallback) |
| `/subscribe` | Mailing list subscription |
| `/education` | Educational resources (presentations, PDFs) |
| `/hackathon` | Hackathon Overview tab (hero, highlights, marquee, become-a-sponsor form; also `hackathon.*` host `/`) |
| `/hackathon/guide` | Guide tab (why, team, guidelines timeline, topics) |
| `/hackathon/mentors` | Mentors and judges tab |
| `/hackathon/stack` | Stack tab (expertise groups + card modal) |
| `/hackathon/prizes` | Prizes tab |
| `/hackathon/sponsor` | Redirects to Overview `#become-a-sponsor` |
| `/recaps/[slug]` | Event recap pages (`EventRecap`: summary; **Video Recap** section for main `videoUrl` and optional `extraVideoRecaps` (Drive embeds); optional **Presentation** grid for `extraPresentations`; YouTube posters from `lib/youtube-metadata.ts`; Open Graph + JSON-LD `image` use first gallery photo; optional `interviews[]` (YouTube or Drive), gallery) |
| `/slides/[id]` | Optional workshop slides |
| `/education/coworking-day/[id]` | Coworking day kickoff deck (8 slides) |

### Key Components

- `app/page.tsx` — Homepage composition
- `components/HeroHeader.tsx` — Hero + bento photo grid
- `components/SectionEyebrow.tsx` — Shared orange uppercase section label used across homepage and education headers
- `components/UpcomingEvents.tsx` — Upcoming event stack; orange eyebrow + orange-tinted gradient cards (same as ambassadors)
- `components/PastEvents.tsx` — Past events with recaps: orange `SectionEyebrow`; responsive grid (1 / 2 / 3 columns); **full-bleed** section (`w-screen ml-[calc(50%-50vw)]`) so the band spans the viewport while nested content is **80vw** wide and centered; card layout with hero thumbnail, metadata, recap CTA
- `components/EventCountdown.tsx` — Countdown driven by live upcoming events
- `lib/use-upcoming-events.ts` — Client polling hook for upcoming events API
- `lib/luma.ts` — Server-side Luma API mapping; city calendar env helpers (`getLumaCityCalendars`)
- `components/AmbassadorSection.tsx` — Ambassador cards; orange eyebrow only (no extra heading); cards use a light orange gradient border
- `components/Partners.tsx` — Partner logos; orange `SectionEyebrow` to match other homepage sections
- `components/HackathonPromoCard.tsx` — Homepage hero hackathon promo card (top-left overlay; Grok Bot mascot next to the title; orange accent; live date/location via `useHackathonDetails`)
- `lib/use-hackathon-details.ts` — Client poll of `/api/hackathon/event`
- `components/HackathonHero.tsx` — Hackathon page hero (facts + CTAs)
- `components/HackathonMascotPeek.tsx` — Overview hero Grok Bot MP4 with reduced-motion static fallback
- `components/HackathonHighlights.tsx` — Hackathon stat-style highlight grid
- `components/HackathonPrizes.tsx` — Hackathon prize tracks (place cards above sponsors)
- `components/SponsorMarquee.tsx` — Hackathon tech partner and community partner marquees
- `components/HackathonSponsorshipForm.tsx` — Hackathon sponsorship application form
- `components/SubscribeForm.tsx` — Mailing list form
- `components/PhotoGallery.tsx` — Recap image grid; fullscreen lightbox with prev/next controls and **ArrowLeft / ArrowRight** keyboard navigation when multiple photos
- `app/education/page.tsx` — Education landing page
- `app/hackathon/page.tsx` — Hackathon Overview tab (includes become-a-sponsor form)
- `app/hackathon/guide/page.tsx` — Guide tab
- `app/hackathon/mentors/page.tsx` — Mentors and judges tab
- `app/hackathon/stack/page.tsx` — Stack tab
- `app/hackathon/prizes/page.tsx` — Prizes tab
- `app/hackathon/sponsor/page.tsx` — Redirect to Overview `#become-a-sponsor`
- `components/HackathonSiteHeader.tsx` — Hackathon tabs (Overview / Guide / Mentors / Prizes / Stack)
- `components/HackathonGuide.tsx` — Hacker briefing sections + extensible topics
- `components/HackathonPeople.tsx` — Mentor and judge cards
- `middleware.ts` — `hackathon.*` host rewrite
- `components/HackathonSponsorStack.tsx` — Flat sponsor cards and detail modal with Add to Cursor MCP install

### Layout & Theming

- `app/layout.tsx` — Root layout, metadata (Open Graph + Twitter share image: `/images/og-cursor-serbia.jpg`), favicon
- `app/hackathon/layout.tsx` — Hackathon share preview uses `/images/og-grok-bot-hackathon.jpg` so Telegram/LinkedIn/X do not show the community Cursor thumbnail
- `app/globals.css` — Tailwind, Cursor Serbia theme (dark background `#14120b`, light text `#edecec`)
- `tailwind.config.ts` — Cursor color palette
- Share preview: `metadataBase` + `openGraph.images` / `twitter.images` so LinkedIn/X show Cursor Serbia branding instead of scraping an ambassador photo

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
- [ ] `/hackathon` shows the become-a-sponsor form; header tabs are Overview / Guide / Mentors / Prizes / Stack
- [ ] `/hackathon/guide` loads purpose, team, shipping, and guidelines
- [ ] `/hackathon/mentors` shows Nick Tomić and an empty judges section
- [ ] `/hackathon/stack` loads sponsor cards labeled by area
- [ ] Sponsor modal has Add to Cursor, which uses the `cursor://` MCP install deeplink (no bounce tab)

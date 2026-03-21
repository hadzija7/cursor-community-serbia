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
| `/subscribe` | Mailing list subscription |
| `/education` | Educational resources (presentations, PDFs) |
| `/recaps/[slug]` | Event recap pages (`EventRecap`: summary, optional video, optional YouTube `interviews[]`, gallery) |
| `/slides/[id]` | Optional workshop slides |

### Key Components

- `app/page.tsx` — Homepage composition
- `components/HeroHeader.tsx` — Hero + bento photo grid
- `components/UpcomingEvents.tsx`, `components/PastEvents.tsx` — Event lists
- `components/AmbassadorSection.tsx` — Ambassador cards
- `components/Partners.tsx` — Partner logos
- `components/SubscribeForm.tsx` — Mailing list form
- `app/education/page.tsx` — Education landing page

### Layout & Theming

- `app/layout.tsx` — Root layout, metadata, favicon
- `app/globals.css` — Tailwind, Cursor Serbia theme (dark background `#14120b`, light text `#edecec`)
- `tailwind.config.ts` — Cursor color palette

## Dependencies

- Next.js 16, React 19
- Framer Motion, Lucide React
- Content from `content/` (site config, events, ambassadors, partners, education)

## Verification

- [ ] Homepage loads without errors
- [ ] Subscribe form submits
- [ ] Education resources open correctly
- [ ] Favicon displays Cursor logo

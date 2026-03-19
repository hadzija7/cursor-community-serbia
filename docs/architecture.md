# Architecture

Cursor Community Serbia — architecture and conventions.

## Overview

Cursor Community Serbia is a Next.js community site based on the Cursor Ambassador Evergreen Template. It provides a configurable, content-driven website for local Cursor community meetups, events, recaps, and educational resources.

## System Map

| System           | Spec                    | Location                         |
|------------------|-------------------------|----------------------------------|
| Web UI           | specs/web-ui.md         | `app/`, `components/`            |
| Content Config   | specs/content-config.md | `content/`                       |
| Luma Events Sync | specs/web-ui.md, specs/content-config.md | `app/api/events/upcoming/`, `lib/luma.ts`, `lib/use-upcoming-events.ts` |
| Mailing List     | specs/mailing-list.md   | `app/api/subscribe/`, `db/`      |
| Education        | specs/education.md      | `app/education/`, `public/education/` |
| Slides (optional)| specs/slides.md         | `modules/slides/`, `app/slides/` |

## Directory Structure

```
cursor-community-serbia/
├── app/
│   ├── page.tsx              # Homepage composition
│   ├── layout.tsx            # Root layout, metadata, favicon
│   ├── subscribe/            # Mailing list subscribe page
│   ├── education/            # Educational resources landing
│   ├── recaps/[slug]/        # Dynamic recap pages
│   ├── slides/[id]/          # Optional workshop slides
│   └── api/subscribe/        # Subscribe API route
├── components/               # Reusable React components
├── content/                  # Content-driven configuration
│   ├── site.config.ts        # Site identity, URLs, locales
│   ├── events.ts             # Upcoming/past events
│   ├── ambassadors.ts       # Ambassador cards
│   ├── partners.ts           # Partner logos
│   ├── education.ts          # Education resources list
│   ├── recaps/               # Recap documents
│   └── locales/              # i18n dictionaries
├── lib/                      # Utilities (i18n, db)
├── modules/slides/           # Optional slide engine
├── public/                   # Static assets
│   ├── education/            # Presentations, PDFs
│   └── images/               # Photos, logos
├── db/                       # Postgres schema (mailing list)
└── scripts/                  # db-setup, db-query
```

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 16 (App Router)             |
| UI         | React 19, Tailwind, Framer Motion   |
| Database   | Postgres (Neon via Vercel) optional |
| Deployment | Vercel                              |
| Testing    | Vitest, Testing Library             |

## Key Conventions

- **Content-first:** Most customization is done by editing `content/` files.
- **i18n:** Use `useI18n()` and `t('path.to.key')` for translations.
- **Images:** Use local assets in `public/images/` for portability.
- **Specs:** One spec per system; see `specs/README.md`.

## Environment

| Variable                    | Purpose                              |
|-----------------------------|--------------------------------------|
| `POSTGRES_URL` / `DATABASE_URL` | Postgres connection (mailing list) |
| `MAILING_LIST_WEBHOOK_URL`  | Optional webhook for subscriptions   |
| `MAILING_LIST_API_KEY`      | Optional API key for webhook         |
| `LUMA_API_KEY`              | Server-only key for Luma calendar API |
| `LUMA_API_BASE_URL`         | Optional override for Luma API base URL |
| `.env.local`                | Local env (gitignored)               |

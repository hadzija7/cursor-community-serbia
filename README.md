# Cursor Community Serbia

The official local community site for Cursor AI enthusiasts in Serbia. Join meetups, coworking days, and workshops across Novi Sad, Belgrade, Niš, and beyond.

## About

Cursor Community Serbia connects developers, builders, and AI enthusiasts who use [Cursor](https://cursor.com) in their daily work. We host events, share learnings, and grow together as a community.

**What we do:**
- **Meetups & coworking** — In-person gatherings in major Serbian cities
- **Education** — Presentations and resources for beginners and beyond
- **Recaps** — Event highlights and photos from past meetups
- **Community updates** — Stay in the loop via our mailing list

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key Features

- **Homepage** — Upcoming events, countdown, past event recaps
- **Education** (`/education`) — Productivity with AI & Cursor presentation, Cursor Cheat Sheet, and more
- **Subscribe** (`/subscribe`) — Join the mailing list for updates
- **Recaps** (`/recaps/[slug]`) — Event photo galleries and highlights
- **Slides** (`/slides/[id]`) — Optional workshop slide decks

## Commands

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Dev | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Test | `pnpm test` |
| DB setup | `pnpm db:setup` |

## Customization

Content is driven by files in `content/`:

- **`site.config.ts`** — Community name, Luma URL, locales
- **`events.ts`** — Upcoming and past events
- **`ambassadors.ts`** — Ambassador profiles
- **`partners.ts`** — Host and sponsor logos
- **`education.ts`** — Educational resources (presentations, PDFs, guides)
- **`locales/`** — Translation dictionaries

See `AGENTS.md` and `specs/` for detailed architecture and specs.

## Mailing List

Subscriptions can use **Postgres** or a **Webhook**:

- **Postgres:** Add a database via [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=postgres), run `db/schema.sql`, set `POSTGRES_URL` or `DATABASE_URL`
- **Webhook:** Set `MAILING_LIST_WEBHOOK_URL` to forward signups to an external endpoint
- **Luma:** With `LUMA_BELGRADE_API_KEY` and/or `LUMA_NOVI_SAD_API_KEY`, new subscribers are added to each configured city calendar via the [import-people API](https://docs.luma.com/reference/post_v1-calendar-import-people). Optional `LUMA_IMPORT_TAG_NAMES` applies existing calendar tags.

Copy `.env.example` to `.env.local` and fill in the required variables.

## Deployment

**Vercel:** Push to GitHub and import the repo. Deploy with default Next.js settings.

**Other platforms:**
- Build: `pnpm build`
- Start: `pnpm start`

## Contributing

Contributions are welcome. See `CONTRIBUTING.md` for guidelines.

## Links

- [Cursor Community](https://cursor.com/community)
- [Luma — All Events](https://luma.com/cursorcommunity)

## Credits

Built with the [Cursor Ambassador Evergreen Template](https://github.com/CursorCommunity). Designed by [Luis Fernando Romero Calero](https://lfrc.me) and [Cursor](https://cursor.com).

## License

MIT. See `LICENSE`.

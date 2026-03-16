# Cursor Community Serbia — Agent Map

## Non-Negotiable Rules
1. Read relevant docs/specs before editing code.
2. Keep changes small, testable, and reversible.
3. After implementation, update `TODO.md`, `docs/quality.md`, and related specs.
4. Write important artifacts to disk (not only in chat).

## Project Snapshot
- **Name:** Cursor Community Serbia
- **Purpose:** Local Cursor Ambassador community site — events, recaps, education, mailing list
- **Systems:** Web UI, Content config, Mailing list, Education, Slides (optional)
- **Tech:** Next.js 16, React 19, Tailwind, pnpm, Vitest

## Repository Map
| Resource | Path |
|----------|------|
| Architecture | `docs/architecture.md` |
| Core beliefs | `docs/core-beliefs.md` |
| Quality scorecard | `docs/quality.md` |
| Spec index | `specs/README.md` |
| Testing strategy | `specs/testing-strategy.md` |
| Task plan | `TODO.md` |
| Workflows | `.agents/workflows/` |
| Plans | `docs/plans/active/`, `docs/plans/completed/` |
| Cursor rules | `.cursor/rules/` |

## How To Work Here
1. Confirm goal and impacted system(s).
2. Read `docs/architecture.md` and the relevant spec(s).
3. If work spans multiple systems, create a plan in `docs/plans/active/`.
4. Implement in small steps with verification.
5. Update docs, specs, and quality grades before closing work.

## Commands
| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Dev | `pnpm dev` |
| Build | `pnpm build` |
| Test | `pnpm test` |
| Lint | `pnpm lint` |
| DB setup | `pnpm db:setup` |

## Key Directories
- `app/` — Next.js routes (page, recaps, subscribe, education, slides)
- `components/` — React components (HeroHeader, events, partners, etc.)
- `content/` — Site config, events, ambassadors, education, locales
- `lib/` — i18n, db, types
- `public/` — Static assets, favicon, education materials

## Environment
- `.env.local` — Secrets (gitignored). See `.env.example` for required vars.
- Postgres: `POSTGRES_URL` or `DATABASE_URL` for mailing list
- Webhook: `MAILING_LIST_WEBHOOK_URL`, `MAILING_LIST_API_KEY` (optional)

# Cursor Community Serbia — Task Plan

## Phase 1: Foundation (Current)
- [x] Scaffold agent-friendly structure (AGENTS.md, docs, specs, rules)
- [ ] Verify all specs reflect current implementation
- [x] Add/expand unit tests for subscribe API (mailing list + Luma)
- [ ] Add/expand unit tests for education config

## Phase 2: Content & Polish
- [x] Coworking day slide deck (`/education/coworking-day`, 8 slides: brainstorming + Obsidian/Cursor PKM)
- [x] Live Luma upcoming-events sync with static fallback (`/api/events/upcoming`, `lib/luma.ts`)
- [x] Recap photo gallery: keyboard arrows in fullscreen lightbox (`PhotoGallery`)
- [x] Add Cursor Meetup Novi Sad past event recap (Mar 17, 2026)
- [x] Add Cursor Coworking Niš recap (Mar 20, 2026) with presentation video + interviews
- [x] Add Cafe Cursor Cannes recap (Apr 2, 2026); Luma https://luma.com/hswzhn5m
- [x] Add Cursor Belgrade Hub201 recap (Apr 8, 2026); Luma https://luma.com/yvpg9ijv
- [ ] Review and update content (events, ambassadors, partners) for Serbia
- [ ] Ensure education resources are complete and linked correctly
- [ ] Verify i18n keys and add Serbian locale if needed

## Phase 3: Quality & Observability
- [ ] Improve test coverage per `specs/testing-strategy.md`
- [ ] Document deployment and env setup for contributors
- [ ] Add CI checks for build, lint, test

## Verification Checklist (before marking phase complete)
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] `specs/README.md` statuses updated
- [ ] `docs/quality.md` grades reflect reality

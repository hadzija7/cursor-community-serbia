# Quality Scorecard

Living scorecard for Cursor Community Serbia. Update after each phase.

## Domain Grades

| Domain        | Spec | Code | Tests | Review | Overall |
|---------------|------|------|-------|--------|---------|
| Web UI        | C    | B    | C     | -      | C       |
| Content Config| C    | B    | C     | -      | C       |
| Mailing List  | C    | B    | C     | -      | C       |
| Education     | C    | B    | -     | -      | C       |
| Slides        | C    | B    | -     | -      | C       |

**Grade scale:** A (production-ready), B (functional), C (exists), D (partial), F (not started)

## Architectural Layers

| Layer          | Grade | Notes                                    |
|----------------|-------|------------------------------------------|
| Error handling | C     | Basic try/catch; API returns errors      |
| Security       | C     | Env vars for secrets; no hardcoded keys |
| Observability  | D     | Vercel Analytics; no structured logging |
| Performance    | B     | Next.js optimizations; static where possible |
| CI             | D     | No CI config in repo                     |
| Documentation  | B     | README, this scaffold                    |

## Known Gaps

- [x] Unit tests for upcoming events API and Luma mapping
- [x] Unit tests for subscribe API (webhook + optional Luma import)
- [ ] E2E or UI property tests
- [ ] CI pipeline (lint, test, build)
- [ ] Structured error boundaries

## Score History

| Date       | Change                          |
|------------|----------------------------------|
| 2026-04-09 | Recap YouTube grid: `getRecapYoutubePresentationCards` + `lib/youtube-metadata.ts` (player response, cached); cards side-by-side on md+ |
| 2026-04-09 | Recap `extraPresentations[]` for additional YouTube recordings (Hub201: second session link) |
| 2026-04-09 | Recap presentation: optional `videoThumbnailUrl` (poster + click-to-play for YouTube); Hub201 recap uses Drive image |
| 2026-04-09 | Content: Cursor Belgrade Hub201 recap (`cursor-belgrade-hub201-1`) + past event; Luma yvpg9ijv |
| 2026-04-03 | Content: Cafe Cursor Cannes recap (`cafe-cursor-cannes-1`) + past event entry |
| 2026-03-27 | Coworking Day deck: brainstorming slide + Obsidian/Cursor PKM build idea (8 slides) |
| 2026-03-25 | Education: Coworking Day deck (`coworking-day-deck.tsx`, `/education/coworking-day`) |
| 2026-03-24 | Subscribe API: optional Luma `import-people` for calendar sync; tests |
| 2026-03-23 | Recap `videoUrl`: presentation section + YouTube watch URL normalization |
| 2026-03-21 | Live Luma upcoming events sync + tests |
| 2026-03-21 | Recap gallery lightbox: keyboard ArrowLeft/ArrowRight to browse photos |
| 2026-03-21 | Recap `interviews[]` + YouTube embed helper; Niš coworking recap content |
| 2026-03-13 | Initial scaffold; grades set    |

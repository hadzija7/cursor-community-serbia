# Quality Scorecard

Living scorecard for Cursor Community Serbia. Update after each phase.

## Domain Grades

| Domain        | Spec | Code | Tests | Review | Overall |
|---------------|------|------|-------|--------|---------|
| Web UI        | C    | B    | D     | -      | C       |
| Content Config| C    | B    | -     | -      | C       |
| Mailing List  | C    | B    | D     | -      | C       |
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
| Documentation  | B     | README, architecture, design system doc |

## Known Gaps

- [ ] Unit tests for subscribe API
- [ ] E2E or UI property tests
- [ ] CI pipeline (lint, test, build)
- [ ] Structured error boundaries

## Score History

| Date       | Change                          |
|------------|----------------------------------|
| 2026-03-20 | Added `docs/figma-capture.md`, Figma capture opt-in in layout |
| 2026-03-20 | Added `docs/design-system.md`   |
| 2026-03-13 | Initial scaffold; grades set    |

# Testing Strategy

Cursor Community Serbia — testing approach for agent-friendly development.

## Test Layers

1. **Unit tests** — Vitest, Testing Library. Components and utilities.
2. **Property-based** — fast-check (if adopted). Invariants and edge cases.
3. **UI property** — Bombadil (optional). Temporal logic on UI behavior.
4. **Multi-agent review** — `.agents/workflows/implement-and-verify.md`.

## Current Setup

- **Runner:** Vitest
- **Location:** `*.test.ts`, `*.test.tsx` alongside source
- **Run:** `pnpm test`

## What to Test

### Priority

1. Subscribe API (`app/api/subscribe/route.test.ts`) — validation, webhook/DB behavior.
2. Components that handle user input (SubscribeForm, event registration).
3. Content config loaders (events, education) — shape validation.

### Lower Priority

- Static pages (recaps, education listing) — mostly presentational.
- i18n — key coverage and fallbacks.

## Verification Before Merge

1. Run `pnpm test`.
2. Run `pnpm lint`.
3. Build succeeds: `pnpm build`.
4. For UI changes: manual smoke test or Bombadil run (if configured).

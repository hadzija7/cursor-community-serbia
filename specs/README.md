# Specs Index

Cursor Community Serbia — specification index with verification status.

## Specs

| Spec | Status | Verified | Notes |
|------|--------|----------|-------|
| [web-ui](web-ui.md) | Implemented | Partial | Core routes/components + live upcoming events API route |
| [content-config](content-config.md) | Implemented | Partial | Content-driven config with static fallback for Luma live events |
| [mailing-list](mailing-list.md) | Implemented | Partial | Postgres or webhook backend |
| [education](education.md) | Implemented | Yes | Presentations and resources |
| [slides](slides.md) | Implemented | Partial | Optional workshop slides |

## Status Legend

- **Draft** — Spec written, not yet implemented
- **In Progress** — Implementation underway
- **Implemented** — Code matches spec
- **Needs Update** — Code evolved, spec stale
- **Planned** — Future work

## Verified Legend

- **Yes** — Spec reviewed against code
- **Partial** — Some parts verified
- **No** — Not yet verified
- **Stale** — Verification outdated

## Creating / Updating Specs

1. Add or update the spec file in `specs/`.
2. Update this index with status and verification.
3. When implementing, read the spec before coding (see `.cursor/rules/`).
4. After implementation, update `docs/quality.md` and this index.

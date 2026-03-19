# Content Configuration Specification

## Overview

Content is driven by TypeScript/JSON files in `content/`. No CMS; content lives in the repo and is consumed at build/runtime.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-03 |

## Content Sources

| File | Purpose |
|------|---------|
| `content/site.config.ts` | Community name, locale, URLs, footer |
| `content/events.ts` | Upcoming/past fallback events, Luma links, recap paths |
| `content/ambassadors.ts` | Ambassador names, photos, social links |
| `content/partners.ts` | Partner logos, URLs |
| `content/education.ts` | Educational resources (presentations, PDFs) |
| `content/header-photos.ts` | Hero bento grid images |
| `content/locales/*.json` | i18n dictionaries |
| `content/recaps/*.ts` | Recap document content |

## Types

Events use `CursorEvent` from `lib/types`. Education resources use `EducationResource` from `content/education.ts`.

## Runtime Event Source

- Homepage upcoming events are read via `/api/events/upcoming`.
- If `LUMA_API_KEY` is set, server-side managed events are fetched from Luma API.
- Listed events are fetched from the public calendar page (`https://luma.com/<slug>`) and merged.
- `LUMA_CALENDAR_SLUG` can override the slug; otherwise it is inferred from `content/site.config.ts`.
- If `LUMA_API_KEY` is missing or Luma fails, `content/events.ts` remains the fallback source.

## Verification

- [ ] Adding an event updates homepage
- [ ] Luma event changes appear on homepage without redeploy (polling + API route)
- [ ] Adding a resource to `education.ts` appears on `/education`
- [ ] Locale keys resolve via `useI18n()`

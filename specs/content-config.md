# Content Configuration Specification

## Overview

Content is driven by TypeScript/JSON files in `content/`. No CMS; content lives in the repo and is consumed at build/runtime.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-04 |

## Content Sources

| File | Purpose |
|------|---------|
| `content/site.config.ts` | Community name, locale, URLs, footer |
| `content/events.ts` | Upcoming/past fallback events, Luma links, recap paths; `pastEvents` sorted newest `date` first |
| `content/ambassadors.ts` | Ambassador names, photos, social links |
| `content/partners.ts` | Partner logos, URLs |
| `content/education.ts` | Educational resources (presentations, PDFs) |
| `content/header-photos.ts` | Hero bento grid images |
| `content/locales/*.json` | i18n dictionaries |
| `content/recaps/*.ts` | Recap document content (`RecapData`: summary, optional `videoUrl` for main presentation embed, optional `interviews[]` for YouTube embeds, gallery) |

## Types

Events use `CursorEvent` from `lib/types`. Education resources use `EducationResource` from `content/education.ts`.

## Runtime Event Source

- Homepage upcoming events are fetched via `/api/events/upcoming`.
- If `LUMA_API_KEY` is set, managed events are fetched from the official Luma API.
- Listed events are parsed from the public calendar page (`https://luma.com/<slug>`) and merged.
- `LUMA_CALENDAR_SLUG` overrides the slug; otherwise inferred from `content/site.config.ts` `lumaUrl`.
- If all live sources fail, `content/events.ts` is the static fallback.

## Verification

- [ ] Adding an event updates homepage
- [ ] Luma event changes appear without redeploy (polling + API route)
- [ ] Adding a resource to `education.ts` appears on `/education`
- [ ] Locale keys resolve via `useI18n()`

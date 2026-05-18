# Content Configuration Specification

## Overview

Content is driven by TypeScript/JSON files in `content/`. No CMS; content lives in the repo and is consumed at build/runtime.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-05-17 |

## Content Sources

| File | Purpose |
|------|---------|
| `content/site.config.ts` | Community name, locale, URLs, footer |
| `content/events.ts` | Upcoming/past fallback events, Luma links, recap paths; `pastEvents` sorted newest `date` first |
| `content/ambassadors.ts` | Ambassador names, photos, social links |
| `content/partners.ts` | Partner logos, URLs |
| `content/education.ts` | Educational resources (presentations, PDFs) |
| `content/header-photos.ts` | Hero bento grid images (local `public/images/` paths and optional Google Drive `uc?export=view&id=` URLs, same pattern as recap galleries and past-event thumbnails) |
| `content/locales/*.json` | i18n dictionaries |
| `content/recaps/*.ts` | Recap document content (`RecapData`: summary, optional `videoUrl` → **Video Recap** section, optional `extraPresentations[]` → **Presentation** section, optional `videoThumbnailUrl`, optional `interviews[]`, gallery) |

## Types

Events use `CursorEvent` from `lib/types`. Education resources use `EducationResource` from `content/education.ts`.

## Runtime Event Source

- Homepage upcoming events are fetched via `/api/events/upcoming`.
- If `LUMA_BELGRADE_API_KEY` and/or `LUMA_NOVI_SAD_API_KEY` are set, managed upcoming events are fetched from each configured city calendar via the official Luma API and merged.
- If all live sources fail (or no live events are returned), the API falls back to future-dated entries from `content/events.ts` `events` (by event start time), not only rows with `status: 'upcoming'`.
- Public footer link uses `content/site.config.ts` `lumaUrl` (Cursor Community directory).

## Verification

- [ ] Adding an event updates homepage
- [ ] Luma event changes appear without redeploy (polling + API route)
- [ ] Adding a resource to `education.ts` appears on `/education`
- [ ] Locale keys resolve via `useI18n()`

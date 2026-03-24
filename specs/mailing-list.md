# Mailing List Specification

## Overview

Subscribe page at `/subscribe` collects email addresses and stores them or forwards via webhook.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-03 |

## Architecture

- **UI:** `app/subscribe/page.tsx`, `components/SubscribeForm.tsx`
- **API:** `app/api/subscribe/route.ts` (POST)
- **Luma:** When `LUMA_API_KEY` is set, new successful subscriptions call Luma [import-people](https://docs.luma.com/reference/post_v1-calendar-import-people) so the address is added to the calendar tied to that key (non-blocking; failures are logged only).

## Backends

### Postgres (recommended)

- Env: `POSTGRES_URL` or `DATABASE_URL`
- Schema: `db/schema.sql` (subscribers table)
- Setup: `pnpm db:setup`

### Webhook

- Env: `MAILING_LIST_WEBHOOK_URL`
- Payload: `{ email, source, community, subscribedAt }`
- Optional auth: `MAILING_LIST_API_KEY` in `x-api-key` header

### Luma calendar (optional)

- Env: `LUMA_API_KEY` (same key as managed events; calendar is implicit)
- Env: `LUMA_API_BASE_URL` (optional), `LUMA_IMPORT_TAG_NAMES` (optional comma-separated tags)
- Runs only for **new** rows when Postgres is used (`ON CONFLICT` skip → no Luma call). Webhook-only mode calls Luma on every accepted POST.

## Verification

- [ ] Subscribe form validates email
- [ ] Postgres path stores to database
- [ ] Webhook path forwards payload
- [ ] Duplicate email handled (already subscribed message)
- [x] Optional Luma import on new subscribe

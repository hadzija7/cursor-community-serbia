# Mailing List Specification

## Overview

Subscribe page at `/subscribe` collects email addresses and stores them or forwards via webhook.

## Status

| Field | Value |
|-------|-------|
| Status | Implemented |
| Verified | Partial |
| Last updated | 2026-05-17 |

## Architecture

- **UI:** `app/subscribe/page.tsx`, `components/SubscribeForm.tsx`
- **API:** `app/api/subscribe/route.ts` (POST)
- **Luma:** When `LUMA_BELGRADE_API_KEY` and/or `LUMA_NOVI_SAD_API_KEY` are set, new successful subscriptions call Luma [import-people](https://docs.luma.com/reference/post_v1-calendar-import-people) for each configured city calendar (non-blocking; failures are logged only).

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

- Env: `LUMA_BELGRADE_API_KEY`, `LUMA_NOVI_SAD_API_KEY` (each key is tied to its city calendar)
- Env: `LUMA_API_BASE_URL` (optional), `LUMA_IMPORT_TAG_NAMES` (optional comma-separated tags)
- Runs only for **new** rows when Postgres is used (`ON CONFLICT` skip → no Luma call). Webhook-only mode calls Luma on every accepted POST.
- When both city keys are set, import runs into both calendars best-effort.

## Verification

- [ ] Subscribe form validates email
- [ ] Postgres path stores to database
- [ ] Webhook path forwards payload
- [ ] Duplicate email handled (already subscribed message)
- [x] Optional Luma import on new subscribe

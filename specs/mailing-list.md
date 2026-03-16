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

## Backends

### Postgres (recommended)

- Env: `POSTGRES_URL` or `DATABASE_URL`
- Schema: `db/schema.sql` (subscribers table)
- Setup: `pnpm db:setup`

### Webhook

- Env: `MAILING_LIST_WEBHOOK_URL`
- Payload: `{ email, source, community, subscribedAt }`
- Optional auth: `MAILING_LIST_API_KEY` in `x-api-key` header

## Verification

- [ ] Subscribe form validates email
- [ ] Postgres path stores to database
- [ ] Webhook path forwards payload
- [ ] Duplicate email handled (already subscribed message)

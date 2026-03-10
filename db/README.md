# Database schema for mailing list

## Setup on Vercel

1. Go to your Vercel project → Storage → Add Database.
2. Choose a Postgres provider (e.g. [Neon](https://vercel.com/marketplace/neon/neon-postgres)).
3. The integration injects `POSTGRES_URL` or `DATABASE_URL` into your project.
4. Run `schema.sql` in the database SQL console (Neon Dashboard, Vercel Storage tab, etc.).

## Schema

The `subscribers` table stores email subscriptions:

| Column        | Type      | Description                          |
|---------------|-----------|--------------------------------------|
| id            | UUID      | Primary key (auto-generated)          |
| email         | TEXT      | Unique, lowercase email              |
| source        | TEXT      | e.g. `website-subscribe-form`        |
| community     | TEXT      | Community name from site config      |
| subscribed_at | TIMESTAMPTZ | When the user subscribed          |

Duplicate emails are ignored via `ON CONFLICT (email) DO NOTHING`.

#!/usr/bin/env node
/**
 * Run this to create the subscribers table in your Neon/Postgres database.
 * Loads .env.local for POSTGRES_URL or DATABASE_URL.
 *
 *   node --env-file=.env.local scripts/db-setup.mjs
 */
import { neon } from '@neondatabase/serverless'

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL
if (!url) {
  console.error('Missing POSTGRES_URL or DATABASE_URL. Use --env-file=.env.local')
  process.exit(1)
}

const sql = neon(url)

try {
  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL DEFAULT 'website-subscribe-form',
      community TEXT NOT NULL,
      subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at ON subscribers (subscribed_at DESC)`
  await sql`
    CREATE TABLE IF NOT EXISTS hackathon_sponsor_applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_name TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      website TEXT,
      message TEXT,
      source TEXT NOT NULL DEFAULT 'website-hackathon-sponsor-form',
      community TEXT NOT NULL,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_hackathon_sponsor_applications_email ON hackathon_sponsor_applications (email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_hackathon_sponsor_applications_submitted_at ON hackathon_sponsor_applications (submitted_at DESC)`
  console.log('✓ Schema created successfully')
} catch (err) {
  console.error('Schema setup failed:', err.message)
  process.exit(1)
}

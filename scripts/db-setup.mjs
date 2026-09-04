#!/usr/bin/env node
/**
 * Run this to create mailing-list + hackathon tables in Neon/Postgres.
 * Loads .env.local for POSTGRES_URL or DATABASE_URL.
 *
 *   pnpm db:setup
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

  await sql`
    CREATE TABLE IF NOT EXISTS hackathon_credit_claims (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL,
      sponsor_id TEXT NOT NULL,
      claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(email, sponsor_id)
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_hackathon_credit_claims_email ON hackathon_credit_claims (email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_hackathon_credit_claims_sponsor ON hackathon_credit_claims (sponsor_id)`

  await sql`
    CREATE TABLE IF NOT EXISTS hackathon_referral_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sponsor_id TEXT NOT NULL,
      code TEXT NOT NULL,
      claimed_by TEXT,
      claimed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(sponsor_id, code)
    )
  `
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_hackathon_referral_codes_one_per_email
    ON hackathon_referral_codes (sponsor_id, claimed_by)
    WHERE claimed_by IS NOT NULL
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_hackathon_referral_codes_unclaimed
    ON hackathon_referral_codes (sponsor_id, created_at)
    WHERE claimed_by IS NULL
  `

  await sql`
    CREATE TABLE IF NOT EXISTS hackathon_project_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      project_title TEXT NOT NULL,
      project_description TEXT NOT NULL,
      github_url TEXT NOT NULL,
      demo_recording_url TEXT NOT NULL,
      live_demo_url TEXT NOT NULL,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_hackathon_project_submissions_submitted_at
    ON hackathon_project_submissions (submitted_at DESC)
  `

  await sql`
    CREATE TABLE IF NOT EXISTS hackathon_project_reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      submission_id UUID NOT NULL REFERENCES hackathon_project_submissions (id) ON DELETE CASCADE,
      judge_email TEXT NOT NULL,
      score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (judge_email, submission_id)
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_hackathon_project_reviews_submission
    ON hackathon_project_reviews (submission_id)
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_hackathon_project_reviews_judge
    ON hackathon_project_reviews (judge_email)
  `

  await sql`
    CREATE TABLE IF NOT EXISTS hackathon_project_favorites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      submission_id UUID NOT NULL REFERENCES hackathon_project_submissions (id) ON DELETE CASCADE,
      user_email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_email, submission_id)
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_hackathon_project_favorites_submission
    ON hackathon_project_favorites (submission_id)
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_hackathon_project_favorites_user
    ON hackathon_project_favorites (user_email)
  `

  console.log('✓ Schema created successfully')
} catch (err) {
  console.error('Schema setup failed:', err.message)
  process.exit(1)
}

-- Run this in your Vercel Postgres / Neon database after provisioning.
-- Schema for mailing list subscribers.

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'website-subscribe-form',
  community TEXT NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at ON subscribers (subscribed_at DESC);

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
);

CREATE INDEX IF NOT EXISTS idx_hackathon_sponsor_applications_email ON hackathon_sponsor_applications (email);
CREATE INDEX IF NOT EXISTS idx_hackathon_sponsor_applications_submitted_at ON hackathon_sponsor_applications (submitted_at DESC);

-- Hackathon credit claims — tracks which attendees claimed shared (env) sponsor codes.
CREATE TABLE IF NOT EXISTS hackathon_credit_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  sponsor_id TEXT NOT NULL,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email, sponsor_id)
);

CREATE INDEX IF NOT EXISTS idx_hackathon_credit_claims_email ON hackathon_credit_claims (email);
CREATE INDEX IF NOT EXISTS idx_hackathon_credit_claims_sponsor ON hackathon_credit_claims (sponsor_id);

-- Unique one-by-one codes (e.g. Cursor referral links). First claimant wins each row.
CREATE TABLE IF NOT EXISTS hackathon_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id TEXT NOT NULL,
  code TEXT NOT NULL,
  claimed_by TEXT,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sponsor_id, code)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_hackathon_referral_codes_one_per_email
  ON hackathon_referral_codes (sponsor_id, claimed_by)
  WHERE claimed_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_hackathon_referral_codes_unclaimed
  ON hackathon_referral_codes (sponsor_id, created_at)
  WHERE claimed_by IS NULL;

-- Hackathon project submissions — one row per checked-in attendee email (upsert on resubmit).
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
);

CREATE INDEX IF NOT EXISTS idx_hackathon_project_submissions_submitted_at
  ON hackathon_project_submissions (submitted_at DESC);

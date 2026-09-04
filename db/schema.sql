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

-- Unique $50 Cursor Pro referral links (separate pool from $20 Cursor referrals).
-- Legacy table name — pool is Cursor $50 credits, not Grok Bot.
CREATE TABLE IF NOT EXISTS hackathon_grok_bot_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  claimed_by TEXT,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_hackathon_grok_bot_referral_codes_one_per_email
  ON hackathon_grok_bot_referral_codes (claimed_by)
  WHERE claimed_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_hackathon_grok_bot_referral_codes_unclaimed
  ON hackathon_grok_bot_referral_codes (created_at)
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

-- Judge reviews — one score (1–10) per judge email per submission (upsert).
CREATE TABLE IF NOT EXISTS hackathon_project_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES hackathon_project_submissions (id) ON DELETE CASCADE,
  judge_email TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (judge_email, submission_id)
);

CREATE INDEX IF NOT EXISTS idx_hackathon_project_reviews_submission
  ON hackathon_project_reviews (submission_id);

CREATE INDEX IF NOT EXISTS idx_hackathon_project_reviews_judge
  ON hackathon_project_reviews (judge_email);

-- Community favorites — max 3 per user enforced in API; one row per user+submission.
CREATE TABLE IF NOT EXISTS hackathon_project_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES hackathon_project_submissions (id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_email, submission_id)
);

CREATE INDEX IF NOT EXISTS idx_hackathon_project_favorites_submission
  ON hackathon_project_favorites (submission_id);

CREATE INDEX IF NOT EXISTS idx_hackathon_project_favorites_user
  ON hackathon_project_favorites (user_email);

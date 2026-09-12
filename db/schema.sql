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

-- Hackathon project submissions — one row per team (submitter email unique).
-- Each person may appear on at most one row (submitter or teammate_emails).
CREATE TABLE IF NOT EXISTS hackathon_project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  github_url TEXT NOT NULL,
  demo_recording_url TEXT NOT NULL,
  live_demo_url TEXT NOT NULL,
  teammate_emails TEXT[] NOT NULL DEFAULT '{}',
  teammate_names TEXT[] NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hackathon_project_submissions_submitted_at
  ON hackathon_project_submissions (submitted_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_hackathon_project_submissions_github_url_lower
  ON hackathon_project_submissions (lower(github_url));

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

-- Community favorites — max 3 per checked-in user enforced in API; one row per user+submission.
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

-- Judge marks scoring finished (scores freeze). One row per judge email.
CREATE TABLE IF NOT EXISTS hackathon_judge_locks (
  judge_email TEXT PRIMARY KEY,
  finished_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Singleton: admin publishes judge winners to the public gallery.
CREATE TABLE IF NOT EXISTS hackathon_judge_results_publish (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  published BOOLEAN NOT NULL DEFAULT false,
  published_by TEXT,
  published_at TIMESTAMPTZ
);

-- Demo showcase bookings: 12 ten-minute slots from 17:00 to 19:00 (index 0–11).
CREATE TABLE IF NOT EXISTS hackathon_showcase_slots (
  slot_index INTEGER PRIMARY KEY CHECK (slot_index >= 0 AND slot_index < 12),
  team_name TEXT NOT NULL,
  team_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Singleton: admin closes the public submit form (default open when no row).
CREATE TABLE IF NOT EXISTS hackathon_submissions_gate (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  closed BOOLEAN NOT NULL DEFAULT false,
  updated_by TEXT,
  updated_at TIMESTAMPTZ
);

-- Final judge-panel top 3 (manual confirm / tie break). One row per place.
-- Written only after every judge has marked scoring finished.
CREATE TABLE IF NOT EXISTS hackathon_judge_final_top3 (
  place INTEGER NOT NULL CHECK (place IN (1, 2, 3)),
  submission_id UUID NOT NULL REFERENCES hackathon_project_submissions (id) ON DELETE CASCADE,
  set_by_email TEXT NOT NULL,
  set_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (place),
  UNIQUE (submission_id)
);

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

-- Hackathon credit claims — tracks which checked-in attendees claimed sponsor codes.
CREATE TABLE IF NOT EXISTS hackathon_credit_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  sponsor_id TEXT NOT NULL,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email, sponsor_id)
);

CREATE INDEX IF NOT EXISTS idx_hackathon_credit_claims_email ON hackathon_credit_claims (email);
CREATE INDEX IF NOT EXISTS idx_hackathon_credit_claims_sponsor ON hackathon_credit_claims (sponsor_id);

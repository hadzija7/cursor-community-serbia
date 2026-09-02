/**
 * Shared promo codes (same value for every claimant) live in env vars.
 * Unique one-by-one codes (e.g. Cursor referral links) live in
 * `hackathon_referral_codes` and are assigned on claim.
 */

const SHARED_SPONSOR_CODE_ENV_MAP: Record<string, string> = {
  daytona: 'CREDIT_CODE_DAYTONA',
  exa: 'CREDIT_CODE_EXA',
  fal: 'CREDIT_CODE_FAL',
  wispr: 'CREDIT_CODE_WISPR',
  wonder: 'CREDIT_CODE_WONDER',
  netlify: 'CREDIT_CODE_NETLIFY',
  firecrawl: 'CREDIT_CODE_FIRECRAWL',
  convex: 'CREDIT_CODE_CONVEX',
  elevenlabs: 'CREDIT_CODE_ELEVENLABS',
  render: 'CREDIT_CODE_RENDER',
}

/** Sponsors that issue unique codes from the DB pool (first claim wins). */
const POOL_SPONSOR_IDS = new Set(['cursor'])

export function isPoolSponsor(sponsorId: string): boolean {
  return POOL_SPONSOR_IDS.has(sponsorId)
}

export function getSharedCreditCode(sponsorId: string): string | null {
  const envKey = SHARED_SPONSOR_CODE_ENV_MAP[sponsorId]
  if (!envKey) return null
  return process.env[envKey]?.trim() || null
}

/** @deprecated Prefer getSharedCreditCode; kept for call sites that only need shared codes. */
export function getCreditCode(sponsorId: string): string | null {
  return getSharedCreditCode(sponsorId)
}

export function hasSharedCreditCode(sponsorId: string): boolean {
  return getSharedCreditCode(sponsorId) !== null
}

export function hasCreditCode(sponsorId: string): boolean {
  return isPoolSponsor(sponsorId) || hasSharedCreditCode(sponsorId)
}

export function getSponsorIdsWithCodes(): string[] {
  const shared = Object.keys(SHARED_SPONSOR_CODE_ENV_MAP).filter(hasSharedCreditCode)
  const pool = [...POOL_SPONSOR_IDS]
  return [...new Set([...shared, ...pool])]
}

/**
 * Shared promo codes (same value for every claimant) live in env vars.
 * Unique $20 Cursor Pro referrals live in `hackathon_referral_codes`.
 * Unique $50 Cursor Pro referrals live in `hackathon_grok_bot_referral_codes`
 * (legacy table name — $50 Cursor pool, not Grok Bot).
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

/** Claim keys that issue unique codes from a DB pool (first claim wins). */
export const CURSOR_POOL_ID = 'cursor'
export const CURSOR_50_POOL_ID = 'cursor-50'

const POOL_SPONSOR_IDS = new Set([CURSOR_POOL_ID, CURSOR_50_POOL_ID])

export type ReferralPoolId = typeof CURSOR_POOL_ID | typeof CURSOR_50_POOL_ID

export function isPoolSponsor(sponsorId: string): sponsorId is ReferralPoolId {
  return POOL_SPONSOR_IDS.has(sponsorId)
}

export function isCursor50Pool(sponsorId: string): boolean {
  return sponsorId === CURSOR_50_POOL_ID
}

export function isCursorPool(sponsorId: string): boolean {
  return sponsorId === CURSOR_POOL_ID
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

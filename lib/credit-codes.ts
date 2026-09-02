/**
 * Map sponsor IDs to their credit code environment variable names.
 * Codes are stored as env vars so they stay secret and can be rotated.
 */
const SPONSOR_CODE_ENV_MAP: Record<string, string> = {
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

export function getCreditCode(sponsorId: string): string | null {
  const envKey = SPONSOR_CODE_ENV_MAP[sponsorId]
  if (!envKey) return null
  return process.env[envKey]?.trim() || null
}

export function hasCreditCode(sponsorId: string): boolean {
  return getCreditCode(sponsorId) !== null
}

export function getSponsorIdsWithCodes(): string[] {
  return Object.keys(SPONSOR_CODE_ENV_MAP).filter(hasCreditCode)
}

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  CURSOR_POOL_ID,
  CURSOR_50_POOL_ID,
  getSharedCreditCode,
  getSponsorIdsWithCodes,
  hasCreditCode,
  isCreditClaimSponsor,
  isCursor50Pool,
  isCursorPool,
  isPoolSponsor,
} from '@/lib/credit-codes'

describe('credit-codes pools', () => {
  const previousXai = process.env.CREDIT_CODE_XAI

  afterEach(() => {
    if (previousXai === undefined) {
      delete process.env.CREDIT_CODE_XAI
    } else {
      process.env.CREDIT_CODE_XAI = previousXai
    }
  })

  it('treats $20 and $50 Cursor referrals as separate unique pools', () => {
    expect(isPoolSponsor(CURSOR_POOL_ID)).toBe(true)
    expect(isPoolSponsor(CURSOR_50_POOL_ID)).toBe(true)
    expect(isCursorPool(CURSOR_POOL_ID)).toBe(true)
    expect(isCursor50Pool(CURSOR_50_POOL_ID)).toBe(true)
    expect(isCursorPool(CURSOR_50_POOL_ID)).toBe(false)
    expect(isCursor50Pool(CURSOR_POOL_ID)).toBe(false)
    expect(hasCreditCode(CURSOR_POOL_ID)).toBe(true)
    expect(hasCreditCode(CURSOR_50_POOL_ID)).toBe(true)
    expect(getSponsorIdsWithCodes()).toEqual(
      expect.arrayContaining([CURSOR_POOL_ID, CURSOR_50_POOL_ID]),
    )
  })

  it('does not treat Convex as a credit-claim sponsor', () => {
    expect(isCreditClaimSponsor('convex')).toBe(false)
    expect(isCreditClaimSponsor('daytona')).toBe(true)
    expect(isCreditClaimSponsor('fal')).toBe(true)
    expect(isCreditClaimSponsor('wispr')).toBe(true)
    expect(isCreditClaimSponsor('xai')).toBe(true)
  })

  it('maps xai to CREDIT_CODE_XAI and reads the value from env only', () => {
    delete process.env.CREDIT_CODE_XAI
    expect(getSharedCreditCode('xai')).toBeNull()

    process.env.CREDIT_CODE_XAI = 'env-driven-test-value'
    expect(getSharedCreditCode('xai')).toBe('env-driven-test-value')
  })

  it('does not embed a literal xai promo code in claim source', () => {
    const creditCodesSrc = readFileSync(resolve(process.cwd(), 'lib/credit-codes.ts'), 'utf8')
    const claimRouteSrc = readFileSync(
      resolve(process.cwd(), 'app/api/hackathon/claim-credits/route.ts'),
      'utf8',
    )

    expect(creditCodesSrc).toContain("xai: 'CREDIT_CODE_XAI'")
    expect(creditCodesSrc).toMatch(/process\.env\[envKey\]/)
    expect(creditCodesSrc).not.toMatch(/CREDIT_CODE_XAI\s*=\s*['"`][^'"`]+['"`]/)
    expect(claimRouteSrc).toContain('getSharedCreditCode')
    expect(claimRouteSrc).not.toMatch(/CREDIT_CODE_XAI\s*=\s*['"`][^'"`]+['"`]/)
  })
})

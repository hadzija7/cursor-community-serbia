import { describe, expect, it } from 'vitest'
import {
  CURSOR_POOL_ID,
  CURSOR_50_POOL_ID,
  getSponsorIdsWithCodes,
  hasCreditCode,
  isCursor50Pool,
  isCursorPool,
  isPoolSponsor,
} from '@/lib/credit-codes'

describe('credit-codes pools', () => {
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
})

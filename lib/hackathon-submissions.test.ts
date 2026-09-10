import { describe, expect, it } from 'vitest'
import { submissionsAreOpen } from '@/lib/hackathon-submissions'

describe('submissionsAreOpen', () => {
  it('treats a missing gate as open', () => {
    expect(submissionsAreOpen(undefined)).toBe(true)
    expect(submissionsAreOpen(null)).toBe(true)
    expect(submissionsAreOpen(false)).toBe(true)
  })

  it('is closed only when the flag is true', () => {
    expect(submissionsAreOpen(true)).toBe(false)
  })
})

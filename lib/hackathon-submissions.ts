/** Missing row / missing table → submissions stay open. */
export function submissionsAreOpen(closed: boolean | null | undefined): boolean {
  return closed !== true
}

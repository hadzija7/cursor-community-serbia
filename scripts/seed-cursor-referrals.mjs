#!/usr/bin/env node
/**
 * Seed Cursor referral links into hackathon_referral_codes (idempotent).
 *
 *   pnpm db:seed:cursor-referrals
 *
 * Reads db/data/cursor-referrals.txt (gitignored; one URL or code per line).
 * Copy from cursor-referrals.txt.example — never commit live referral URLs.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'

const SPONSOR_ID = 'cursor'
const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL
if (!url) {
  console.error('Missing POSTGRES_URL or DATABASE_URL. Use --env-file=.env.local')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = join(root, 'db/data/cursor-referrals.txt')
const raw = readFileSync(dataPath, 'utf8')
const codes = [
  ...new Set(
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#')),
  ),
]

if (codes.length === 0) {
  console.error(`No codes found in ${dataPath}`)
  process.exit(1)
}

const sql = neon(url)

let inserted = 0
let skipped = 0

for (const code of codes) {
  const rows = await sql`
    INSERT INTO hackathon_referral_codes (sponsor_id, code)
    VALUES (${SPONSOR_ID}, ${code})
    ON CONFLICT (sponsor_id, code) DO NOTHING
    RETURNING id
  `
  if (rows.length > 0) inserted += 1
  else skipped += 1
}

const [{ total, unclaimed }] = await sql`
  SELECT
    count(*)::int AS total,
    count(*) FILTER (WHERE claimed_by IS NULL)::int AS unclaimed
  FROM hackathon_referral_codes
  WHERE sponsor_id = ${SPONSOR_ID}
`

console.log(
  `✓ Cursor referrals: ${inserted} inserted, ${skipped} already present (${total} total, ${unclaimed} unclaimed)`,
)

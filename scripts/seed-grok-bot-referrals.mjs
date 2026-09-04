#!/usr/bin/env node
/**
 * Seed $50 Cursor referral links into hackathon_grok_bot_referral_codes (idempotent).
 * (Legacy table name — this is the $50 Cursor pool, not Grok Bot.)
 *
 *   pnpm db:seed:grok-bot-referrals
 *
 * Reads db/data/grok-bot-referrals.csv (preferred) or grok-bot-referrals.txt.
 * Both are gitignored — never commit live referral URLs.
 *
 * CSV format (header required):
 *   Code,URL
 *   NOVISAD-XXXX,https://cursor.com/referral?code=NOVISAD-XXXX
 *
 * TXT format: one URL or code per line (# comments allowed).
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL
if (!url) {
  console.error('Missing POSTGRES_URL or DATABASE_URL. Use --env-file=.env.local')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const csvPath = join(root, 'db/data/grok-bot-referrals.csv')
const txtPath = join(root, 'db/data/grok-bot-referrals.txt')

function parseCsv(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))

  if (lines.length === 0) return []

  const [header, ...rows] = lines
  const cols = header.split(',').map((c) => c.trim().toLowerCase())
  const urlIdx = cols.indexOf('url')
  const codeIdx = cols.indexOf('code')

  if (urlIdx === -1 && codeIdx === -1) {
    // No header — treat every non-empty cell that looks like a URL/code as a value
    return lines.flatMap((line) =>
      line
        .split(',')
        .map((cell) => cell.trim())
        .filter(Boolean),
    )
  }

  return rows
    .map((line) => {
      const cells = line.split(',').map((c) => c.trim())
      const fromUrl = urlIdx >= 0 ? cells[urlIdx] : ''
      const fromCode = codeIdx >= 0 ? cells[codeIdx] : ''
      return fromUrl || fromCode || ''
    })
    .filter(Boolean)
}

function parseTxt(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

let codes = []
let sourcePath = ''

if (existsSync(csvPath)) {
  codes = parseCsv(readFileSync(csvPath, 'utf8'))
  sourcePath = csvPath
} else if (existsSync(txtPath)) {
  codes = parseTxt(readFileSync(txtPath, 'utf8'))
  sourcePath = txtPath
} else {
  console.error(
    `Missing seed file. Add ${csvPath} (or ${txtPath}). See grok-bot-referrals.csv.example`,
  )
  process.exit(1)
}

codes = [...new Set(codes)]

if (codes.length === 0) {
  console.error(`No codes found in ${sourcePath}`)
  process.exit(1)
}

const sql = neon(url)

await sql`
  CREATE TABLE IF NOT EXISTS hackathon_grok_bot_referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    claimed_by TEXT,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`
await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_hackathon_grok_bot_referral_codes_one_per_email
  ON hackathon_grok_bot_referral_codes (claimed_by)
  WHERE claimed_by IS NOT NULL
`
await sql`
  CREATE INDEX IF NOT EXISTS idx_hackathon_grok_bot_referral_codes_unclaimed
  ON hackathon_grok_bot_referral_codes (created_at)
  WHERE claimed_by IS NULL
`

let inserted = 0
let skipped = 0

for (const code of codes) {
  const rows = await sql`
    INSERT INTO hackathon_grok_bot_referral_codes (code)
    VALUES (${code})
    ON CONFLICT (code) DO NOTHING
    RETURNING id
  `
  if (rows.length > 0) inserted += 1
  else skipped += 1
}

const [{ total, unclaimed }] = await sql`
  SELECT
    count(*)::int AS total,
    count(*) FILTER (WHERE claimed_by IS NULL)::int AS unclaimed
  FROM hackathon_grok_bot_referral_codes
`

console.log(
  `✓ $50 Cursor referrals: ${inserted} inserted, ${skipped} already present (${total} total, ${unclaimed} unclaimed) from ${sourcePath}`,
)

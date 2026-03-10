#!/usr/bin/env node
/**
 * Quick query to list subscribers (for testing).
 *   node --env-file=.env.local scripts/db-query.mjs
 */
import { neon } from '@neondatabase/serverless'

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL
if (!url) {
  console.error('Missing POSTGRES_URL or DATABASE_URL')
  process.exit(1)
}

const sql = neon(url)
const rows = await sql`SELECT email, community, subscribed_at FROM subscribers ORDER BY subscribed_at DESC LIMIT 10`
console.table(rows)

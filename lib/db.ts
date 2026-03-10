import { neon } from '@neondatabase/serverless'

/** Postgres connection URL from Vercel Postgres / Neon integration */
const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL

export function getDb() {
  if (!url) return null
  return neon(url)
}

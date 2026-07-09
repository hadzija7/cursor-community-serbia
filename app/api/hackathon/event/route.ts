import { NextResponse } from 'next/server'
import { resolveHackathonDetails } from '@/lib/hackathon-details'

export const dynamic = 'force-dynamic'

export async function GET() {
  const details = await resolveHackathonDetails()
  return NextResponse.json(details)
}

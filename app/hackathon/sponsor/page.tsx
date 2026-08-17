import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getHackathonBasePath, hackathonHref } from '@/lib/hackathon-site'

export default async function HackathonSponsorPage() {
  const host = (await headers()).get('host')
  const overviewHref = hackathonHref(getHackathonBasePath(host), 'overview')
  redirect(`${overviewHref}#become-a-sponsor`)
}

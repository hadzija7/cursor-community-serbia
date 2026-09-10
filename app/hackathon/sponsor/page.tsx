import { redirect } from 'next/navigation'

/** Legacy `/sponsor` bookmarks → Overview special thanks. */
export default function HackathonSponsorPage() {
  redirect('/hackathon#special-thanks')
}

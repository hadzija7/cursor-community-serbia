import { hackathonConfig } from '@/content/hackathon'
import { extractLumaSlug, fetchLumaEventBySlug } from '@/lib/luma'

export type HackathonDetails = {
  title: string
  tagline: string
  date: string
  displayDate: string
  location: string
  duration: string
  lumaUrl: string
  source: 'luma' | 'static'
}

export type HackathonDetailsFallback = Pick<
  typeof hackathonConfig,
  'title' | 'tagline' | 'date' | 'displayDate' | 'location' | 'duration' | 'lumaUrl'
>

/** Resolve hackathon date/location from Luma, falling back to static content. */
export async function resolveHackathonDetails(
  fallback: HackathonDetailsFallback = hackathonConfig,
): Promise<HackathonDetails> {
  const base: HackathonDetails = {
    title: fallback.title,
    tagline: fallback.tagline,
    date: fallback.date,
    displayDate: fallback.displayDate,
    location: fallback.location,
    duration: fallback.duration,
    lumaUrl: fallback.lumaUrl,
    source: 'static',
  }

  const slug = extractLumaSlug(fallback.lumaUrl)
  if (!slug) return base

  try {
    const event = await fetchLumaEventBySlug(slug)
    if (!event) return base

    return {
      ...base,
      date: event.date,
      displayDate: event.displayDate,
      location: event.location,
      lumaUrl: event.lumaUrl ?? fallback.lumaUrl,
      source: 'luma',
    }
  } catch {
    return base
  }
}

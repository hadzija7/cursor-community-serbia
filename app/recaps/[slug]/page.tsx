import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EventRecap from '@/components/EventRecap'
import Navbar from '@/components/Navbar'
import JsonLd from '@/components/JsonLd'
import { recapsBySlug } from '@/content/recaps'
import { siteConfig } from '@/content/site.config'
import { getRecapYoutubePresentationCards } from '@/lib/recap-youtube'
import { parseYouTubeVideoId } from '@/lib/youtube-embed'

interface RecapPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: RecapPageProps): Promise<Metadata> {
  const { slug } = await params
  const recap = recapsBySlug[slug]
  if (!recap) return {}

  const description = recap.summary[0] || `Recap of ${recap.title}`
  const presentationVideoId = recap.videoUrl ? parseYouTubeVideoId(recap.videoUrl) : null
  const ogImageUrl = presentationVideoId
    ? `https://i.ytimg.com/vi/${presentationVideoId}/hqdefault.jpg`
    : recap.photos[0]?.src

  return {
    title: `${recap.title} | ${siteConfig.communityName}`,
    description,
    openGraph: {
      title: recap.title,
      description,
      type: 'article',
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                alt: presentationVideoId ? recap.title : recap.photos[0]?.alt ?? recap.title,
              },
            ],
          }
        : {}),
    },
  }
}

function buildRecapJsonLd(slug: string) {
  const recap = recapsBySlug[slug]
  if (!recap) return null

  const presentationVideoId = recap.videoUrl ? parseYouTubeVideoId(recap.videoUrl) : null
  const primaryImage = presentationVideoId
    ? `https://i.ytimg.com/vi/${presentationVideoId}/hqdefault.jpg`
    : recap.photos[0]?.src

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: recap.title,
    startDate: recap.date,
    description: recap.summary[0] || '',
    organizer: {
      '@type': 'Organization',
      name: siteConfig.communityName,
    },
    ...(recap.attendees
      ? { maximumAttendeeCapacity: recap.attendees }
      : {}),
    ...(recap.host
      ? {
          location: {
            '@type': 'Place',
            name: recap.host.name,
          },
        }
      : {}),
    ...(primaryImage ? { image: primaryImage } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  }
}

export default async function RecapPage({ params }: RecapPageProps) {
  const { slug } = await params
  const recap = recapsBySlug[slug]
  if (!recap) {
    notFound()
  }

  const jsonLd = buildRecapJsonLd(slug)
  const youtubePresentationCards = await getRecapYoutubePresentationCards(recap)

  return (
    <main className="min-h-screen bg-cursor-bg text-cursor-text">
      {jsonLd && <JsonLd data={jsonLd} />}
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-12">
        <EventRecap recap={recap} youtubePresentationCards={youtubePresentationCards} />
      </div>
    </main>
  )
}

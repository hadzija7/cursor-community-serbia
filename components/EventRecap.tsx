'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'
import PhotoGallery from '@/components/PhotoGallery'
import type { RecapData, YouTubeCardMeta } from '@/lib/types'
import { useI18n } from '@/lib/i18n'
import { parseYouTubeVideoId, toYouTubeEmbedUrl } from '@/lib/youtube-embed'

interface EventRecapProps {
  recap: RecapData
  youtubePresentationCards?: Array<{ youtubeUrl: string; meta: YouTubeCardMeta }>
}

function embedWithAutoplay(embedUrl: string) {
  try {
    const u = new URL(embedUrl)
    u.searchParams.set('autoplay', '1')
    return u.toString()
  } catch {
    return `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`
  }
}

function LazyYouTubePlayer({
  youtubeUrl,
  thumbnailUrl,
  iframeTitle,
  playLabel,
  priority,
  imageSizes,
}: {
  youtubeUrl: string
  thumbnailUrl?: string
  iframeTitle: string
  playLabel: string
  priority?: boolean
  imageSizes?: string
}) {
  const [started, setStarted] = useState(false)
  const embed = toYouTubeEmbedUrl(youtubeUrl)
  if (!embed) {
    return <p className="text-sm text-cursor-text-muted">Unsupported video URL.</p>
  }

  const showPoster = Boolean(thumbnailUrl && !started)

  return (
    <div className="rounded-lg overflow-hidden border border-cursor-border aspect-video relative bg-black">
      {showPoster ? (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="absolute inset-0 group flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cursor-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B1913]"
          aria-label={playLabel}
        >
          <Image
            src={thumbnailUrl!}
            alt=""
            fill
            className="object-cover"
            sizes={imageSizes ?? '(min-width: 1024px) 896px, 100vw'}
            priority={Boolean(priority)}
          />
          <span className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" aria-hidden />
          <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black shadow-lg group-hover:scale-105 transition-transform">
            <Play className="h-8 w-8 fill-current ml-1" aria-hidden />
          </span>
        </button>
      ) : (
        <iframe
          src={started ? embedWithAutoplay(embed) : embed}
          title={iframeTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  )
}

function YoutubePresentationCard({
  youtubeUrl,
  meta,
  playLabel,
  priority,
}: {
  youtubeUrl: string
  meta: YouTubeCardMeta
  playLabel: string
  priority?: boolean
}) {
  return (
    <article className="flex flex-col rounded-lg overflow-hidden border border-cursor-border bg-[#14120b] h-full">
      <LazyYouTubePlayer
        youtubeUrl={youtubeUrl}
        thumbnailUrl={meta.thumbnailUrl}
        iframeTitle={meta.title}
        playLabel={playLabel}
        priority={priority}
        imageSizes="(min-width: 768px) min(440px, 45vw), 100vw"
      />
      <div className="p-4 space-y-2 border-t border-cursor-border flex-1 flex flex-col">
        <h4 className="text-base font-semibold text-cursor-text leading-snug">{meta.title}</h4>
        {meta.description ? (
          <p className="text-sm text-cursor-text-muted leading-relaxed line-clamp-6 whitespace-pre-line flex-1">
            {meta.description}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export default function EventRecap({ recap, youtubePresentationCards }: EventRecapProps) {
  const { t } = useI18n()
  const youtubeMainEmbed = recap.videoUrl ? toYouTubeEmbedUrl(recap.videoUrl) : null
  const presentationIframeSrc =
    youtubeMainEmbed ?? (recap.videoUrl?.startsWith('http') ? recap.videoUrl : null)
  const legacyNonYoutubeMain = Boolean(recap.videoUrl && !parseYouTubeVideoId(recap.videoUrl))
  const youtubeGridCount = youtubePresentationCards?.length ?? 0
  const showPresentationSection = legacyNonYoutubeMain || youtubeGridCount > 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="bg-[#1B1913] border border-cursor-border rounded-lg p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-cursor-text-muted hover:text-cursor-text transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h2 className="text-xl font-semibold text-cursor-text mb-2">{recap.title}</h2>
        <p className="text-cursor-text-muted text-sm mb-6">{recap.date}</p>

        {recap.host ? (
          <div className="text-cursor-text-muted text-sm mb-6 flex items-center gap-2">
            <span>{t('home.hostedBy')}</span>
            <a
              href={recap.host.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cursor-text hover:underline inline-flex items-center gap-1.5"
            >
              <Image src={recap.host.logo} alt={recap.host.name} width={18} height={18} className="rounded-full" />
              {recap.host.name}
            </a>
          </div>
        ) : null}

        {recap.attendees ? (
          <p className="text-cursor-text text-lg leading-relaxed mb-4">{t('home.attendees', { count: String(recap.attendees) })}</p>
        ) : null}
        <div className="text-cursor-text-muted text-sm leading-relaxed space-y-3">
          {recap.summary.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {showPresentationSection ? (
          <div className="border-t border-cursor-border mt-6 pt-6">
            <h3 className="text-lg font-semibold text-cursor-text mb-1">{t('recap.presentationTitle')}</h3>
            <p className="text-cursor-text-muted text-sm mb-4">{t('recap.presentationSubtitle')}</p>

            {legacyNonYoutubeMain && recap.videoUrl ? (
              <>
                {presentationIframeSrc ? (
                  <div className="rounded-lg overflow-hidden border border-cursor-border aspect-video relative bg-black">
                    <iframe
                      src={presentationIframeSrc}
                      title={t('recap.presentationTitle')}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden border border-cursor-border aspect-video relative bg-black">
                    <video
                      src={recap.videoUrl}
                      controls
                      preload="metadata"
                      className="w-full h-full"
                      playsInline
                      poster={recap.videoThumbnailUrl}
                    />
                  </div>
                )}
              </>
            ) : null}

            {youtubeGridCount > 0 ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${legacyNonYoutubeMain ? 'mt-6' : ''}`}
              >
                {youtubePresentationCards!.map((card, index) => (
                  <YoutubePresentationCard
                    key={card.youtubeUrl}
                    youtubeUrl={card.youtubeUrl}
                    meta={card.meta}
                    playLabel={t('recap.playPresentation')}
                    priority={index === 0}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {recap.interviews && recap.interviews.length > 0 ? (
          <div className="border-t border-cursor-border mt-6 pt-6">
            <h3 className="text-lg font-semibold text-cursor-text mb-1">{t('recap.interviewsTitle')}</h3>
            <p className="text-cursor-text-muted text-sm mb-4">{t('recap.interviewsSubtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recap.interviews.map((item) => {
                const embed = toYouTubeEmbedUrl(item.youtubeUrl)
                return (
                  <div key={`${item.title}-${item.youtubeUrl}`} className="space-y-2">
                    <p className="text-sm font-medium text-cursor-text">{item.title}</p>
                    {embed ? (
                      <div className="rounded-lg overflow-hidden border border-cursor-border aspect-video">
                        <iframe
                          src={embed}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-cursor-text-muted">Unsupported video URL.</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        <PhotoGallery photos={recap.photos} embedded />

        {recap.photoCredits && recap.photoCredits.length > 0 ? (
          <div className="border-t border-cursor-border mt-6 pt-6 text-sm text-cursor-text-muted">
            <span className="mr-1">Photo credits:</span>
            {recap.photoCredits.map((credit, index) => (
              <span key={`${credit.name}-${index}`}>
                {credit.url ? (
                  <a href={credit.url} target="_blank" rel="noopener noreferrer" className="text-cursor-text hover:underline">
                    {credit.name}
                  </a>
                ) : (
                  <span className="text-cursor-text">{credit.name}</span>
                )}
                {index < recap.photoCredits!.length - 1 ? <span>, </span> : <span>.</span>}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.section>
  )
}

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
import { toDrivePreviewEmbedUrl, toDriveVideoSrc } from '@/lib/drive-embed'

interface EventRecapProps {
  recap: RecapData
  /** Main event recording (`recap.videoUrl` when YouTube). */
  youtubeVideoRecapCards?: Array<{ youtubeUrl: string; meta: YouTubeCardMeta }>
  /** Extra session recordings (`recap.extraPresentations`). */
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

function VideoEmbedFrame({ src, title }: { src: string; title: string }) {
  const [useIframeFallback, setUseIframeFallback] = useState(false)
  const youtubeEmbed = toYouTubeEmbedUrl(src)
  const driveVideoSrc = toDriveVideoSrc(src)
  const drivePreviewSrc = toDrivePreviewEmbedUrl(src)

  if (youtubeEmbed) {
    return (
      <div className="rounded-lg overflow-hidden border border-cursor-border aspect-video relative bg-black min-h-0 w-full">
        <iframe
          src={youtubeEmbed}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    )
  }

  if (driveVideoSrc && !useIframeFallback) {
    return (
      <div className="rounded-lg overflow-hidden border border-cursor-border aspect-video relative bg-black min-h-0 w-full">
        <video
          src={driveVideoSrc}
          controls
          preload="metadata"
          playsInline
          title={title}
          onError={() => setUseIframeFallback(true)}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    )
  }

  const embedSrc = drivePreviewSrc ?? (src.startsWith('http') ? src : null)
  if (!embedSrc) {
    return <p className="text-sm text-cursor-text-muted">Unsupported video URL.</p>
  }

  return (
    <div className="rounded-lg overflow-hidden border border-cursor-border aspect-video relative bg-black min-h-0 w-full">
      <iframe
        src={embedSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
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

export default function EventRecap({
  recap,
  youtubeVideoRecapCards,
  youtubePresentationCards,
}: EventRecapProps) {
  const { t } = useI18n()
  const youtubeMainEmbed = recap.videoUrl ? toYouTubeEmbedUrl(recap.videoUrl) : null
  const presentationIframeSrc =
    youtubeMainEmbed ?? (recap.videoUrl?.startsWith('http') ? recap.videoUrl : null)
  const legacyNonYoutubeMain = Boolean(recap.videoUrl && !parseYouTubeVideoId(recap.videoUrl))
  const extraVideoRecapCount = recap.extraVideoRecaps?.length ?? 0
  const videoRecapYoutubeCount = youtubeVideoRecapCards?.length ?? 0
  const presentationYoutubeCount = youtubePresentationCards?.length ?? 0
  const showVideoRecapSection =
    legacyNonYoutubeMain || videoRecapYoutubeCount > 0 || extraVideoRecapCount > 0
  const showPresentationSection = presentationYoutubeCount > 0
  const mainDriveEmbed =
    legacyNonYoutubeMain && presentationIframeSrc ? presentationIframeSrc : null

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

        {showVideoRecapSection ? (
          <div className="border-t border-cursor-border mt-6 pt-6">
            <h3 className="text-lg font-semibold text-cursor-text mb-1">{t('recap.videoRecapTitle')}</h3>
            <p className="text-cursor-text-muted text-sm mb-4">{t('recap.videoRecapSubtitle')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mainDriveEmbed ? (
                <div className="min-w-0">
                  <VideoEmbedFrame src={mainDriveEmbed} title={t('recap.videoRecapTitle')} />
                </div>
              ) : legacyNonYoutubeMain && recap.videoUrl ? (
                <div className="min-w-0">
                  <div className="rounded-lg overflow-hidden border border-cursor-border aspect-video relative bg-black min-h-0 w-full">
                    <video
                      src={recap.videoUrl}
                      controls
                      preload="metadata"
                      playsInline
                      poster={recap.videoThumbnailUrl}
                      title={t('recap.videoRecapTitle')}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  </div>
                </div>
              ) : null}

              {recap.extraVideoRecaps?.map((item) => (
                <div key={item.videoUrl} className="min-w-0">
                  {item.title ? (
                    <p className="text-sm font-medium text-cursor-text mb-2">{item.title}</p>
                  ) : null}
                  <VideoEmbedFrame
                    src={item.videoUrl}
                    title={item.title ?? t('recap.videoRecapTitle')}
                  />
                </div>
              ))}

              {youtubeVideoRecapCards?.map((card, index) => (
                <div key={card.youtubeUrl} className="min-w-0">
                  <YoutubePresentationCard
                    youtubeUrl={card.youtubeUrl}
                    meta={card.meta}
                    playLabel={t('recap.playVideoRecap')}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {showPresentationSection ? (
          <div className="border-t border-cursor-border mt-6 pt-6">
            <h3 className="text-lg font-semibold text-cursor-text mb-1">{t('recap.presentationTitle')}</h3>
            <p className="text-cursor-text-muted text-sm mb-4">{t('recap.presentationSubtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        ) : null}

        {recap.interviews && recap.interviews.length > 0 ? (
          <div className="border-t border-cursor-border mt-6 pt-6">
            <h3 className="text-lg font-semibold text-cursor-text mb-1">{t('recap.interviewsTitle')}</h3>
            <p className="text-cursor-text-muted text-sm mb-4">{t('recap.interviewsSubtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recap.interviews.map((item) => (
                <div key={`${item.title}-${item.youtubeUrl}`} className="min-w-0">
                  <p className="text-sm font-medium text-cursor-text mb-2">{item.title}</p>
                  <VideoEmbedFrame src={item.youtubeUrl} title={item.title} />
                </div>
              ))}
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

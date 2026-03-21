'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PhotoGallery from '@/components/PhotoGallery'
import { RecapData } from '@/lib/types'
import { useI18n } from '@/lib/i18n'
import { toYouTubeEmbedUrl } from '@/lib/youtube-embed'

interface EventRecapProps {
  recap: RecapData
}

export default function EventRecap({ recap }: EventRecapProps) {
  const { t } = useI18n()

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

        {recap.videoUrl && (
          <div className="mt-6 rounded-lg overflow-hidden border border-cursor-border aspect-video">
            {recap.videoUrl.startsWith('http') ? (
              <iframe
                src={recap.videoUrl}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video
                src={recap.videoUrl}
                controls
                preload="metadata"
                className="w-full h-full"
                playsInline
              />
            )}
          </div>
        )}

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

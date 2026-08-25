'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, ArrowRight, ImageIcon } from 'lucide-react'
import { pastEvents } from '@/content/events'
import { useI18n } from '@/lib/i18n'
import SectionEyebrow from '@/components/SectionEyebrow'

export default function PastEvents() {
  const { t, locale } = useI18n()

  const recapEvents = pastEvents.filter((event) => event.recapPath)

  if (recapEvents.length === 0) {
    return null
  }

  return (
    <motion.section
      id="recaps"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-16 scroll-mt-8 w-screen ml-[calc(50%-50vw)]"
    >
      <div className="w-[80vw] mx-auto">
        <SectionEyebrow className="mb-6">{t('home.pastEvents')}</SectionEyebrow>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          aria-label={t('home.pastEvents')}
        >
          {recapEvents.map((event) => {
            const displayDate = new Date(`${event.date}T00:00:00`).toLocaleDateString(locale === 'en' ? 'en-US' : locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })

            return (
              <Link key={event.id} href={event.recapPath!} className="group flex flex-col h-full min-w-0">
                <div className="flex flex-col h-full bg-cursor-bg-dark border border-cursor-border rounded-lg overflow-hidden hover:border-cursor-border-emphasis transition-colors shadow-sm hover:shadow-md">
                  {event.thumbnail ? (
                    <div className="relative aspect-[16/10] w-full bg-gray-800">
                      <Image
                        src={event.thumbnail}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 27vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-cursor-bg-dark to-gray-900 flex items-center justify-center border-b border-cursor-border">
                      <ImageIcon className="w-10 h-10 text-cursor-text-faint" aria-hidden />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-4 md:p-5">
                    <h3 className="text-cursor-text font-semibold text-base md:text-lg leading-snug mb-3 line-clamp-2 group-hover:text-cursor-text-muted transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cursor-text-muted mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{displayDate}</span>
                      </div>
                      {event.attendees ? (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 shrink-0" />
                          <span>{t('home.attendees', { count: String(event.attendees) })}</span>
                        </div>
                      ) : null}
                    </div>
                    {event.host ? (
                      <div className="text-cursor-text-muted text-sm mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>{t('home.hostedBy')}</span>
                        <span className="text-cursor-text inline-flex items-center gap-1.5 min-w-0">
                          <Image src={event.host.logo} alt={event.host.name} width={18} height={18} className="rounded-full shrink-0" />
                          <span className="truncate">{event.host.name}</span>
                        </span>
                      </div>
                    ) : null}
                    <div className="mt-auto flex items-center gap-2 text-sm font-medium text-cursor-text group-hover:text-cursor-text-muted transition-colors pt-3 border-t border-cursor-border/60">
                      <span>{t('home.viewRecap')}</span>
                      <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}

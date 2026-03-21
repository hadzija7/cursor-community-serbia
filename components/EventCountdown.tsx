'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { eventStartMs, isFutureEvent } from '@/lib/event-time'
import type { CursorEvent } from '@/lib/types'

function getTimeLeft(date: string, time = '18:00') {
  const diff = eventStartMs(date, time) - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function nextEvent(events: CursorEvent[]) {
  return events
    .filter(isFutureEvent)
    .sort((a, b) => eventStartMs(a.date, a.time) - eventStartMs(b.date, b.time))[0] ?? null
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-cursor-bg rounded-lg px-4 py-3 sm:px-6 sm:py-4 min-w-[72px] sm:min-w-[96px] border border-cursor-border">
      <span className="text-3xl sm:text-5xl font-semibold tabular-nums text-cursor-text leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-cursor-text-muted mt-1.5">
        {label}
      </span>
    </div>
  )
}

interface Props { events: CursorEvent[] }

export default function EventCountdown({ events }: Props) {
  const { t, locale } = useI18n()
  const [state, setState] = useState<{ event: CursorEvent; time: ReturnType<typeof getTimeLeft> } | null>(null)

  useEffect(() => {
    const tick = () => {
      const ev = nextEvent(events)
      if (!ev) { setState(null); return }
      setState({ event: ev, time: getTimeLeft(ev.date, ev.time) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [events])

  if (!state) return null
  const { event: ev, time } = state

  const shortDate = new Date(`${ev.date}T00:00:00`).toLocaleDateString(
    locale === 'en' ? 'en-US' : locale,
    { year: 'numeric', month: 'long', day: 'numeric' },
  )
  const city = ev.location.split(',')[0].trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative z-10 -mt-24 mx-auto max-w-xl px-6"
    >
      <div className="bg-cursor-bg-dark border border-cursor-border rounded-xl p-6 sm:p-8 text-center shadow-2xl">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-cursor-text">
          {ev.title}
        </h3>
        <p className="text-sm text-cursor-text-muted mt-1">
          {shortDate}
          <span className="mx-1.5">&middot;</span>
          {city}
        </p>

        <div className="flex justify-center gap-2 sm:gap-3 mt-6">
          <CountdownBlock value={time.days} label={t('countdown.days')} />
          <CountdownBlock value={time.hours} label={t('countdown.hours')} />
          <CountdownBlock value={time.minutes} label={t('countdown.minutes')} />
          <CountdownBlock value={time.seconds} label={t('countdown.seconds')} />
        </div>

        {ev.lumaUrl && (
          <a
            href={ev.lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-cursor-text text-cursor-bg rounded-lg hover:bg-cursor-text-muted transition-colors text-sm font-medium"
          >
            {t('home.register')}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

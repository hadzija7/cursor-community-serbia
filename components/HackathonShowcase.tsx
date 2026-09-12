'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import type { ShowcaseBookedSlot, ShowcaseSlotJson } from '@/app/api/hackathon/showcase/route'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const inputClassName =
  'w-full rounded-md border border-cursor-border bg-cursor-surface px-4 py-3 text-cursor-text placeholder:text-cursor-text-faint focus:outline-none focus:ring-2 focus:ring-cursor-text-faint'

export default function HackathonShowcase() {
  const { t } = useI18n()
  const [slots, setSlots] = useState<ShowcaseSlotJson[]>([])
  const [remaining, setRemaining] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [teamName, setTeamName] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [bookedIndex, setBookedIndex] = useState<number | null>(null)

  const loadAgenda = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/hackathon/showcase', { cache: 'no-store' })
      const body = (await res.json()) as {
        slots?: ShowcaseSlotJson[]
        remaining?: number
        message?: string
      }
      if (!res.ok || !Array.isArray(body.slots)) {
        throw new Error(body.message || t('hackathon.showcaseLoadError'))
      }
      setSlots(body.slots)
      setRemaining(typeof body.remaining === 'number' ? body.remaining : body.slots.filter((slot) => slot.open).length)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t('hackathon.showcaseLoadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadAgenda()
  }, [loadAgenda])

  const full = remaining === 0
  const isSubmitting = formState === 'submitting'

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormState('submitting')
    setStatusMessage('')

    try {
      const res = await fetch('/api/hackathon/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName }),
      })
      const body = (await res.json()) as {
        ok?: boolean
        alreadyBooked?: boolean
        message?: string
        slot?: ShowcaseBookedSlot
      }

      if (!res.ok || !body.ok || !body.slot) {
        setFormState('error')
        setStatusMessage(body.message || t('hackathon.genericError'))
        if (res.status === 409) {
          await loadAgenda()
        }
        return
      }

      setBookedIndex(body.slot.index)
      setFormState('success')
      setStatusMessage(
        body.alreadyBooked
          ? t('hackathon.showcaseAlreadyBooked', { slot: body.slot.label, team: body.slot.teamName })
          : t('hackathon.showcaseBooked', { slot: body.slot.label, team: body.slot.teamName }),
      )
      await loadAgenda()
    } catch {
      setFormState('error')
      setStatusMessage(t('hackathon.genericError'))
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start">
      <section
        className="rounded-2xl border border-cursor-border bg-cursor-surface p-6"
        aria-labelledby="hackathon-showcase-apply"
      >
        <h2 id="hackathon-showcase-apply" className="text-xl font-semibold tracking-tight">
          {t('hackathon.showcaseApplyTitle')}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-cursor-text-secondary">
          {t('hackathon.showcaseApplyDescription')}
        </p>

        {remaining != null ? (
          <p className="mt-4 text-sm text-cursor-text-muted">
            {full
              ? t('hackathon.showcaseFull')
              : t('hackathon.showcaseRemaining', { count: String(remaining) })}
          </p>
        ) : null}

        {full ? null : (
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-cursor-text">{t('hackathon.showcaseTeamLabel')}</span>
              <input
                type="text"
                name="teamName"
                autoComplete="organization"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder={t('hackathon.showcaseTeamPlaceholder')}
                className={inputClassName}
                disabled={isSubmitting}
                maxLength={80}
                required
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full rounded-md bg-cursor-accent-orange px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? t('hackathon.showcaseSubmitting') : t('hackathon.showcaseSubmit')}
            </button>
          </form>
        )}

        {statusMessage ? (
          <p
            className={`mt-4 text-sm ${formState === 'error' ? 'text-red-400' : 'text-cursor-accent-orange'}`}
            role="status"
          >
            {statusMessage}
          </p>
        ) : null}
      </section>

      <section className="space-y-4" aria-labelledby="hackathon-showcase-agenda">
        <div className="space-y-2">
          <h2 id="hackathon-showcase-agenda" className="text-xl font-semibold tracking-tight md:text-2xl">
            {t('hackathon.showcaseAgendaTitle')}
          </h2>
          <p className="max-w-xl text-sm text-cursor-text-secondary md:text-base">
            {t('hackathon.showcaseAgendaDescription')}
          </p>
        </div>

        {loading && slots.length === 0 ? (
          <p className="text-sm text-cursor-text-muted" role="status">
            {t('hackathon.showcaseLoading')}
          </p>
        ) : null}

        {loadError ? (
          <div className="space-y-3">
            <p className="text-sm text-red-400" role="alert">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => void loadAgenda()}
              className="text-sm font-medium text-cursor-accent-orange hover:underline"
            >
              {t('hackathon.projectsRetry')}
            </button>
          </div>
        ) : null}

        {slots.length > 0 ? (
          <ol className="divide-y divide-cursor-border overflow-hidden rounded-2xl border border-cursor-border">
            {slots.map((slot) => {
              const mine = bookedIndex === slot.index
              return (
                <li
                  key={slot.index}
                  className={`flex items-center justify-between gap-4 px-4 py-3 sm:px-5 ${
                    mine ? 'bg-cursor-accent-orange-bg' : 'bg-cursor-surface'
                  }`}
                >
                  <span className="shrink-0 rounded-full border border-cursor-accent-orange/50 bg-cursor-accent-orange-bg px-2.5 py-1 font-mono text-[11px] font-semibold text-cursor-accent-orange sm:text-xs">
                    {slot.label}
                  </span>
                  <span
                    className={`min-w-0 text-right text-sm ${
                      slot.open ? 'text-cursor-text-muted' : 'font-medium text-cursor-text'
                    }`}
                  >
                    {slot.open ? t('hackathon.showcaseSlotOpen') : slot.teamName}
                  </span>
                </li>
              )
            })}
          </ol>
        ) : null}
      </section>
    </div>
  )
}

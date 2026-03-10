'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useI18n } from '@/lib/i18n'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function SubscribeForm() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  const isSubmitting = formState === 'submitting'

  const isEmailValid = useMemo(() => {
    if (!email) {
      return true
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }, [email])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFormState('error')
      setMessage(t('subscribe.invalidEmail'))
      return
    }

    setFormState('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const result = (await response.json()) as { ok?: boolean; message?: string }
      if (!response.ok || !result.ok) {
        throw new Error(result.message || t('subscribe.genericError'))
      }

      setFormState('success')
      setMessage(t('subscribe.success'))
      setEmail('')
    } catch (error) {
      setFormState('error')
      setMessage(error instanceof Error ? error.message : t('subscribe.genericError'))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm text-cursor-text-muted">
          {t('subscribe.emailLabel')}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('subscribe.emailPlaceholder')}
          className="w-full rounded-md border border-cursor-border bg-cursor-surface px-4 py-3 text-cursor-text placeholder:text-cursor-text-faint focus:outline-none focus:ring-2 focus:ring-cursor-text-faint"
          aria-invalid={!isEmailValid}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-md bg-cursor-text px-5 py-2.5 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? t('subscribe.submitting') : t('subscribe.submit')}
      </button>

      {message ? (
        <p
          className={`text-sm ${formState === 'success' ? 'text-cursor-accent-green' : 'text-cursor-accent-red'}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}

'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useI18n } from '@/lib/i18n'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function HackathonSponsorshipForm() {
  const { t } = useI18n()
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const isSubmitting = formState === 'submitting'

  const isEmailValid = useMemo(() => {
    if (!email) {
      return true
    }
    return EMAIL_PATTERN.test(email)
  }, [email])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    const trimmedCompany = companyName.trim()
    const trimmedContact = contactName.trim()

    if (!trimmedCompany || !trimmedContact) {
      setFormState('error')
      setStatusMessage(t('hackathon.requiredFields'))
      return
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setFormState('error')
      setStatusMessage(t('hackathon.invalidEmail'))
      return
    }

    setFormState('submitting')
    setStatusMessage('')

    try {
      const response = await fetch('/api/hackathon/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: trimmedCompany,
          contactName: trimmedContact,
          email: normalizedEmail,
          website: website.trim() || undefined,
          message: message.trim() || undefined,
        }),
      })

      const result = (await response.json()) as { ok?: boolean; message?: string }
      if (!response.ok || !result.ok) {
        throw new Error(result.message || t('hackathon.genericError'))
      }

      setFormState('success')
      setStatusMessage(t('hackathon.success'))
      setCompanyName('')
      setContactName('')
      setEmail('')
      setWebsite('')
      setMessage('')
    } catch (error) {
      setFormState('error')
      setStatusMessage(error instanceof Error ? error.message : t('hackathon.genericError'))
    }
  }

  const inputClassName =
    'w-full rounded-md border border-cursor-border bg-cursor-surface px-4 py-3 text-cursor-text placeholder:text-cursor-text-faint focus:outline-none focus:ring-2 focus:ring-cursor-text-faint'

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="companyName" className="block text-sm text-cursor-text-muted">
            {t('hackathon.companyLabel')}
          </label>
          <input
            id="companyName"
            type="text"
            autoComplete="organization"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder={t('hackathon.companyPlaceholder')}
            className={inputClassName}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contactName" className="block text-sm text-cursor-text-muted">
            {t('hackathon.contactLabel')}
          </label>
          <input
            id="contactName"
            type="text"
            autoComplete="name"
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            placeholder={t('hackathon.contactPlaceholder')}
            className={inputClassName}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="sponsorEmail" className="block text-sm text-cursor-text-muted">
            {t('hackathon.emailLabel')}
          </label>
          <input
            id="sponsorEmail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('hackathon.emailPlaceholder')}
            className={inputClassName}
            aria-invalid={!isEmailValid}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="block text-sm text-cursor-text-muted">
            {t('hackathon.websiteLabel')}
          </label>
          <input
            id="website"
            type="url"
            autoComplete="url"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder={t('hackathon.websitePlaceholder')}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm text-cursor-text-muted">
          {t('hackathon.messageLabel')}
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t('hackathon.messagePlaceholder')}
          className={`${inputClassName} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-md bg-cursor-text px-5 py-2.5 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? t('hackathon.submitting') : t('hackathon.submit')}
      </button>

      {statusMessage ? (
        <p
          className={`text-sm ${formState === 'success' ? 'text-cursor-accent-green' : 'text-cursor-accent-red'}`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  )
}

'use client'

import { FormEvent, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useI18n } from '@/lib/i18n'
import { useHackerStatus } from '@/lib/use-hacker-status'
import { useHackathonDetails } from '@/lib/use-hackathon-details'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const inputClassName =
  'w-full rounded-md border border-cursor-border bg-cursor-surface px-4 py-3 text-cursor-text placeholder:text-cursor-text-faint focus:outline-none focus:ring-2 focus:ring-cursor-text-faint'

export default function HackathonProjectSubmitForm() {
  const { t } = useI18n()
  const { data: session, status: sessionStatus } = useSession()
  const hackerStatus = useHackerStatus()
  const hackathon = useHackathonDetails()

  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoRecordingUrl, setDemoRecordingUrl] = useState('')
  const [liveDemoUrl, setLiveDemoUrl] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const isSubmitting = formState === 'submitting'

  if (sessionStatus === 'loading' || (session?.user && hackerStatus.status === 'loading')) {
    return (
      <p className="text-sm text-cursor-text-muted" role="status">
        {t('hackathon.submitLoading')}
      </p>
    )
  }

  if (!session?.user) {
    return (
      <div className="space-y-4 rounded-2xl border border-cursor-border bg-cursor-surface/60 p-6">
        <p className="text-cursor-text-secondary">{t('hackathon.submitNeedLogin')}</p>
        <button
          type="button"
          onClick={() => signIn('google')}
          className="inline-flex items-center justify-center rounded-md bg-cursor-text px-5 py-2.5 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted"
        >
          {t('hackathon.loginCta')}
        </button>
      </div>
    )
  }

  if (hackerStatus.status === 'error') {
    return (
      <div className="space-y-3 rounded-2xl border border-cursor-border bg-cursor-surface/60 p-6">
        <p className="text-cursor-accent-red">{t('hackathon.submitStatusError')}</p>
        <button
          type="button"
          onClick={() => hackerStatus.refetch()}
          className="text-sm text-cursor-text-muted underline hover:text-cursor-text"
        >
          {t('hackathon.submitRetryStatus')}
        </button>
      </div>
    )
  }

  const lumaStatus = hackerStatus.lumaStatus

  if (lumaStatus === 'registered') {
    return (
      <div className="space-y-3 rounded-2xl border border-cursor-accent-yellow/30 bg-cursor-surface/60 p-6">
        <p className="font-medium text-cursor-accent-yellow">{t('hackathon.submitNeedCheckIn')}</p>
        <p className="text-sm text-cursor-text-secondary">{t('hackathon.submitNeedCheckInHint')}</p>
      </div>
    )
  }

  if (lumaStatus === 'not_found' || lumaStatus === null) {
    return (
      <div className="space-y-4 rounded-2xl border border-cursor-border bg-cursor-surface/60 p-6">
        <p className="text-cursor-text-secondary">{t('hackathon.submitNeedRegister')}</p>
        <a
          href={hackathon.lumaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-cursor-text px-5 py-2.5 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted"
        >
          {t('hackathon.registerCta')}
        </a>
      </div>
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = projectTitle.trim()
    const trimmedDescription = projectDescription.trim()
    const trimmedGithub = githubUrl.trim()
    const trimmedRecording = demoRecordingUrl.trim()
    const trimmedLive = liveDemoUrl.trim()

    if (
      !trimmedTitle ||
      !trimmedDescription ||
      !trimmedGithub ||
      !trimmedRecording ||
      !trimmedLive
    ) {
      setFormState('error')
      setStatusMessage(t('hackathon.requiredFields'))
      return
    }

    setFormState('submitting')
    setStatusMessage('')

    try {
      const response = await fetch('/api/hackathon/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: trimmedTitle,
          projectDescription: trimmedDescription,
          githubUrl: trimmedGithub,
          demoRecordingUrl: trimmedRecording,
          liveDemoUrl: trimmedLive,
        }),
      })

      const result = (await response.json()) as {
        ok?: boolean
        message?: string
        error?: string
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message || result.error || t('hackathon.genericError'))
      }

      setFormState('success')
      setStatusMessage(t('hackathon.submitSuccess'))
    } catch (error) {
      setFormState('error')
      setStatusMessage(
        error instanceof Error ? error.message : t('hackathon.genericError'),
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <p className="text-sm text-cursor-text-muted">
        {t('hackathon.submitSignedInAs')}{' '}
        <span className="text-cursor-text">{session.user.email}</span>
      </p>

      <div className="space-y-2">
        <label htmlFor="projectTitle" className="block text-sm text-cursor-text-muted">
          {t('hackathon.submitTitleLabel')}
        </label>
        <input
          id="projectTitle"
          type="text"
          maxLength={120}
          value={projectTitle}
          onChange={(event) => setProjectTitle(event.target.value)}
          placeholder={t('hackathon.submitTitlePlaceholder')}
          className={inputClassName}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="projectDescription" className="block text-sm text-cursor-text-muted">
          {t('hackathon.submitDescriptionLabel')}
        </label>
        <textarea
          id="projectDescription"
          rows={5}
          maxLength={5000}
          value={projectDescription}
          onChange={(event) => setProjectDescription(event.target.value)}
          placeholder={t('hackathon.submitDescriptionPlaceholder')}
          className={`${inputClassName} resize-y`}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="githubUrl" className="block text-sm text-cursor-text-muted">
          {t('hackathon.submitGithubLabel')}
        </label>
        <input
          id="githubUrl"
          type="url"
          value={githubUrl}
          onChange={(event) => setGithubUrl(event.target.value)}
          placeholder={t('hackathon.submitGithubPlaceholder')}
          className={inputClassName}
          required
        />
        <p className="text-xs text-cursor-text-faint">{t('hackathon.submitGithubHint')}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="demoRecordingUrl" className="block text-sm text-cursor-text-muted">
          {t('hackathon.submitRecordingLabel')}
        </label>
        <input
          id="demoRecordingUrl"
          type="url"
          value={demoRecordingUrl}
          onChange={(event) => setDemoRecordingUrl(event.target.value)}
          placeholder={t('hackathon.submitRecordingPlaceholder')}
          className={inputClassName}
          required
        />
        <p className="text-xs text-cursor-text-faint">{t('hackathon.submitRecordingHint')}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="liveDemoUrl" className="block text-sm text-cursor-text-muted">
          {t('hackathon.submitLiveDemoLabel')}
        </label>
        <input
          id="liveDemoUrl"
          type="url"
          value={liveDemoUrl}
          onChange={(event) => setLiveDemoUrl(event.target.value)}
          placeholder={t('hackathon.submitLiveDemoPlaceholder')}
          className={inputClassName}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-md bg-cursor-text px-5 py-2.5 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? t('hackathon.submitSubmitting') : t('hackathon.submitProject')}
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

      {formState === 'success' ? (
        <p className="text-xs text-cursor-text-faint">{t('hackathon.submitUpdateHint')}</p>
      ) : null}
    </form>
  )
}

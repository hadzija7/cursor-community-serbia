'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { useHackerStatus } from '@/lib/use-hacker-status'
import { useHackathonDetails } from '@/lib/use-hackathon-details'
import { MAX_TEAMMATE_EMAILS } from '@/lib/project-submission'
import type { ExistingProjectSubmission } from '@/app/api/hackathon/submit/route'
import { normalizeEmail } from '@/lib/project-team'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

type TeammateFields = {
  name: string
  email: string
}

const inputClassName =
  'w-full rounded-md border border-cursor-border bg-cursor-surface px-4 py-3 text-cursor-text placeholder:text-cursor-text-faint focus:outline-none focus:ring-2 focus:ring-cursor-text-faint'

function emptyTeammates(): TeammateFields[] {
  return Array.from({ length: MAX_TEAMMATE_EMAILS }, () => ({ name: '', email: '' }))
}

function padTeammates(teammates: TeammateFields[], excludeEmail?: string): TeammateFields[] {
  const next = emptyTeammates()
  const exclude = excludeEmail ? normalizeEmail(excludeEmail) : ''
  const filtered = teammates.filter((teammate) => {
    if (!exclude) return true
    return normalizeEmail(teammate.email) !== exclude
  })
  filtered.slice(0, MAX_TEAMMATE_EMAILS).forEach((teammate, index) => {
    next[index] = { name: teammate.name, email: teammate.email }
  })
  return next
}

export default function HackathonProjectSubmitForm() {
  const { t } = useI18n()
  const { data: session, status: sessionStatus } = useSession()
  const hackerStatus = useHackerStatus()
  const hackathon = useHackathonDetails()
  const searchParams = useSearchParams()
  const previewMode =
    process.env.NODE_ENV === 'development' && searchParams.get('preview') === '1'
  const previewAdmin = searchParams.get('admin') === '1'

  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoRecordingUrl, setDemoRecordingUrl] = useState('')
  const [liveDemoUrl, setLiveDemoUrl] = useState('')
  const [teammates, setTeammates] = useState<TeammateFields[]>(emptyTeammates)
  const [hasExisting, setHasExisting] = useState(false)
  const [existingRole, setExistingRole] = useState<'submitter' | 'teammate' | null>(null)
  const [existingSubmitterName, setExistingSubmitterName] = useState('')
  const [prefillLoading, setPrefillLoading] = useState(false)
  const [prefillError, setPrefillError] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [gateLoading, setGateLoading] = useState(!previewMode)
  const [submissionsOpen, setSubmissionsOpen] = useState(true)
  const [isAdmin, setIsAdmin] = useState(previewMode && previewAdmin)
  const [gateBusy, setGateBusy] = useState(false)
  const [gateError, setGateError] = useState('')

  const isSubmitting = formState === 'submitting'
  const isCheckedIn = previewMode ? true : hackerStatus.lumaStatus === 'checked_in'

  const loadGate = useCallback(async () => {
    if (previewMode) {
      setIsAdmin(previewAdmin)
      setGateLoading(false)
      return
    }

    try {
      const res = await fetch('/api/hackathon/submit/gate', { cache: 'no-store' })
      const data = (await res.json()) as {
        ok?: boolean
        submissionsOpen?: boolean
        isAdmin?: boolean
      }
      if (res.ok && data.ok) {
        setSubmissionsOpen(data.submissionsOpen !== false)
        setIsAdmin(Boolean(data.isAdmin))
      }
    } catch {
      setSubmissionsOpen(true)
    } finally {
      setGateLoading(false)
    }
  }, [previewMode, previewAdmin])

  useEffect(() => {
    void loadGate()
  }, [loadGate, sessionStatus])

  const onToggleGate = async (closed: boolean) => {
    setGateError('')
    if (previewMode) {
      setSubmissionsOpen(!closed)
      return
    }

    setGateBusy(true)
    try {
      const res = await fetch('/api/hackathon/submit/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closed }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        message?: string
        submissionsOpen?: boolean
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.message || t('hackathon.submitGateError'))
      }
      setSubmissionsOpen(data.submissionsOpen !== false)
    } catch (err) {
      setGateError(err instanceof Error ? err.message : t('hackathon.submitGateError'))
    } finally {
      setGateBusy(false)
    }
  }

  useEffect(() => {
    if (previewMode || sessionStatus !== 'authenticated' || !isCheckedIn) return

    let cancelled = false
    setPrefillLoading(true)
    setPrefillError('')

    void (async () => {
      try {
        const res = await fetch('/api/hackathon/submit', { cache: 'no-store' })
        const data = (await res.json()) as {
          ok?: boolean
          message?: string
          submission?: ExistingProjectSubmission | null
        }
        if (!res.ok || !data.ok) {
          throw new Error(data.message || t('hackathon.submitPrefillError'))
        }
        if (cancelled) return

        const existing = data.submission
        if (existing) {
          setProjectTitle(existing.projectTitle)
          setProjectDescription(existing.projectDescription)
          setGithubUrl(existing.githubUrl)
          setDemoRecordingUrl(existing.demoRecordingUrl)
          setLiveDemoUrl(existing.liveDemoUrl)
          setTeammates(
            padTeammates(
              existing.teammates,
              existing.role === 'teammate' ? session?.user?.email ?? undefined : undefined,
            ),
          )
          setHasExisting(true)
          setExistingRole(existing.role)
          setExistingSubmitterName(existing.submitterName ?? '')
        } else {
          setHasExisting(false)
          setExistingRole(null)
          setExistingSubmitterName('')
        }
      } catch (err) {
        if (!cancelled) {
          setPrefillError(
            err instanceof Error ? err.message : t('hackathon.submitPrefillError'),
          )
        }
      } finally {
        if (!cancelled) setPrefillLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [previewMode, sessionStatus, isCheckedIn, session?.user?.email, t])

  if (gateLoading || (!previewMode && sessionStatus === 'loading')) {
    return (
      <p className="text-sm text-cursor-text-muted" role="status">
        {t('hackathon.submitLoading')}
      </p>
    )
  }

  const adminPanel = isAdmin ? (
    <section className="space-y-2 rounded-2xl border border-cursor-border bg-cursor-surface/40 p-5">
      <p className="text-sm text-cursor-text-secondary">
        {submissionsOpen ? t('hackathon.submitAdminOpen') : t('hackathon.submitAdminClosed')}
        {submissionsOpen ? ` ${t('hackathon.submitCloseHint')}` : ''}
      </p>
      <button
        type="button"
        disabled={gateBusy}
        onClick={() => void onToggleGate(submissionsOpen)}
        className="rounded-md border border-cursor-border px-4 py-2 text-sm font-medium text-cursor-text hover:bg-cursor-overlay disabled:opacity-60"
      >
        {submissionsOpen ? t('hackathon.submitCloseCta') : t('hackathon.submitReopenCta')}
      </button>
      {gateError ? (
        <p className="text-sm text-cursor-accent-red" role="alert">
          {gateError}
        </p>
      ) : null}
    </section>
  ) : null

  if (!submissionsOpen) {
    return (
      <div className="space-y-4">
        {adminPanel}
        <div className="space-y-2 rounded-2xl border border-cursor-border bg-cursor-surface/60 p-6">
          <p className="font-medium text-cursor-text">{t('hackathon.submitClosedTitle')}</p>
          <p className="text-sm text-cursor-text-secondary">{t('hackathon.submitClosedBody')}</p>
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <div className="space-y-4">
        {adminPanel}
        <p className="rounded-lg border border-cursor-accent-orange/40 bg-cursor-accent-orange/10 px-4 py-3 text-sm text-cursor-accent-orange">
          {t('hackathon.projectsPreviewBanner')}
        </p>
      </div>
    )
  }

  if (!previewMode && session?.user && hackerStatus.status === 'loading') {
    return (
      <div className="space-y-4">
        {adminPanel}
        <p className="text-sm text-cursor-text-muted" role="status">
          {t('hackathon.submitLoading')}
        </p>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="space-y-4">
        {adminPanel}
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
      </div>
    )
  }

  if (hackerStatus.status === 'error') {
    return (
      <div className="space-y-4">
        {adminPanel}
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
      </div>
    )
  }

  const lumaStatus = hackerStatus.lumaStatus

  if (lumaStatus === 'registered') {
    return (
      <div className="space-y-4">
        {adminPanel}
      <div className="space-y-3 rounded-2xl border border-cursor-accent-yellow/30 bg-cursor-surface/60 p-6">
        <p className="font-medium text-cursor-accent-yellow">{t('hackathon.submitNeedCheckIn')}</p>
        <p className="text-sm text-cursor-text-secondary">{t('hackathon.submitNeedCheckInHint')}</p>
      </div>
      </div>
    )
  }

  if (lumaStatus === 'not_found' || lumaStatus === null) {
    return (
      <div className="space-y-4">
        {adminPanel}
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
      </div>
    )
  }

  if (prefillLoading) {
    return (
      <p className="text-sm text-cursor-text-muted" role="status">
        {t('hackathon.submitLoadingExisting')}
      </p>
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = projectTitle.trim()
    const trimmedDescription = projectDescription.trim()
    const trimmedGithub = githubUrl.trim()
    const trimmedRecording = demoRecordingUrl.trim()
    const trimmedLive = liveDemoUrl.trim()
    const trimmedTeammates = teammates
      .map((teammate) => ({
        name: teammate.name.trim(),
        email: teammate.email.trim(),
      }))
      .filter((teammate) => teammate.name || teammate.email)

    if (trimmedTeammates.some((teammate) => !teammate.name || !teammate.email)) {
      setFormState('error')
      setStatusMessage(t('hackathon.submitTeammateNeedsBoth'))
      return
    }

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
          teammates: trimmedTeammates,
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

      setHasExisting(true)
      setFormState('success')
      setStatusMessage(
        hasExisting ? t('hackathon.submitUpdateSuccess') : t('hackathon.submitSuccess'),
      )
    } catch (error) {
      setFormState('error')
      setStatusMessage(
        error instanceof Error ? error.message : t('hackathon.genericError'),
      )
    }
  }

  return (
    <div className="space-y-4">
      {adminPanel}
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
      <p className="text-sm text-cursor-text-muted">
        {t('hackathon.submitSignedInAs')}{' '}
        <span className="text-cursor-text">{session.user.email}</span>
      </p>

      {hasExisting ? (
        <p className="rounded-lg border border-cursor-border bg-cursor-surface/50 px-4 py-3 text-sm text-cursor-text-secondary">
          {existingRole === 'teammate'
            ? t('hackathon.submitTeammatePrefillBanner')
                .replace('{title}', projectTitle)
                .replace(
                  '{name}',
                  existingSubmitterName || t('hackathon.submitTeammateSubmitterFallback'),
                )
            : t('hackathon.submitPrefillBanner')}
        </p>
      ) : null}

      {prefillError ? (
        <p className="text-sm text-cursor-accent-red" role="alert">
          {prefillError}
        </p>
      ) : null}

      <fieldset className="space-y-3">
        <legend className="text-sm text-cursor-text-muted">{t('hackathon.submitTeammatesLabel')}</legend>
        <p className="text-xs text-cursor-text-faint">{t('hackathon.submitTeammatesHint')}</p>
        {teammates.map((teammate, index) => (
          <div key={`teammate-${index}`} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`teammateName${index + 1}`}
                className="block text-sm text-cursor-text-muted"
              >
                {t('hackathon.submitTeammateNameLabel').replace('{n}', String(index + 1))}
              </label>
              <input
                id={`teammateName${index + 1}`}
                type="text"
                autoComplete="name"
                maxLength={80}
                value={teammate.name}
                onChange={(event) => {
                  const next = [...teammates]
                  const current = next[index]
                  if (!current) return
                  next[index] = { ...current, name: event.target.value }
                  setTeammates(next)
                }}
                placeholder={t('hackathon.submitTeammateNamePlaceholder')}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`teammateEmail${index + 1}`}
                className="block text-sm text-cursor-text-muted"
              >
                {t('hackathon.submitTeammateEmailLabel').replace('{n}', String(index + 1))}
              </label>
              <input
                id={`teammateEmail${index + 1}`}
                type="email"
                autoComplete="email"
                value={teammate.email}
                onChange={(event) => {
                  const next = [...teammates]
                  const current = next[index]
                  if (!current) return
                  next[index] = { ...current, email: event.target.value }
                  setTeammates(next)
                }}
                placeholder={t('hackathon.submitTeammateEmailPlaceholder')}
                className={inputClassName}
              />
            </div>
          </div>
        ))}
      </fieldset>

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
        {isSubmitting
          ? t('hackathon.submitSubmitting')
          : hasExisting
            ? t('hackathon.submitUpdateProject')
            : t('hackathon.submitProject')}
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
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import type { JudgePanelSummary } from '@/app/api/hackathon/projects/route'
import type { ProjectGalleryItem } from '@/app/api/hackathon/projects/route'
import { useI18n } from '@/lib/i18n'

type Props = {
  panel: JudgePanelSummary
  projects: ProjectGalleryItem[]
  busy?: boolean
  isAdmin?: boolean
  onConfirmTop3: (ids: { firstId: string; secondId: string; thirdId: string }) => Promise<void>
  onFinishScoring?: () => Promise<void>
  onPublishResults?: (published: boolean) => Promise<void>
}

export default function HackathonJudgePanel({
  panel,
  projects,
  busy = false,
  isAdmin = false,
  onConfirmTop3,
  onFinishScoring,
  onPublishResults,
}: Props) {
  const { t } = useI18n()
  const [firstId, setFirstId] = useState(panel.top3?.[0]?.id ?? '')
  const [secondId, setSecondId] = useState(panel.top3?.[1]?.id ?? '')
  const [thirdId, setThirdId] = useState(panel.top3?.[2]?.id ?? '')
  const [localError, setLocalError] = useState('')
  const [saving, setSaving] = useState(false)

  const options = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        label: p.title,
      })),
    [projects],
  )

  const judgeEmails = useMemo(() => {
    const fromVotes = panel.peerVotes?.[0]?.scores.map((score) => score.judgeEmail) ?? []
    return [...new Set(fromVotes)]
  }, [panel.peerVotes])

  const showProgress = panel.projectCount > 0
  const showAggregates = panel.aggregateStatus !== 'hidden'
  const blocked = busy || saving

  if (!showProgress && !showAggregates && !panel.canSetFinalTop3 && !isAdmin) {
    return null
  }

  const run = async (action: () => Promise<void>) => {
    setLocalError('')
    setSaving(true)
    try {
      await action()
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t('hackathon.projectsGenericError'))
    } finally {
      setSaving(false)
    }
  }

  const waitingLabel = panel.allFinished
    ? t('hackathon.projectsJudgeAllFinished')
    : panel.allRated
      ? t('hackathon.projectsJudgeAllRated')
      : t('hackathon.projectsJudgeWaiting')

  return (
    <section
      className="space-y-4 rounded-2xl border border-cursor-border bg-cursor-surface/40 p-5 md:p-6"
      aria-labelledby="judge-panel-heading"
    >
      <div className="space-y-1">
        <h2
          id="judge-panel-heading"
          className="text-lg font-semibold tracking-tight text-cursor-text md:text-xl"
        >
          {t('hackathon.projectsJudgePanelTitle')}
        </h2>
        <p className="text-sm text-cursor-text-muted">
          {t('hackathon.projectsJudgePanelDescription')}
        </p>
      </div>

      {showProgress ? (
        <p className="text-sm text-cursor-text-secondary">
          {t('hackathon.projectsJudgeProgress')
            .replace('{rated}', String(panel.myRatedCount))
            .replace('{total}', String(panel.projectCount))}
          {` · ${waitingLabel}`}
        </p>
      ) : null}

      {panel.canFinishScoring && onFinishScoring ? (
        <div className="space-y-2 rounded-xl border border-cursor-border bg-cursor-bg/40 p-3">
          <p className="text-sm text-cursor-text-secondary">
            {t('hackathon.projectsJudgeFinishHint')}
          </p>
          <button
            type="button"
            disabled={blocked}
            onClick={() => void run(onFinishScoring)}
            className="rounded-md bg-cursor-text px-4 py-2 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted disabled:opacity-60"
          >
            {t('hackathon.projectsJudgeFinishCta')}
          </button>
        </div>
      ) : null}

      {panel.myFinished && !panel.allFinished ? (
        <p className="text-sm text-cursor-text-muted">
          {t('hackathon.projectsJudgeFinishedWaiting')
            .replace('{finished}', String(panel.finishedCount))
            .replace('{total}', String(panel.judgeCount))}
        </p>
      ) : null}

      {panel.myFinished && panel.allFinished ? (
        <p className="text-sm text-cursor-text-muted">{t('hackathon.projectsJudgeFinished')}</p>
      ) : null}

      {panel.needsDecision ? (
        <p
          className="rounded-lg border border-cursor-accent-yellow/40 bg-cursor-accent-yellow/10 px-4 py-3 text-sm text-cursor-accent-yellow"
          role="status"
        >
          {t('hackathon.projectsJudgeNeedsDecision')}
          {panel.aggregateReason ? ` ${panel.aggregateReason}` : ''}
        </p>
      ) : null}

      {showAggregates && panel.ranked.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cursor-text-muted">
            {t('hackathon.projectsJudgeAggregateHeading')}
          </p>
          <ol className="space-y-1.5 text-sm text-cursor-text-secondary">
            {panel.ranked.slice(0, 8).map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-baseline gap-x-2">
                <span className="tabular-nums text-cursor-text-faint">#{entry.competitionRank}</span>
                <span className="font-medium text-cursor-text">{entry.title}</span>
                <span className="tabular-nums">
                  {t('hackathon.projectsAvgScore').replace('{score}', String(entry.averageScore))}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {panel.peerVotes && panel.peerVotes.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cursor-text-muted">
            {t('hackathon.projectsJudgePeerHeading')}
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-cursor-text-faint">
                  <th className="border-b border-cursor-border px-2 py-1.5 font-medium">
                    {t('hackathon.projectsJudgePeerProject')}
                  </th>
                  {judgeEmails.map((email) => (
                    <th key={email} className="border-b border-cursor-border px-2 py-1.5 font-medium">
                      {email}
                    </th>
                  ))}
                  <th className="border-b border-cursor-border px-2 py-1.5 font-medium">
                    {t('hackathon.projectsJudgePeerAvg')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {panel.peerVotes.map((row) => (
                  <tr key={row.submissionId}>
                    <td className="border-b border-cursor-border px-2 py-1.5 font-medium text-cursor-text">
                      {row.title}
                    </td>
                    {judgeEmails.map((email) => {
                      const score = row.scores.find((item) => item.judgeEmail === email)?.score
                      return (
                        <td
                          key={`${row.submissionId}-${email}`}
                          className="border-b border-cursor-border px-2 py-1.5 tabular-nums text-cursor-text-secondary"
                        >
                          {score == null ? '—' : score}
                        </td>
                      )
                    })}
                    <td className="border-b border-cursor-border px-2 py-1.5 tabular-nums text-cursor-text-secondary">
                      {row.averageScore == null ? '—' : row.averageScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-cursor-text-faint">{t('hackathon.projectsJudgePrivacyNote')}</p>
        </div>
      ) : null}

      {isAdmin && panel.canSetFinalTop3 ? (
        <div className="space-y-3 border-t border-cursor-border pt-4">
          <p className="text-sm text-cursor-text-secondary">
            {panel.needsDecision
              ? t('hackathon.projectsJudgeSetTop3Hint')
              : t('hackathon.projectsJudgeConfirmTop3Hint')}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                [1, firstId, setFirstId, t('hackathon.projectsJudgePick1st')],
                [2, secondId, setSecondId, t('hackathon.projectsJudgePick2nd')],
                [3, thirdId, setThirdId, t('hackathon.projectsJudgePick3rd')],
              ] as const
            ).map(([place, value, setter, label]) => (
              <label key={place} className="flex flex-col gap-1 text-xs text-cursor-text-muted">
                {label}
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  disabled={blocked}
                  className="rounded-md border border-cursor-border bg-cursor-surface px-3 py-2 text-sm text-cursor-text"
                >
                  <option value="">{t('hackathon.projectsJudgePickPlaceholder')}</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={blocked || !firstId || !secondId || !thirdId}
            onClick={() => void run(() => onConfirmTop3({ firstId, secondId, thirdId }))}
            className="rounded-md bg-cursor-text px-4 py-2 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted disabled:opacity-60"
          >
            {panel.finalConfirmed
              ? t('hackathon.projectsJudgeUpdateFinal')
              : t('hackathon.projectsJudgeSaveFinal')}
          </button>
        </div>
      ) : null}

      {isAdmin && onPublishResults ? (
        <div className="space-y-2 border-t border-cursor-border pt-4">
          <p className="text-sm text-cursor-text-secondary">
            {panel.resultsPublished
              ? t('hackathon.projectsPublished')
              : t('hackathon.projectsUnpublished')}
            {panel.canPublishResults && !panel.resultsPublished
              ? ` ${t('hackathon.projectsPublishHint')}`
              : ''}
          </p>
          <button
            type="button"
            disabled={blocked || (!panel.resultsPublished && !panel.canPublishResults)}
            onClick={() => void run(() => onPublishResults(!panel.resultsPublished))}
            className="rounded-md border border-cursor-border px-4 py-2 text-sm font-medium text-cursor-text hover:bg-cursor-overlay disabled:opacity-60"
          >
            {panel.resultsPublished
              ? t('hackathon.projectsUnpublishResults')
              : t('hackathon.projectsPublishResults')}
          </button>
        </div>
      ) : null}

      {localError ? (
        <p className="text-sm text-cursor-accent-red" role="alert">
          {localError}
        </p>
      ) : null}
    </section>
  )
}

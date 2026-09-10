'use client'

import { useMemo, useState } from 'react'
import type { JudgePanelSummary } from '@/app/api/hackathon/projects/route'
import type { ProjectGalleryItem } from '@/app/api/hackathon/projects/route'
import { useI18n } from '@/lib/i18n'

type Props = {
  panel: JudgePanelSummary
  projects: ProjectGalleryItem[]
  busy?: boolean
  onConfirmTop3: (ids: { firstId: string; secondId: string; thirdId: string }) => Promise<void>
}

export default function HackathonJudgePanel({
  panel,
  projects,
  busy = false,
  onConfirmTop3,
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

  // Judges always see their scoring progress; aggregates only after allRated.
  const showProgress = panel.projectCount > 0
  const showAggregates = panel.aggregateStatus !== 'hidden'

  if (!showProgress && !showAggregates && !panel.canSetFinalTop3) {
    return null
  }

  const handleConfirm = async () => {
    setLocalError('')
    setSaving(true)
    try {
      await onConfirmTop3({ firstId, secondId, thirdId })
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t('hackathon.projectsGenericError'))
    } finally {
      setSaving(false)
    }
  }

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
          {panel.allRated
            ? ` · ${t('hackathon.projectsJudgeAllRated')}`
            : ` · ${t('hackathon.projectsJudgeWaiting')}`}
        </p>
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
          <p className="text-xs text-cursor-text-faint">{t('hackathon.projectsJudgePrivacyNote')}</p>
        </div>
      ) : null}

      {panel.top3 && !panel.needsDecision ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cursor-text-muted">
            {panel.finalConfirmed
              ? t('hackathon.projectsJudgeFinalHeading')
              : t('hackathon.projectsJudgeProvisionalHeading')}
          </p>
          <ol className="grid gap-2 sm:grid-cols-3">
            {panel.top3.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-cursor-border bg-cursor-bg/40 px-3 py-3 text-sm"
              >
                <p className="text-xs uppercase tracking-wide text-cursor-text-muted">
                  {t('hackathon.projectsLeaderboardRank').replace('{rank}', String(entry.place))}
                </p>
                <p className="mt-1 font-medium text-cursor-text">{entry.title}</p>
                <p className="mt-1 text-cursor-accent-orange">{entry.awardLabel}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {panel.canSetFinalTop3 ? (
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
                  disabled={busy || saving}
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
            disabled={busy || saving || !firstId || !secondId || !thirdId}
            onClick={() => void handleConfirm()}
            className="rounded-md bg-cursor-text px-4 py-2 text-sm font-medium text-cursor-bg transition-colors hover:bg-cursor-text-muted disabled:opacity-60"
          >
            {panel.finalConfirmed
              ? t('hackathon.projectsJudgeUpdateFinal')
              : t('hackathon.projectsJudgeSaveFinal')}
          </button>
          {localError ? (
            <p className="text-sm text-cursor-accent-red" role="alert">
              {localError}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  hackathonGuideAgenda,
  hackathonGuideJudging,
  hackathonGuidePurpose,
  hackathonGuideSteps,
  hackathonGuideTeam,
  hackathonGuideTopics,
  hackathonGuideTopicsIntro,
} from '@/content/hackathon'
import { useI18n } from '@/lib/i18n'
import { useHackathonHref } from '@/lib/use-hackathon-base-path'

export default function HackathonGuide() {
  const { t } = useI18n()
  const submitHref = useHackathonHref('submit')

  return (
    <div className="space-y-16">
      <motion.section
        id="purpose"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45 }}
        className="space-y-3"
        aria-labelledby="hackathon-guide-purpose"
      >
        <h2 id="hackathon-guide-purpose" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {hackathonGuidePurpose.title}
        </h2>
        <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{hackathonGuidePurpose.body}</p>
      </motion.section>

      <motion.section
        id="team"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45 }}
        className="space-y-3"
        aria-labelledby="hackathon-guide-team"
      >
        <h2 id="hackathon-guide-team" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {hackathonGuideTeam.title}
        </h2>
        <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{hackathonGuideTeam.body}</p>
      </motion.section>

      <motion.section
        id="agenda"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45 }}
        className="space-y-8"
        aria-labelledby="hackathon-guide-agenda"
      >
        <div className="space-y-3">
          <h2 id="hackathon-guide-agenda" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t('hackathon.guideAgendaTitle')}
          </h2>
          <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.guideAgendaDescription')}</p>
        </div>

        <ol className="relative">
          {hackathonGuideAgenda.map((item, index) => {
            const last = index === hackathonGuideAgenda.length - 1

            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                <div className="flex w-16 shrink-0 flex-col items-center sm:w-20">
                  <span className="relative z-10 flex min-h-10 w-full items-center justify-center rounded-full border border-cursor-accent-orange/50 bg-cursor-accent-orange-bg px-2 py-1.5 text-center font-mono text-[11px] font-semibold leading-tight text-cursor-accent-orange sm:text-xs">
                    {item.time}
                  </span>
                  {last ? null : (
                    <span
                      aria-hidden
                      className="mt-1 w-px flex-1 bg-gradient-to-b from-cursor-accent-orange/50 to-cursor-border"
                    />
                  )}
                </div>
                <div className="min-w-0 pt-1.5">
                  <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-cursor-text-secondary md:text-base">
                    {item.body}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </ol>

        <div className="max-w-2xl space-y-2 border-t border-cursor-border pt-8">
          <h3 className="text-lg font-semibold tracking-tight">{hackathonGuideJudging.title}</h3>
          <p className="text-sm leading-relaxed text-cursor-text-secondary md:text-base">
            {hackathonGuideJudging.body}
          </p>
        </div>
      </motion.section>

      <motion.section
        id="guidelines"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45 }}
        className="space-y-8"
        aria-labelledby="hackathon-guide-guidelines"
      >
        <h2 id="hackathon-guide-guidelines" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t('hackathon.guideGuidelinesTitle')}
        </h2>

        <ol className="relative">
          {hackathonGuideSteps.map((step, index) => {
            const last = index === hackathonGuideSteps.length - 1
            const number = String(index + 1).padStart(2, '0')
            const stepHref = step.id === 'submit' && step.href ? submitHref : step.href

            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                <div className="flex w-10 shrink-0 flex-col items-center">
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cursor-accent-orange/50 bg-cursor-accent-orange-bg font-mono text-xs font-semibold text-cursor-accent-orange">
                    {number}
                  </span>
                  {last ? null : (
                    <span
                      aria-hidden
                      className="mt-1 w-px flex-1 bg-gradient-to-b from-cursor-accent-orange/50 to-cursor-border"
                    />
                  )}
                </div>
                <div className="min-w-0 pt-1.5">
                  <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-cursor-text-secondary md:text-base">
                    {step.body}
                  </p>
                  {stepHref && step.cta ? (
                    <Link
                      href={stepHref}
                      className="mt-3 inline-flex text-sm font-medium text-cursor-accent-orange transition-colors hover:text-cursor-text"
                    >
                      {step.cta} →
                    </Link>
                  ) : null}
                </div>
              </motion.li>
            )
          })}
        </ol>
      </motion.section>

      <motion.section
        id="topics"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45 }}
        className="space-y-6"
        aria-labelledby="hackathon-guide-topics"
      >
        <div className="space-y-3">
          <h2 id="hackathon-guide-topics" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {hackathonGuideTopicsIntro.title}
          </h2>
          <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{hackathonGuideTopicsIntro.body}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hackathonGuideTopics.map((topic) => (
            <article
              key={topic.id}
              className="rounded-2xl border border-cursor-border-emphasis bg-cursor-surface/60 p-6"
            >
              <h3 className="text-lg font-semibold tracking-tight">{topic.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cursor-text-secondary">{topic.summary}</p>
            </article>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

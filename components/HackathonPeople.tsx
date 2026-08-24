'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Globe, Github, Linkedin, Twitter } from 'lucide-react'
import { hackathonJudges, hackathonMentors } from '@/content/hackathon'
import { useI18n } from '@/lib/i18n'
import type { HackathonPerson } from '@/lib/types'

function SocialIcon({ kind }: { kind: 'x' | 'linkedin' | 'github' | 'website' }) {
  if (kind === 'x') return <Twitter className="h-4 w-4" />
  if (kind === 'linkedin') return <Linkedin className="h-4 w-4" />
  if (kind === 'github') return <Github className="h-4 w-4" />
  return <Globe className="h-4 w-4" />
}

function PersonCard({ person, index }: { person: HackathonPerson; index: number }) {
  const { t } = useI18n()
  const links = [
    { kind: 'x' as const, href: person.links?.x },
    { kind: 'linkedin' as const, href: person.links?.linkedin },
    { kind: 'github' as const, href: person.links?.github },
    { kind: 'website' as const, href: person.links?.website },
  ].filter((entry) => Boolean(entry.href))

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="flex flex-col gap-5 rounded-2xl border border-cursor-border-emphasis bg-cursor-surface/60 p-6 sm:flex-row"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:h-40 sm:w-40 sm:shrink-0">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          className={`object-cover ${person.photoPosition === 'top' ? 'object-top' : 'object-center'}`}
          sizes="(min-width: 640px) 160px, 100vw"
        />
      </div>
      <div className="min-w-0 space-y-3">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{person.name}</h3>
          <p className="text-sm text-cursor-text-muted">{person.title}</p>
        </div>
        {person.bio ? (
          <p className="text-sm leading-relaxed text-cursor-text-secondary md:text-base">{person.bio}</p>
        ) : null}
        {person.help ? (
          <p className="text-sm leading-relaxed text-cursor-text-secondary">
            <span className="font-medium text-cursor-text">{t('hackathon.peopleAskAbout')} </span>
            {person.help}
          </p>
        ) : null}
        {links.length > 0 ? (
          <div className="flex items-center gap-3">
            {links.map((link) => (
              <a
                key={`${person.id}-${link.kind}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-cursor-border p-2 text-cursor-text-muted transition-colors hover:border-cursor-border-emphasis hover:text-cursor-text"
                aria-label={`${person.name} ${link.kind}`}
              >
                <SocialIcon kind={link.kind} />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  )
}

export default function HackathonPeople() {
  const { t } = useI18n()

  return (
    <div className="space-y-12">
      <motion.section
        id="mentors"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
        aria-labelledby="hackathon-mentors-heading"
      >
        <div className="space-y-2">
          <h2 id="hackathon-mentors-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t('hackathon.mentorsTitle')}
          </h2>
          <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.mentorsDescription')}</p>
        </div>
        <div className="grid gap-4">
          {hackathonMentors.map((person, index) => (
            <PersonCard key={person.id} person={person} index={index} />
          ))}
        </div>
      </motion.section>

      <motion.section
        id="judges"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
        aria-labelledby="hackathon-judges-heading"
      >
        <div className="space-y-2">
          <h2 id="hackathon-judges-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t('hackathon.judgesTitle')}
          </h2>
          {hackathonJudges.length === 0 ? (
            <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.judgesEmpty')}</p>
          ) : (
            <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.judgesDescription')}</p>
          )}
        </div>
        {hackathonJudges.length > 0 ? (
          <div className="grid gap-4">
            {hackathonJudges.map((person, index) => (
              <PersonCard key={person.id} person={person} index={index} />
            ))}
          </div>
        ) : null}
      </motion.section>
    </div>
  )
}

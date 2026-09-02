'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Globe, Github, Linkedin, Twitter } from 'lucide-react'
import { hackathonHosts, hackathonJudges, hackathonMentors } from '@/content/hackathon'
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
      className="flex h-full items-start gap-4 rounded-2xl border border-cursor-accent-orange/25 bg-gradient-to-br from-cursor-surface via-cursor-bg-dark to-cursor-accent-orange-bg p-4"
    >
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-cursor-accent-orange/45 sm:h-24 sm:w-24">
          <Image
            src={person.photo}
            alt={person.name}
            fill
            className={`object-cover ${person.photoPosition === 'top' ? 'object-top' : 'object-center'}`}
            sizes="96px"
          />
        </div>
        {links.length > 0 ? (
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <a
                key={`${person.id}-${link.kind}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-cursor-border p-1.5 text-cursor-text-muted transition-colors hover:border-cursor-accent-orange/50 hover:text-cursor-accent-orange"
                aria-label={`${person.name} ${link.kind}`}
              >
                <SocialIcon kind={link.kind} />
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div>
          <h3 className="text-sm font-semibold tracking-tight sm:text-base">{person.name}</h3>
          <p className="text-xs text-cursor-text-muted sm:text-sm">{person.title}</p>
        </div>
        {person.bio ? (
          <p className="text-xs leading-relaxed text-cursor-text-secondary sm:text-sm">{person.bio}</p>
        ) : null}
        {person.help ? (
          <p className="text-xs leading-relaxed text-cursor-text-secondary sm:text-sm">
            <span className="font-medium text-cursor-text">{t('hackathon.peopleAskAbout')} </span>
            {person.help}
          </p>
        ) : null}
      </div>
    </motion.article>
  )
}

function PeopleGrid({ people }: { people: HackathonPerson[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {people.map((person, index) => (
        <PersonCard key={person.id} person={person} index={index} />
      ))}
    </div>
  )
}

export default function HackathonPeople() {
  const { t } = useI18n()

  return (
    <div className="space-y-12">
      <motion.section
        id="hosts"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
        aria-labelledby="hackathon-hosts-heading"
      >
        <div className="space-y-2">
          <h2 id="hackathon-hosts-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t('hackathon.hostsTitle')}
          </h2>
          <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.hostsDescription')}</p>
        </div>
        <PeopleGrid people={hackathonHosts} />
      </motion.section>

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
        <PeopleGrid people={hackathonMentors} />
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
        {hackathonJudges.length > 0 ? <PeopleGrid people={hackathonJudges} /> : null}
      </motion.section>
    </div>
  )
}

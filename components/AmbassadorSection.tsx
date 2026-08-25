'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Globe, Github, Linkedin, Twitter } from 'lucide-react'
import { ambassadors } from '@/content/ambassadors'
import { useI18n } from '@/lib/i18n'
import SectionEyebrow from '@/components/SectionEyebrow'

function SocialIcon({ kind }: { kind: 'x' | 'linkedin' | 'github' | 'website' }) {
  if (kind === 'x') return <Twitter className="w-4 h-4" />
  if (kind === 'linkedin') return <Linkedin className="w-4 h-4" />
  if (kind === 'github') return <Github className="w-4 h-4" />
  return <Globe className="w-4 h-4" />
}

export default function AmbassadorSection() {
  const { t } = useI18n()

  if (ambassadors.length === 0) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-16 space-y-6"
      aria-labelledby="ambassadors-heading"
    >
      <SectionEyebrow id="ambassadors-heading">{t('ambassadors.eyebrow')}</SectionEyebrow>

      <div className="grid gap-4 sm:grid-cols-2">
        {ambassadors.map((ambassador, index) => {
          const links = [
            { kind: 'x' as const, href: ambassador.links.x },
            { kind: 'linkedin' as const, href: ambassador.links.linkedin },
            { kind: 'github' as const, href: ambassador.links.github },
            { kind: 'website' as const, href: ambassador.links.website },
          ].filter((entry) => Boolean(entry.href))

          return (
            <motion.article
              key={ambassador.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
              className="rounded-2xl border border-cursor-accent-orange/25 bg-gradient-to-br from-cursor-surface via-cursor-bg-dark to-cursor-accent-orange-bg p-6"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 min-h-16 min-w-16 shrink-0 overflow-hidden rounded-full border-2 border-cursor-accent-orange/45">
                  <Image
                    src={ambassador.photo}
                    alt={ambassador.name}
                    fill
                    className={`object-cover ${ambassador.photoPosition === 'top' ? 'object-top' : 'object-center'}`}
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight text-cursor-text">{ambassador.name}</p>
                  {ambassador.role ? (
                    <p className="text-sm text-cursor-text-muted">{ambassador.role}</p>
                  ) : null}
                </div>
              </div>

              {links.length > 0 ? (
                <div className="mt-5 flex items-center gap-3">
                  {links.map((link) => (
                    <a
                      key={`${ambassador.name}-${link.kind}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-cursor-border p-2 text-cursor-text-muted transition-colors hover:border-cursor-accent-orange/50 hover:text-cursor-accent-orange"
                      aria-label={`${ambassador.name} ${link.kind}`}
                    >
                      <SocialIcon kind={link.kind} />
                    </a>
                  ))}
                </div>
              ) : null}
            </motion.article>
          )
        })}
      </div>
    </motion.section>
  )
}

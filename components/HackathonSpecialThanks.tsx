'use client'

import { motion } from 'framer-motion'
import { hackathonSpecialThanks } from '@/content/hackathon'
import { useI18n } from '@/lib/i18n'

export default function HackathonSpecialThanks() {
  const { t } = useI18n()

  return (
    <motion.section
      id="special-thanks"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45 }}
      className="scroll-mt-24 space-y-8"
      aria-labelledby="hackathon-special-thanks"
    >
      <div className="space-y-3">
        <h2 id="hackathon-special-thanks" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t('hackathon.specialThanksTitle')}
        </h2>
        <p className="max-w-2xl text-cursor-text-secondary md:text-lg">{t('hackathon.specialThanksDescription')}</p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2">
        {hackathonSpecialThanks.map((thanks, index) => {
          const logoClassName = `${thanks.logoHeight ?? 'h-8'} ${thanks.logoWidth ?? 'w-auto'} object-contain`

          return (
            <motion.li
              key={thanks.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <a
                href={thanks.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-5 rounded-2xl border border-cursor-border-emphasis bg-cursor-surface/60 p-6 transition-colors hover:border-cursor-accent-orange/40"
              >
                <span
                  className="inline-flex w-fit items-center rounded-md px-5 py-3 transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: thanks.logoBg ?? '#ffffff' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thanks.logo} alt="" className={logoClassName} />
                </span>
                <div className="space-y-1">
                  <p className="text-lg font-semibold tracking-tight">{thanks.name}</p>
                  <p className="text-sm leading-relaxed text-cursor-text-secondary">{thanks.credit}</p>
                </div>
              </a>
            </motion.li>
          )
        })}
      </ul>
    </motion.section>
  )
}

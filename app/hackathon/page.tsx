'use client'

import { motion } from 'framer-motion'
import HackathonHero from '@/components/HackathonHero'
import HackathonHighlights from '@/components/HackathonHighlights'
import SponsorMarquee from '@/components/SponsorMarquee'

export default function HackathonPage() {
  return (
    <>
      <HackathonHero />

      <div className="mx-auto max-w-5xl space-y-20 px-6 py-16 md:py-20">
        <HackathonHighlights />

        <motion.section
          id="sponsors"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <SponsorMarquee />
        </motion.section>
      </div>
    </>
  )
}

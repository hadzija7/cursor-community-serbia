'use client'

import { motion } from 'framer-motion'
import BentoGrid from '@/components/BentoGrid'
import HackathonPromoCard from '@/components/HackathonPromoCard'
import Navbar from '@/components/Navbar'
import { headerPhotos } from '@/content/header-photos'

export default function HeroHeader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-svh flex flex-col"
    >
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-8 flex-1 min-h-0 border-t border-cursor-border overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent)',
        }}
      >
        <HackathonPromoCard />
        <BentoGrid photos={headerPhotos} cols={4} rows={4} mobileCols={2} mobileRows={4} />
      </motion.div>
    </motion.div>
  )
}

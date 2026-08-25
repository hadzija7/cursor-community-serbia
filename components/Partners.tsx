'use client'

import { partners } from '@/content/partners'
import { useI18n } from '@/lib/i18n'
import SectionEyebrow from '@/components/SectionEyebrow'

export default function Partners() {
  const { t } = useI18n()

  if (partners.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <SectionEyebrow as="h3" className="mb-6">
        {t('footer.hostingPartners')}
      </SectionEyebrow>
      <div className="flex flex-wrap items-stretch gap-4">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-md overflow-hidden px-6 py-3 hover:opacity-80 transition-opacity flex items-center"
            style={{ backgroundColor: partner.logoBg ?? '#ffffff' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partner.logo}
              alt={partner.name}
              className={`${partner.logoHeight ?? 'h-7'} w-auto object-contain group-hover:scale-105 transition-transform duration-200`}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

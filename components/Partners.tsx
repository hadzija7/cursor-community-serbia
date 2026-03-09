'use client'

import { partners } from '@/content/partners'
import { useI18n } from '@/lib/i18n'

export default function Partners() {
  const { t } = useI18n()

  if (partners.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h3 className="text-sm uppercase tracking-wider text-cursor-text-muted font-medium mb-6">
        {t('footer.hostingPartners')}
      </h3>
      <div className="flex flex-wrap items-stretch gap-4">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-md px-6 py-3 hover:opacity-80 transition-opacity flex items-center"
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

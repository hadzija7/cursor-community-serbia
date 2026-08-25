import type { ReactNode } from 'react'

const eyebrowClass =
  'text-xs font-semibold uppercase tracking-[0.18em] text-cursor-accent-orange'

export default function SectionEyebrow({
  as: Tag = 'h2',
  id,
  className,
  children,
}: {
  as?: 'h2' | 'h3' | 'p'
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <Tag id={id} className={className ? `${eyebrowClass} ${className}` : eyebrowClass}>
      {children}
    </Tag>
  )
}

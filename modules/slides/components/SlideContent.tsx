'use client'

import DOMPurify from 'dompurify'
import { Slide } from '@/modules/slides/types'

interface SlideContentProps {
  slide: Slide
}

export default function SlideContent({ slide }: SlideContentProps) {
  if (typeof slide.content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(slide.content) }} />
  }

  return <>{slide.content}</>
}

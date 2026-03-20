import { notFound } from 'next/navigation'
import SlideContent from '@/modules/slides/components/SlideContent'
import { Slide } from '@/modules/slides/types'

interface SlidePageProps {
  deck: Slide[]
  totalSlides: number
  idParam: string
}

export async function SlidePage({ deck, totalSlides, idParam }: SlidePageProps) {
  const id = Number(idParam)
  if (!Number.isInteger(id) || id < 1 || id > totalSlides) {
    notFound()
  }

  const slide = deck[id - 1]
  const titleClass =
    slide.titleSize === 'large' ? 'text-4xl md:text-5xl font-bold' : 'text-2xl md:text-3xl font-bold'

  return (
    <div className="space-y-8 text-xl">
      <header>
        <h1 className={titleClass}>{slide.title}</h1>
      </header>
      <SlideContent slide={slide} />
    </div>
  )
}

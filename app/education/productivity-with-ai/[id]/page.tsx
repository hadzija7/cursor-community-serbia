import { notFound } from 'next/navigation'
import SlideLayout from '@/modules/slides/components/SlideLayout'
import SlideContent from '@/modules/slides/components/SlideContent'
import {
  productivityWithAiDeck,
  totalProductivityWithAiSlides,
} from '@/modules/slides/content/productivity-with-ai-deck'

interface ProductivitySlideProps {
  params: Promise<{ id: string }>
}

export default async function ProductivitySlidePage({ params }: ProductivitySlideProps) {
  const { id: idParam } = await params
  const id = Number(idParam)
  if (!Number.isInteger(id) || id < 1 || id > totalProductivityWithAiSlides) {
    notFound()
  }

  const slide = productivityWithAiDeck[id - 1]

  return (
    <SlideLayout currentSlide={id} totalSlides={totalProductivityWithAiSlides}>
      <div className="space-y-8 text-xl">
        <header>
          <h1
            className={
              id === 1 ? 'text-4xl md:text-5xl font-bold' : 'text-2xl md:text-3xl font-bold'
            }
          >
            {slide.title}
          </h1>
        </header>
        <SlideContent slide={slide} />
      </div>
    </SlideLayout>
  )
}

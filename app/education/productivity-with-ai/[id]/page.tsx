import { SlidePage } from '@/modules/slides/components/SlidePage'
import {
  productivityWithAiDeck,
  totalProductivityWithAiSlides,
} from '@/modules/slides/content/productivity-with-ai-deck'

interface ProductivitySlideProps {
  params: Promise<{ id: string }>
}

export default async function ProductivitySlidePage({ params }: ProductivitySlideProps) {
  const { id } = await params
  return (
    <SlidePage
      deck={productivityWithAiDeck}
      totalSlides={totalProductivityWithAiSlides}
      storageKey="cursor-slides-productivity"
      idParam={id}
    />
  )
}

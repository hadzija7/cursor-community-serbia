import { SlidePage } from '@/modules/slides/components/SlidePage'
import { exampleDeck, totalExampleSlides } from '@/modules/slides/content/example-deck'

interface SlidePageRouteProps {
  params: Promise<{ id: string }>
}

export default async function SlidePageRoute({ params }: SlidePageRouteProps) {
  const { id } = await params
  return (
    <SlidePage deck={exampleDeck} totalSlides={totalExampleSlides} idParam={id} />
  )
}

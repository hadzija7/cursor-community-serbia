import { SlidePage } from '@/modules/slides/components/SlidePage'
import { coworkingDayDeck, totalCoworkingDaySlides } from '@/modules/slides/content/coworking-day-deck'

/** Predeclare slide URLs so production builds and route discovery stay explicit. */
export function generateStaticParams() {
  return Array.from({ length: totalCoworkingDaySlides }, (_, i) => ({
    id: String(i + 1),
  }))
}

interface CoworkingDaySlideProps {
  params: Promise<{ id: string }>
}

export default async function CoworkingDaySlidePage({ params }: CoworkingDaySlideProps) {
  const { id } = await params
  return <SlidePage deck={coworkingDayDeck} totalSlides={totalCoworkingDaySlides} idParam={id} />
}

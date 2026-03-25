import SlideLayout from '@/modules/slides/components/SlideLayout'
import { totalCoworkingDaySlides } from '@/modules/slides/content/coworking-day-deck'

export default function CoworkingDaySlideLayout({ children }: { children: React.ReactNode }) {
  return (
    <SlideLayout totalSlides={totalCoworkingDaySlides} storageKey="cursor-slides-coworking-day">
      {children}
    </SlideLayout>
  )
}

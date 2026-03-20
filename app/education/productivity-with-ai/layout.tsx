import SlideLayout from '@/modules/slides/components/SlideLayout'
import { totalProductivityWithAiSlides } from '@/modules/slides/content/productivity-with-ai-deck'

export default function ProductivityWithAiSlidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <SlideLayout totalSlides={totalProductivityWithAiSlides} storageKey="cursor-slides-productivity">
      {children}
    </SlideLayout>
  )
}

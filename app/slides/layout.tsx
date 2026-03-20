import SlideLayout from '@/modules/slides/components/SlideLayout'
import { totalExampleSlides } from '@/modules/slides/content/example-deck'

export default function SlidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <SlideLayout totalSlides={totalExampleSlides} storageKey="cursor-slides-example">
      {children}
    </SlideLayout>
  )
}

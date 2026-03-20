'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'

interface SlideLayoutProps {
  currentSlide: number
  totalSlides: number
  children: React.ReactNode
  storageKey?: string
}

export default function SlideLayout({
  currentSlide,
  totalSlides,
  children,
  storageKey = 'cursor-ambassador-current-slide',
}: SlideLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const basePath = pathname.replace(/\/\d+$/, '')

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const root = rootRef.current
    if (!root || typeof root.requestFullscreen !== 'function') return
    try {
      if (!document.fullscreenElement) {
        await root.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // User denied, unsupported, or security restriction
    }
  }, [])

  const goToSlide = useCallback(
    (slideId: number) => {
      if (slideId < 1 || slideId > totalSlides) return
      setIsNavigating(true)
      router.push(`${basePath}/${slideId}`)
    },
    [router, basePath, totalSlides]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isNavigating) return
      // Skip when user is typing in an input/textarea
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          event.preventDefault()
          if (currentSlide > 1) goToSlide(currentSlide - 1)
          break
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Enter':
          event.preventDefault()
          if (currentSlide < totalSlides) goToSlide(currentSlide + 1)
          break
        case 'Home':
          event.preventDefault()
          goToSlide(1)
          break
        case 'End':
          event.preventDefault()
          goToSlide(totalSlides)
          break
        default:
          break
      }
    },
    [currentSlide, isNavigating, goToSlide, totalSlides]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const resetNavigation = window.setTimeout(() => setIsNavigating(false), 0)
    localStorage.setItem(storageKey, String(currentSlide))

    return () => {
      window.clearTimeout(resetNavigation)
    }
  }, [currentSlide, storageKey])

  return (
    <div
      ref={rootRef}
      className="min-h-screen min-h-[100dvh] bg-cursor-bg text-cursor-text flex flex-col"
    >
      <main className="flex-1 flex items-start justify-center p-6 md:p-10 pt-8 overflow-y-auto pb-32 md:pb-36">
        <div className="w-full max-w-6xl pb-16">{children}</div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-cursor-bg/90 backdrop-blur-sm border-t border-cursor-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 1}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-cursor-surface hover:bg-cursor-surface-raised disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline">Previous</span>
          </button>

          <div className="flex-1 flex items-center justify-center min-w-0 overflow-x-auto">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSlides }, (_, i) => i + 1).map((slideId) => (
                <button
                  key={slideId}
                  onClick={() => goToSlide(slideId)}
                  className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                    slideId === currentSlide ? 'bg-cursor-text w-8' : 'bg-cursor-text-faint hover:bg-cursor-text-muted'
                  }`}
                  aria-label={`Go to slide ${slideId}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-sm text-cursor-text-muted hidden md:block tabular-nums">
              {currentSlide} / {totalSlides}
            </div>

            <button
              onClick={() => goToSlide(currentSlide + 1)}
              disabled={currentSlide >= totalSlides}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-cursor-surface hover:bg-cursor-surface-raised disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next slide"
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="flex items-center justify-center p-2 rounded-md bg-cursor-surface hover:bg-cursor-surface-raised transition-colors"
              aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

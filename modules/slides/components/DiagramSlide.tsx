'use client'

import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'

interface DiagramSlideProps {
  src: string
  alt: string
  caption?: string
}

interface DiagramState {
  src: string
  svgContent: string | null
  error: string | null
  loading: boolean
}

export default function DiagramSlide({ src, alt, caption }: DiagramSlideProps) {
  const [state, setState] = useState<DiagramState>({
    src,
    svgContent: null,
    loading: true,
    error: null,
  })
  const loading = state.src !== src || state.loading

  useEffect(() => {
    let active = true

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
        return res.text()
      })
      .then((text) => {
        if (!active) {
          return
        }

        setState({
          src,
          svgContent: text,
          loading: false,
          error: null,
        })
      })
      .catch((err) => {
        if (!active) {
          return
        }

        setState({
          src,
          svgContent: null,
          loading: false,
          error: err.message,
        })
      })

    return () => {
      active = false
    }
  }, [src])

  if (loading) {
    return <div className="animate-pulse text-cursor-text-muted py-12 text-center">Loading diagram...</div>
  }

  if (state.error) {
    return (
      <div className="bg-cursor-accent-red-bg border border-cursor-border-emphasis rounded p-4 text-cursor-accent-red text-center">
        <p>Error loading diagram: {state.error}</p>
        <p className="text-sm mt-2">Path: {src}</p>
      </div>
    )
  }

  if (!state.svgContent) {
    return <div className="text-cursor-text-muted text-center py-12">{alt}</div>
  }

  const modifiedSvg = state.svgContent.replace(
    /<svg([^>]*)>/,
    '<svg$1 width="100%" height="auto" style="max-width:100%;display:block;">'
  )

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="w-full max-w-4xl">
        <div
          className="w-full border border-cursor-border rounded-md overflow-hidden"
          style={{ minHeight: '300px' }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(modifiedSvg, { USE_PROFILES: { svg: true }, ADD_TAGS: ['use'] }) }}
        />
      </div>
      {caption ? <p className="text-cursor-text-muted text-lg text-center max-w-3xl">{caption}</p> : null}
    </div>
  )
}

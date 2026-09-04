import { cleanup, render, waitFor } from '@testing-library/react'
import type { ImgHTMLAttributes } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import HackathonMascotPeek from '@/components/HackathonMascotPeek'
import { hackathonConfig } from '@/content/hackathon'

vi.mock('next/image', () => ({
  default: function MockImage(props: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) {
    const { priority: _, ...rest } = props
    void _
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />
  },
}))

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const mediaQueryList = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation(() => mediaQueryList),
  })

  return {
    setMatches(next: boolean) {
      mediaQueryList.matches = next
      const event = { matches: next } as MediaQueryListEvent
      listeners.forEach((listener) => listener(event))
    },
  }
}

describe('HackathonMascotPeek', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    mockMatchMedia(false)
  })

  it('renders the MP4 video when motion is allowed', async () => {
    mockMatchMedia(false)
    const { container } = render(<HackathonMascotPeek />)

    await waitFor(() => {
      expect(container.querySelector('video')).not.toBeNull()
    })

    const video = container.querySelector('video')
    expect(video?.hasAttribute('autoplay') || video?.autoplay).toBeTruthy()
    expect(video?.muted || video?.hasAttribute('muted')).toBeTruthy()
    expect(video?.hasAttribute('loop') || video?.loop).toBeTruthy()
    expect(
      video?.hasAttribute('playsinline') || (video as HTMLVideoElement | null)?.playsInline
    ).toBeTruthy()
    expect(video).toHaveAttribute('poster', hackathonConfig.mascotPeekImage)
    expect(video).toHaveAttribute('preload', 'metadata')
    expect(container.querySelector('source')).toHaveAttribute(
      'src',
      hackathonConfig.mascotPeekVideo
    )
  })

  it('renders the static peek image when reduced motion is preferred', async () => {
    mockMatchMedia(true)
    const { container } = render(<HackathonMascotPeek />)

    await waitFor(() => {
      expect(container.querySelector('img')).not.toBeNull()
    })

    expect(container.querySelector('video')).toBeNull()
    const image = container.querySelector('img')
    expect(image).toHaveAttribute('src', hackathonConfig.mascotPeekImage)
  })

  it('falls back to the static image if the video errors', async () => {
    mockMatchMedia(false)
    const { container } = render(<HackathonMascotPeek />)

    await waitFor(() => {
      expect(container.querySelector('video')).not.toBeNull()
    })

    const video = container.querySelector('video')
    video?.dispatchEvent(new Event('error'))

    await waitFor(() => {
      expect(container.querySelector('video')).toBeNull()
      expect(container.querySelector('img')).not.toBeNull()
    })
  })
})

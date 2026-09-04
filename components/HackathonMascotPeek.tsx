'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { hackathonConfig } from '@/content/hackathon'

const MEDIA_CLASS = 'h-auto w-full aspect-square mix-blend-lighten'

/**
 * Overview-hero Grok Bot: autoplaying MP4 when motion is OK; static peek PNG
 * when `prefers-reduced-motion: reduce` (or if the video fails to load).
 * Mounts the video only after the client confirms motion is allowed so the
 * ~4MB asset is not fetched for reduced-motion users.
 */
export default function HackathonMascotPeek() {
  const [showVideo, setShowVideo] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    function applyPreference() {
      setShowVideo(!media.matches)
    }

    applyPreference()
    media.addEventListener('change', applyPreference)
    return () => media.removeEventListener('change', applyPreference)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }
    // Ensure muted for autoplay policies (React may not set the property reliably).
    video.muted = true
    const playAttempt = video.play()
    if (playAttempt !== undefined) {
      playAttempt.catch(() => {
        // Autoplay can still be blocked; poster/static remains visible.
      })
    }
  }, [showVideo, videoFailed])

  const useStatic = !showVideo || videoFailed

  if (useStatic) {
    return (
      <Image
        src={hackathonConfig.mascotPeekImage}
        alt=""
        width={1024}
        height={1024}
        className={MEDIA_CLASS}
        priority
      />
    )
  }

  return (
    <video
      ref={videoRef}
      src={hackathonConfig.mascotPeekVideo}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={hackathonConfig.mascotPeekImage}
      width={1024}
      height={1024}
      className={MEDIA_CLASS}
      onError={() => setVideoFailed(true)}
    />
  )
}

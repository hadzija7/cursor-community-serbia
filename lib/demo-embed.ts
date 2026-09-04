import { toYouTubeEmbedUrl } from '@/lib/youtube-embed'

export type DemoEmbed =
  | { kind: 'youtube' | 'loom'; embedUrl: string }
  | { kind: 'external'; href: string }

/** Loom share / embed URLs → embed iframe src. */
export function toLoomEmbedUrl(url: string): string | null {
  const trimmed = url.trim()
  try {
    const u = new URL(trimmed)
    const host = u.hostname.replace(/^www\./, '').toLowerCase()
    if (host !== 'loom.com') return null

    const shareMatch = u.pathname.match(/^\/share\/([^/?]+)/)
    if (shareMatch?.[1]) {
      return `https://www.loom.com/embed/${shareMatch[1]}`
    }

    const embedMatch = u.pathname.match(/^\/embed\/([^/?]+)/)
    if (embedMatch?.[1]) {
      return `https://www.loom.com/embed/${embedMatch[1]}`
    }
  } catch {
    return null
  }
  return null
}

/** Prefer YouTube or Loom embed; otherwise return an external link. */
export function resolveDemoEmbed(url: string): DemoEmbed {
  const youtube = toYouTubeEmbedUrl(url)
  if (youtube) {
    return { kind: 'youtube', embedUrl: youtube }
  }

  const loom = toLoomEmbedUrl(url)
  if (loom) {
    return { kind: 'loom', embedUrl: loom }
  }

  return { kind: 'external', href: url.trim() }
}

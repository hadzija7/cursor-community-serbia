/**
 * Normalize a YouTube watch or share URL to an embed URL for iframes.
 * Only trusted YouTube hosts are accepted — never pass through arbitrary URLs
 * that merely contain the substring "youtube.com/embed/".
 */
export function toYouTubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim()
  try {
    const u = new URL(trimmed)
    const host = u.hostname.replace(/^www\./, '').toLowerCase()
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      const m = u.pathname.match(/^\/embed\/([^/?]+)/)
      if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}`
    }
  } catch {
    return null
  }
  return null
}

/** Extract the 11-char video id from a watch / youtu.be / embed URL. */
export function parseYouTubeVideoId(url: string): string | null {
  const embed = toYouTubeEmbedUrl(url)
  if (!embed) return null
  const m = embed.match(/^https:\/\/www\.youtube\.com\/embed\/([^/?]+)/)
  return m?.[1] ?? null
}

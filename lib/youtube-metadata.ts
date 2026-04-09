import { unstable_cache } from 'next/cache'
import { parseYouTubeVideoId } from '@/lib/youtube-embed'
import type { YouTubeCardMeta } from '@/lib/types'

function parseLeadingJsonObject(html: string, start: number): unknown {
  let i = start
  if (html[i] !== '{') throw new SyntaxError('expected {')
  let depth = 0
  let inString = false
  let escape = false

  for (; i < html.length; i++) {
    const c = html[i]
    if (inString) {
      if (escape) {
        escape = false
      } else if (c === '\\') {
        escape = true
      } else if (c === '"') {
        inString = false
      }
      continue
    }
    if (c === '"') {
      inString = true
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) {
        return JSON.parse(html.slice(start, i + 1))
      }
    }
  }
  throw new SyntaxError('unclosed object')
}

function extractPlayerResponse(html: string): unknown | null {
  const m = html.match(/var ytInitialPlayerResponse\s*=\s*/)
  if (m?.index === undefined) return null
  const start = html.indexOf('{', m.index)
  if (start === -1) return null
  try {
    return parseLeadingJsonObject(html, start)
  } catch {
    return null
  }
}

function pickThumbnail(thumbnails: unknown): string | null {
  if (!Array.isArray(thumbnails) || thumbnails.length === 0) return null
  type T = { url?: string; width?: number; height?: number }
  const list = thumbnails as T[]
  // Match YouTube watch page: prefer the maxres asset when the API lists it.
  const maxres = list.find((t) => t.url?.includes('maxresdefault'))
  if (maxres?.url) return maxres.url
  const sorted = [...list].sort((a, b) => {
    const dw = Number(b.width ?? 0) - Number(a.width ?? 0)
    if (dw !== 0) return dw
    return Number(b.height ?? 0) - Number(a.height ?? 0)
  })
  const url = sorted[0]?.url
  return typeof url === 'string' ? url : null
}

async function fetchYouTubeMetadataFromPlayerResponse(videoId: string): Promise<YouTubeCardMeta | null> {
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
  const res = await fetch(watchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CursorCommunitySerbia/1.0; +https://cursor.com)',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    next: { revalidate: 86_400 },
  })
  if (!res.ok) return null
  const html = await res.text()
  const parsed = extractPlayerResponse(html) as {
    videoDetails?: {
      title?: string
      shortDescription?: string
      thumbnail?: { thumbnails?: unknown }
    }
  } | null
  const vd = parsed?.videoDetails
  if (!vd?.title) return null

  const idEnc = encodeURIComponent(videoId)
  const thumb =
    pickThumbnail(vd.thumbnail?.thumbnails) ??
    `https://i.ytimg.com/vi/${idEnc}/maxresdefault.jpg`

  return {
    title: vd.title,
    description: typeof vd.shortDescription === 'string' ? vd.shortDescription.trim() : '',
    thumbnailUrl: thumb,
  }
}

async function fetchYouTubeMetadataFromOEmbed(videoId: string): Promise<YouTubeCardMeta | null> {
  const canonical = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonical)}&format=json`
  const res = await fetch(oembed, { next: { revalidate: 86_400 } })
  if (!res.ok) return null
  const data = (await res.json()) as { title?: string; thumbnail_url?: string }
  if (!data.title || !data.thumbnail_url) return null
  // oEmbed often returns hqdefault; watch page uses maxres when available — align on CDN naming.
  const thumb =
    data.thumbnail_url.includes('ytimg.com') && data.thumbnail_url.includes('hqdefault')
      ? `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/maxresdefault.jpg`
      : data.thumbnail_url
  return {
    title: data.title,
    description: '',
    thumbnailUrl: thumb,
  }
}

async function fetchYouTubeMetadataUncached(videoId: string): Promise<YouTubeCardMeta | null> {
  const fromPage = await fetchYouTubeMetadataFromPlayerResponse(videoId)
  if (fromPage) return fromPage
  return fetchYouTubeMetadataFromOEmbed(videoId)
}

export function getYouTubeVideoMetadata(videoId: string): Promise<YouTubeCardMeta | null> {
  return unstable_cache(
    async () => fetchYouTubeMetadataUncached(videoId),
    ['youtube-video-metadata', videoId],
    { revalidate: 86_400 },
  )()
}

export async function buildYoutubePresentationFeed(
  entries: { youtubeUrl: string; fallbackTitle?: string }[],
): Promise<Array<{ youtubeUrl: string; meta: YouTubeCardMeta }>> {
  const results = await Promise.all(
    entries.map(async ({ youtubeUrl, fallbackTitle }) => {
      const id = parseYouTubeVideoId(youtubeUrl)
      if (!id) return null
      let meta = await getYouTubeVideoMetadata(id)
      if (!meta) {
        meta = {
          title: fallbackTitle?.trim() || 'Video',
          description: '',
          thumbnailUrl: `https://i.ytimg.com/vi/${encodeURIComponent(id)}/maxresdefault.jpg`,
        }
      }
      return { youtubeUrl, meta }
    }),
  )
  return results.filter((x): x is { youtubeUrl: string; meta: YouTubeCardMeta } => x != null)
}

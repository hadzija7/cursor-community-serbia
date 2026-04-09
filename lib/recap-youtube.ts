import type { RecapData, YouTubeCardMeta } from '@/lib/types'
import { parseYouTubeVideoId } from '@/lib/youtube-embed'
import { buildYoutubePresentationFeed } from '@/lib/youtube-metadata'

/** Shaped for `EventRecap` presentation grid (main + extra YouTube links). */
export async function getRecapYoutubePresentationCards(
  recap: RecapData,
): Promise<Array<{ youtubeUrl: string; meta: YouTubeCardMeta }>> {
  const entries: { youtubeUrl: string; fallbackTitle?: string }[] = []
  if (recap.videoUrl && parseYouTubeVideoId(recap.videoUrl)) {
    entries.push({ youtubeUrl: recap.videoUrl })
  }
  for (const p of recap.extraPresentations ?? []) {
    if (parseYouTubeVideoId(p.youtubeUrl)) {
      entries.push({ youtubeUrl: p.youtubeUrl, fallbackTitle: p.title })
    }
  }
  if (entries.length === 0) return []
  return buildYoutubePresentationFeed(entries)
}

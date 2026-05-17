import type { RecapData, YouTubeCardMeta } from '@/lib/types'
import { parseYouTubeVideoId } from '@/lib/youtube-embed'
import { buildYoutubePresentationFeed } from '@/lib/youtube-metadata'

/** YouTube metadata for recap page: main recording vs optional session recordings. */
export async function getRecapYoutubeSections(recap: RecapData): Promise<{
  videoRecapCards: Array<{ youtubeUrl: string; meta: YouTubeCardMeta }>
  presentationCards: Array<{ youtubeUrl: string; meta: YouTubeCardMeta }>
}> {
  const videoRecapEntries: { youtubeUrl: string; fallbackTitle?: string }[] = []
  if (recap.videoUrl && parseYouTubeVideoId(recap.videoUrl)) {
    videoRecapEntries.push({ youtubeUrl: recap.videoUrl })
  }
  const presentationEntries: { youtubeUrl: string; fallbackTitle?: string }[] = []
  for (const p of recap.extraPresentations ?? []) {
    if (parseYouTubeVideoId(p.youtubeUrl)) {
      presentationEntries.push({ youtubeUrl: p.youtubeUrl, fallbackTitle: p.title })
    }
  }
  const [videoRecapCards, presentationCards] = await Promise.all([
    videoRecapEntries.length ? buildYoutubePresentationFeed(videoRecapEntries) : Promise.resolve([]),
    presentationEntries.length ? buildYoutubePresentationFeed(presentationEntries) : Promise.resolve([]),
  ])
  return { videoRecapCards, presentationCards }
}

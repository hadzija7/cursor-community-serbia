/** Extract a Google Drive file id from share or preview URLs. */
export function parseDriveFileId(url: string): string | null {
  const trimmed = url.trim()
  const match = trimmed.match(/\/file\/d\/([^/]+)/)
  return match?.[1] ?? null
}

/** Normalize a Drive share URL to an iframe-friendly preview URL. */
export function toDrivePreviewEmbedUrl(url: string): string | null {
  const id = parseDriveFileId(url)
  return id ? `https://drive.google.com/file/d/${id}/preview` : null
}

/** Direct playback URL for publicly shared Drive video files. */
export function toDriveVideoSrc(url: string): string | null {
  const id = parseDriveFileId(url)
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : null
}

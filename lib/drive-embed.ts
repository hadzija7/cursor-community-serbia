const DRIVE_HOST = 'drive.google.com'

function driveHostname(url: string): string | null {
  try {
    return new URL(url.trim()).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return null
  }
}

/** Extract a Google Drive file id from share, open, uc, or preview URLs. */
export function parseDriveFileId(url: string): string | null {
  const trimmed = url.trim()
  const host = driveHostname(trimmed)
  if (host && host !== DRIVE_HOST) return null

  const fileMatch = trimmed.match(/\/file\/d\/([^/?#]+)/)
  if (fileMatch?.[1]) return fileMatch[1]

  if (host !== DRIVE_HOST) return null
  try {
    const id = new URL(trimmed).searchParams.get('id')
    return id && /^[\w-]+$/.test(id) ? id : null
  } catch {
    return null
  }
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

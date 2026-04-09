export type LocaleCode = string

export interface CursorEvent {
  id: string
  title: string
  titleLocal?: string
  date: string
  /** Event start time in HH:MM format, CET/CEST (Europe/Belgrade). Defaults to '18:00'. */
  time?: string
  displayDate: string
  attendees?: number
  location: string
  lumaUrl?: string
  recapPath?: string
  thumbnail?: string
  status: 'upcoming' | 'past'
  host?: { name: string; logo: string; url?: string }
}

export interface SocialLinks {
  x?: string
  linkedin?: string
  github?: string
  website?: string
}

export interface Ambassador {
  name: string
  role?: string
  photo: string
  /** Optional: 'top' for portrait photos to frame face, 'center' default */
  photoPosition?: 'top' | 'center'
  links: SocialLinks
}

export interface Partner {
  name: string
  logo: string
  url: string
  logoBg?: string
  logoHeight?: string
}

export interface FeaturedResource {
  title: string
  description: string
  href: string
  ctaLabel: string
}

export interface HeaderPhoto {
  src: string
  alt: string
  row: number
  col: number
  rowSpan?: number
  colSpan?: number
  mobile?: {
    row: number
    col: number
    rowSpan?: number
    colSpan?: number
  }
  mobileHidden?: boolean
}

export interface GalleryPhoto {
  src: string
  alt: string
}

export interface RecapPhotoCredit {
  name: string
  url?: string
}

export interface RecapInterview {
  title: string
  youtubeUrl: string
}

/** Title, description, and thumbnail for a YouTube recap card (from oEmbed / player response). */
export interface YouTubeCardMeta {
  title: string
  description: string
  thumbnailUrl: string
}

export interface RecapExtraPresentation {
  /** Shown only if YouTube metadata cannot be loaded. */
  title?: string
  youtubeUrl: string
  /** Same semantics as `RecapData.videoThumbnailUrl` when not using fetched YouTube thumbnails. */
  videoThumbnailUrl?: string
}

export interface RecapData {
  slug: string
  title: string
  date: string
  attendees?: number
  summary: string[]
  host?: { name: string; logo: string; url?: string }
  videoUrl?: string
  /** Optional image shown before play for embedded presentation (e.g. YouTube). Click reveals the player. */
  videoThumbnailUrl?: string
  /** More session recordings (e.g. a second talk), shown below the main presentation. */
  extraPresentations?: RecapExtraPresentation[]
  interviews?: RecapInterview[]
  photoCredits?: RecapPhotoCredit[]
  photos: GalleryPhoto[]
}

export interface WorldEventPhoto {
  src: string
  location: string
  date?: string
  alt: string
}

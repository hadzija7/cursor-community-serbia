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
  logoWidth?: string
}

export interface HackathonPrizePlace {
  place: string
  amount: string
  accent: 'orange' | 'green' | 'yellow' | 'purple'
}

export interface HackathonPrizeTrack {
  sponsor: string
  sponsorLogo: string
  sponsorUrl: string
  logoBg?: string
  logoHeight?: string
  category: string
  /** Extra track rule or participation perk, shown under the place cards. */
  note?: string
  places: HackathonPrizePlace[]
}

export interface HackathonGuideCopy {
  title: string
  body: string
}

export interface HackathonGuideStep {
  id: string
  title: string
  body: string
}

/** Theme or challenge track — add rows as topics lock. */
export interface HackathonGuideTopic {
  id: string
  title: string
  summary: string
}

export interface HackathonPerson {
  id: string
  name: string
  title: string
  photo: string
  photoPosition?: 'top' | 'center'
  bio?: string
  /** What hackers should ask this person about. */
  help?: string
  links?: SocialLinks
}

/** Where a sponsor sits on the one-day build path. */
export type HackathonSdlcStageId =
  | 'research'
  | 'search'
  | 'execute'
  | 'backend'
  | 'experience'
  | 'dictate'
  | 'generate'
  | 'deploy'
  | 'ship'

export interface HackathonSdlcStage {
  id: HackathonSdlcStageId
  label: string
  job: string
  sponsorId: string
  accent: 'orange' | 'green' | 'yellow' | 'purple' | 'blue'
}

export type HackathonSponsorPerkKind = 'confirmed' | 'public' | 'tbd'

export interface HackathonSponsorPerk {
  kind: HackathonSponsorPerkKind
  label: string
  detail?: string
}

export type HackathonSponsorMcpConfig =
  | {
      url: string
      auth?: { CLIENT_ID: string }
    }
  | {
      command: string
      args?: string[]
      env?: Record<string, string>
    }

export interface HackathonSponsorMcp {
  /** Server name written into mcp.json */
  name: string
  config: HackathonSponsorMcpConfig
  /** Extra setup the deeplink cannot do (CLI login, etc.). */
  note?: string
}

export interface HackathonSponsorProfile {
  id: string
  name: string
  logo: string
  url: string
  docsUrl: string
  logoBg?: string
  logoHeight?: string
  sdlcStage: HackathonSdlcStageId
  oneLiner: string
  technologies: string[]
  useCases: string[]
  perks: HackathonSponsorPerk[]
  /** Omit when the partner is not an MCP (desktop dictation, etc.). */
  mcp?: HackathonSponsorMcp
}

export interface HackathonStackRecipe {
  title: string
  summary: string
  sponsorIds: string[]
}

export interface HackathonStackPick {
  need: string
  use: string
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

export interface RecapExtraVideoRecap {
  title?: string
  videoUrl: string
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
  /** Additional recap recordings (e.g. second Drive upload), shown in the Video Recap section. */
  extraVideoRecaps?: RecapExtraVideoRecap[]
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

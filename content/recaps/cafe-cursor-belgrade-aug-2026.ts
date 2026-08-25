import { RecapData } from '@/lib/types'

/** Luma listing: https://luma.com/cursor-belgrade-august · Gallery URLs map to Drive file IDs below */

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

function drivePreview(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`
}

export const cafeCursorBelgradeAug2026Recap: RecapData = {
  slug: 'cafe-cursor-belgrade-aug-2026',
  title: 'Cafe Cursor Belgrade — August Recap',
  date: 'August 22, 2026',
  attendees: 64,
  summary: [
    'Sixty-four people joined us at Cafeteria Battery for Cafe Cursor Belgrade — a Saturday of building, coffee, and connecting with fellow Cursor users in the city.',
    'We ran two co-working blocks (11:00–14:00 and 14:00–17:00) so people could pick the session that fit their day. Cursor credits, a YAML-styled drink menu, and a relaxed café takeover kept laptops open and conversations flowing.',
    'Between live building sessions, side-by-side debugging, and plenty of drop-ins for a drink and a hello, the room mixed developers, founders, designers, and curious newcomers.',
    'Whether people came for a full co-working block or just stopped by to say hi, the takeaway was the same: strong builder energy in Belgrade, new connections, and another reason to come back for the next Cafe Cursor.',
  ],
  videoUrl: drivePreview('1Acp9sqd80qnWpeZfHf_TbrI38CpIgkEr'),
  photos: [
    { src: driveImg('1fk7zoRrDW7vZib6rbnr8RqeMpyP2zjyJ'), alt: 'Builders around a table at Cafe Cursor Belgrade' },
    { src: driveImg('1-B-Dw8DoVpd26Knhs0qREeoz_E8gxz1K'), alt: 'Cafe Cursor Belgrade sidewalk chalkboard' },
    { src: driveImg('1NZR48lw1ZeZTS-B16crPa9EFyC_2ga-l'), alt: 'Collaborating on laptops at Cafeteria Battery' },
    { src: driveImg('1GFNuD9tzC_QxxeVuG6JCNx9h-48jFRJr'), alt: 'Pairing on a project during the cafe session' },
    { src: driveImg('1lP6Xl9bQYz-3CPBzM4MWBssY6Uqf_i3R'), alt: 'Live building and discussion' },
    { src: driveImg('1hHVM8opUZM4dcDhvc6yW-AXTOEoUE6iR'), alt: 'Conversation at Cafe Cursor Belgrade' },
    { src: driveImg('1SFSDbsNSfbTS18Io7oxf84wtHssNlVCd'), alt: 'Cafe Cursor drink menu styled as YAML' },
    { src: driveImg('11Ds1W9pGoSgXCYf-nPbQZnT0Eq_3Mx-A'), alt: 'Branded drink and Cursor coupons' },
    { src: driveImg('1V0zCMfZQBEVHP5khXBIvtYqNDF-r6150'), alt: 'Latte art and Cursor stickers' },
    { src: driveImg('1VK5nNxheX96oIzfrWvxPnTeVJSNES-Rs'), alt: 'Coworking with a laptop and a dachshund' },
    { src: driveImg('1TgB5378zE8jFVG4ackpYHPhOjltPsoip'), alt: 'Relaxed coworking at Cafeteria Battery' },
    { src: driveImg('1UnuVAvyIh2A2XDHwm01KNbpTQmi3X8ng'), alt: 'Cursor-branded cups at the cafe' },
  ],
}

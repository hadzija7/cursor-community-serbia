import { RecapData } from '@/lib/types'

/** Luma listing: https://luma.com/cursor-belgrade · Gallery URLs map to Drive file IDs below */

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

function drivePreview(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`
}

export const cafeCursorBelgradeSummer2026Recap: RecapData = {
  slug: 'cafe-cursor-belgrade-summer-2026',
  title: 'Cafe Cursor Belgrade — Summer Edition Recap',
  date: 'June 28, 2026',
  attendees: 67,
  summary: [
    'Sixty-seven people joined us in Belgrade for the summer edition of Cafe Cursor — a relaxed Saturday afternoon of building, learning, and connecting with fellow Cursor users over coffee and summer vibes.',
    'We ran two co-working blocks (11:00–14:00 and 14:00–17:00) so people could pick the session that fit their day. Cursor credits, coffee, and a casual café atmosphere kept laptops open and conversations flowing.',
    'Between live building sessions, spontaneous demos, and AI workflow discussions, the room mixed developers, founders, designers, and curious newcomers — exactly the mix that makes Cafe Cursor feel like a community hangout, not a conference.',
    'Whether people came for a full co-working block or just dropped by to say hello, the takeaway was the same: strong builder energy in Belgrade, new connections, and plenty of reasons to come back for the next edition.',
  ],
  videoUrl: drivePreview('1A3JlfsiMpA6W9oChGu6CeLRvOuQF7ekU'),
  extraVideoRecaps: [{ videoUrl: drivePreview('1_sFrs4mzX_3X4gfu6V17z_Dtr3zhh3kg') }],
  interviews: [
    {
      title: 'Community interview',
      youtubeUrl: drivePreview('1cIZ9ZbGAmhUO7DG9Pg1WQnEMdjXSfNTU'),
    },
  ],
  photos: [
    { src: driveImg('1YmPZwDDF1Op1bSvQ4R3Lx4otJkjlCVUj'), alt: 'Cafe Cursor Belgrade Summer Edition' },
    { src: driveImg('1Yk971rzoSVzmI2ZOgc4RqFIJDomXbWqE'), alt: 'Co-working at Cafe Cursor Belgrade' },
    { src: driveImg('1TC3mHGuk4wPcZSgpSxuOPXvt2hmdUQpP'), alt: 'Attendees building together' },
    { src: driveImg('1J8mwyPhVqzfyTCGGs0DREca5F7F3trOK'), alt: 'Cursor community Belgrade' },
    { src: driveImg('10Hhxa9adziKU1kL-gS0Ntoplm4TO5KsG'), alt: 'Summer edition meetup' },
    { src: driveImg('15LeDJ-FjzsuKCHPwm3rhGL8RYE4I2qIp'), alt: 'Coffee and Cursor credits' },
    { src: driveImg('141ZM00OaOTb55d1tRo0xM9_2qelXa6Za'), alt: 'Live building sessions' },
    { src: driveImg('1OBJ6Tmg39FFknsIjnoURvCyfLeRb4Sw0'), alt: 'Community photo' },
  ],
}

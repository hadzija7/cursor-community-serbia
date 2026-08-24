import { RecapData } from '@/lib/types'

/** Luma listing: https://luma.com/kd163iko · Gallery URLs map to Drive file IDs below */

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

function drivePreview(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`
}

export const cursorMeetupNovisadAug2026Recap: RecapData = {
  slug: 'cursor-meetup-novisad-aug-2026',
  title: 'Cursor Meetup Novi Sad — Recap',
  date: 'August 20, 2026',
  attendees: 38,
  summary: [
    'Thirty-eight people joined us in Novi Sad for an evening at Creative Space 75 — a casual meetup on Cursor and AI in video creation, design, and marketing.',
    'From 7:00 to 9:00 PM the room stayed with the presentation and hands-on exploring of Cursor. From 9:00 to 10:00 PM we opened up for drinks, snacks, and the kind of side conversations that keep a meetup going.',
    'Creative Space 75 also set up a Cursor picture room as a side quest — a photo-studio twist that fit the night’s creative-tools theme.',
    'Whether people came curious about Cursor in video and design work, ready to try it on a laptop, or just looking to meet other builders, the takeaway was the same: new connections, a clearer picture of AI in creative workflows, and another strong Novi Sad Cursor evening.',
  ],
  videoUrl: drivePreview('1IRpLqQeaJz_V16CKPYMP587gXgbMAvu6'),
  photoCredits: [
    { name: 'Creative Space 75', url: 'https://www.instagram.com/creative.space75/' },
  ],
  photos: [
    { src: driveImg('1nMduEFPj1Okff_RkUiMdG0nig5ThdUJT'), alt: 'Presentation on Cursor and AI at Creative Space 75' },
    { src: driveImg('1cWk77Ear25eYcMe3R9iwkX7hUXoFKwc3'), alt: 'Attendees watching the Cursor Meetup Novi Sad presentation' },
    { src: driveImg('1hxOk5wY812VAbDQyRHlrz_WpubXPa95O'), alt: 'Audience during the evening session' },
    { src: driveImg('19iNQIhzsEBIwQoQzT0uIIORurkkPcIr-'), alt: 'Cursor Meetup Novi Sad at Creative Space 75' },
    { src: driveImg('1s3u3thZcqbB9IOf38h8pa4vhBWvkQm0q'), alt: 'Exploring Cursor with the community' },
    { src: driveImg('1hn9lidoNtDcZhmuzTgpts_6xDhsIvfan'), alt: 'Builders and creators at the meetup' },
    { src: driveImg('1S--rIlORMOflGo5p4flZh2zJf2yix5aU'), alt: 'Networking after the presentation' },
    { src: driveImg('1pmAKeLeezzWGdyvcNx6seUbN-1j4ZhFq'), alt: 'Cursor community Novi Sad' },
    { src: driveImg('1eki7sG6FrX3GOhmw7ZcVQAt5s9RV9vbD'), alt: 'Closing moments at Creative Space 75' },
  ],
}

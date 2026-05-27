import { RecapData } from '@/lib/types'

/** Luma listing: https://luma.com/jn59jzyp · Gallery URLs map to Drive file IDs below */

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

export const cursorMeetupNovisadMay2026Recap: RecapData = {
  slug: 'cursor-meetup-novisad-may-2026',
  title: 'Cursor Meetup Novi Sad — Recap',
  date: 'May 26, 2026',
  attendees: 40,
  summary: [
    'Around forty people joined us in Novi Sad for an evening focused on Memclaw — how the chat apps people already use can become a long-term personal memory store.',
    'Emanuilo walked through Memclaw’s system architecture, implementation details, and practical patterns for turning everyday conversations into durable context you can build on later.',
    'From 6:00 to 6:45 PM the room stayed locked in on the presentation; from 6:45 to 8:00 PM we opened up for networking, drinks, and the kind of side conversations that keep a meetup going.',
    'Whether people came curious about Memclaw, working on their own projects, or just looking to meet other builders, the takeaway was the same: new connections, a clearer picture of personal memory tooling, and another strong Novi Sad Cursor evening.',
  ],
  extraPresentations: [{ youtubeUrl: 'https://youtu.be/ynhKwdcadMA' }],
  photos: [
    { src: driveImg('1E0NV4YFLlFD8O72R0DrCqQ6pkjvwTE2k'), alt: 'Cursor Meetup Novi Sad' },
    { src: driveImg('1_x6bxrlfMpXLTc8sS89HpWXzEguhduCn'), alt: 'Memclaw presentation' },
    { src: driveImg('1zRyQpDutSJ7YtOCl8LCkVrrGmjcR8w03'), alt: 'Attendees at Cursor Meetup Novi Sad' },
    { src: driveImg('1C43ng5Hy3I7xQ2TmIlSgUgP3JtA3naDz'), alt: 'Presentation and demos' },
    { src: driveImg('1mDUqlai42s1tmA01kMAuMXFpZI-pd-9l'), alt: 'Cursor community Novi Sad' },
    { src: driveImg('1h_VwDwjSL6bQvmr3ttsWehHbuZvPKw9h'), alt: 'Meetup session' },
    { src: driveImg('1cBn6NAIvqaIk4_6vL5vnprYd5xs7yr5E'), alt: 'Networking at the meetup' },
    { src: driveImg('1BADCFU7sDLwq-0P5RRIQJ6NHbELd-VvC'), alt: 'Cursor Meetup Novi Sad' },
    { src: driveImg('1_x-s_b4rw235zWDmXnh6P7BouGw3_ZjR'), alt: 'Community photo' },
    { src: driveImg('1TkbzjXu645WVmRacASP_AGmw733PnGw-'), alt: 'Closing moments' },
  ],
}

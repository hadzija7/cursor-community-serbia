import { RecapData } from '@/lib/types'

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

export const cursorMeetupNovisadDec2025Recap: RecapData = {
  slug: 'cursor-meetup-novisad-dec-2025',
  title: 'Cursor Meetup Novi Sad - Recap',
  date: 'December 23, 2025',
  attendees: 100,
  summary: [
    'The first Cursor Meetup in Novi Sad brought together 100 people to see what Cursor can do, swap ideas about AI, and catch quick demos in a relaxed, party-style evening with pizza and drinks.',
    'Hosted by Aleksandar Hadžibabić, the program opened with introductions, then Evgeny shared “There are no shortcuts” — a grounded take on how to think about building with AI. The Cursor team stayed for Q&A, and the room kept buzzing through networking until late evening.',
    'Cursor credits, snacks, and plenty of side conversations made it easy for newcomers and regulars to connect. Many brought laptops for hands-on tinkering; others came for the vibe and the conversation — both groups left with new contacts and a clearer picture of what Cursor is for.',
  ],
  videoUrl: 'https://youtu.be/Wpup2C1oPWY',
  photos: [
    { src: driveImg('1mZBieCPcoimNWOv6jgriX_gJJzvc1qKl'), alt: 'Cursor Meetup Novi Sad' },
    { src: driveImg('1eyyVPmssWLlt5A53JoPIhPe3Qf4TsVUP'), alt: 'Attendees at Cursor Meetup Novi Sad' },
    { src: driveImg('1e2tjuZvxgNypPu2sEpX1rV77VNPZkH92'), alt: 'Cursor community in Novi Sad' },
    { src: driveImg('1xoeyjpGkkNiw7aW9aDL8REly2kiEj7NT'), alt: 'Meetup atmosphere' },
    { src: driveImg('1W7JX2fZ9Ha8cfr8SwYOvFi3J76YzfjLQ'), alt: 'Presentation and demos' },
    { src: driveImg('1wmgQJZJjkPye1cdOAXfA4-CtO0o6viLv'), alt: 'Networking at Cursor Meetup' },
    { src: driveImg('1K617_LQ8fNwXQ9dHYpP7N8u8TX0l1Qxi'), alt: 'Cursor Meetup Novi Sad' },
    { src: driveImg('14JMOBA7DPyPPKyVoTfPJOLxvyjetYbOJ'), alt: 'Community photo' },
    { src: driveImg('1Swcxf5y4IdoXFSkhDTkNIVJnZhmsrFko'), alt: 'Cursor Meetup group' },
  ],
}

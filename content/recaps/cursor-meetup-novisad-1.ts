import { RecapData } from '@/lib/types'

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

export const cursorMeetupNovisad1Recap: RecapData = {
  slug: 'cursor-meetup-novisad-1',
  title: 'Cursor Meetup Novi Sad - Recap',
  date: 'March 17, 2026',
  attendees: 37,
  summary: [
    'The third Cursor Meetup in Novi Sad brought together 37 builders, designers, and curious minds for an evening of demos, discussion, and networking. Hosted by Aleksandar Hadžibabić, the event kicked off with a presentation from 6:00 to 6:45 PM, showing what Cursor can do and how to get the most out of AI-assisted development.',
    'After the presentation, the floor opened for hands-on exploration and conversation. Attendees shared workflows, asked questions, and tried Cursor live for those who brought laptops. The mix of structured learning and open networking made the energy in the room relaxed yet productive.',
    'Drinks and snacks kept the conversations flowing until 8:00 PM. New connections were made, practical tips were exchanged, and the feedback was clear — Novi Sad has a strong interest in AI tools and Cursor in particular.',
  ],
  videoUrl: 'https://www.youtube.com/embed/ixb78UP9ESc',
  photoCredits: [{ name: 'Dušan Petković' }],
  photos: [
    { src: driveImg('1Z-iGL-XSyStIyD6Y4M2D-w9J4DBsAgK0'), alt: 'Presentation and demos' },
    { src: driveImg('1w3S0i4b4EUFHutgE7INx74bzCiM5h1kA'), alt: 'Community members networking' },
    { src: driveImg('1HuB0LNl4JXuy64C5Jc1g-3-9Zn7pi3M0'), alt: 'Cursor Meetup Novi Sad' },
    { src: driveImg('1CHG9qc9IaNvMv42YtYQQiIgWmHtUxeK6'), alt: 'Attendees at the event' },
    { src: driveImg('17sPcRmzi6DJDP31Q2ekhMzq_sk0c1_ej'), alt: 'Group discussion' },
    { src: driveImg('1fz6ZMy9D67ZYehg6rtL2aFcVGICAJRtI'), alt: 'Cursor Meetup Novi Sad' },
    { src: driveImg('1UoeIoKKK91SK1SxtMzaTsF2TdONE4C2X'), alt: 'Event group photo' },
    { src: driveImg('1hBFfcHX32T_HgOLufb8F6Lw3gStuE_HO'), alt: 'Event attendees during the meetup' },
  ],
}

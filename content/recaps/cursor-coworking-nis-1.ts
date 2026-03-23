import { RecapData } from '@/lib/types'

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

export const cursorCoworkingNis1Recap: RecapData = {
  slug: 'cursor-coworking-nis-1',
  title: 'Cursor Coworking Day in Niš - Recap',
  date: 'March 20, 2026',
  attendees: 46,
  summary: [
    'On March 20th, the Cursor community gathered in Niš for a full day of coworking, learning, and networking at Centrala Hub. Builders dropped in for open coworking from midday through the afternoon, with Cursor credits for those who wanted to work hands-on, plus food and drinks to keep the room energized.',
    'At 17:00 we shifted into a focused presentation on Cursor and AI-assisted development, followed by an hour of networking. The mix of quiet heads-down time and structured programming gave newcomers a path in while regulars could compare notes and workflows.',
    'Thank you to everyone who came out — whether you stayed for the whole day or joined for the evening segment. If you want to hear from attendees in their own words, check the interview clips below; more are on the way.',
  ],
  videoUrl: 'https://www.youtube.com/watch?v=m7sUxVwfytA',
  interviews: [
    {
      title: 'Interview — part 1',
      youtubeUrl: 'https://youtu.be/40lMRdi-MHQ',
    },
    {
      title: 'Interview — part 2',
      youtubeUrl: 'https://youtu.be/OZsvzqWw3C4',
    },
    {
      title: 'Interview — part 3',
      youtubeUrl: 'https://youtu.be/Gp2ruLgUTgI',
    },
  ],
  photoCredits: [{ name: 'Cursor Community Serbia' }],
  photos: [
    { src: driveImg('1SspQCSCwKoSE3xmMrI-jxOHywtf8uehF'), alt: 'Coworking and conversation at Cursor Niš' },
    { src: driveImg('1uXg1sVpiqBEDlp-mdMQr20qFRJcs5teg'), alt: 'Attendees at Cursor Coworking Day Niš' },
    { src: driveImg('1zeb69MKRJk6IANEbYzt8RuT2rIsGcbaa'), alt: 'Presentation and demos' },
    { src: driveImg('1zHzQufgoa-IyOPC92GBAMXFfHcynnBxy'), alt: 'Community members networking' },
    { src: driveImg('1HAl2wS_czGRoYddWEY3IegtOt4bLUdnu'), alt: 'Cursor event in Niš' },
    { src: driveImg('18zcpnkLHf8CWHfN3nUIELoG4LX-Gt1uG'), alt: 'Coworking session' },
    { src: driveImg('1ZuvrWqJVdQezr9CEttI-uM1Uc-9Gddl8'), alt: 'Event attendees' },
    { src: driveImg('1SOqpuBx17YP0ufzXHvy1ugnb6ETD68KP'), alt: 'Cursor Coworking Niš' },
    { src: driveImg('1aiDzy-b71MUnEkXPtuauqRbA3vHeHG-Z'), alt: 'Group at Centrala Hub' },
    { src: driveImg('1l7LujwlkCDT885_YdV_RO7ydICi8nVFC'), alt: 'Moments from the day' },
    { src: driveImg('1jlLC7JYhp6MWgYy_JJQO0ThR2RXm88xc'), alt: 'Cursor community Niš' },
    { src: driveImg('1ksOYpecC-ZEMSP_MZkIR5_F7Sek0a7NI'), alt: 'Networking after the presentation' },
  ],
}

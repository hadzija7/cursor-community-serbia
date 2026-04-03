import { RecapData } from '@/lib/types'

/** Gallery source files: https://luma.com/hswzhn5m (same images as shared Drive links) */
const drivePhoto = (id: string) =>
  `https://drive.google.com/uc?export=view&id=${id}`

export const cafeCursorCannes1Recap: RecapData = {
  slug: 'cafe-cursor-cannes-1',
  title: 'Cafe Cursor Cannes - Recap',
  date: 'April 2, 2026',
  attendees: 50,
  summary: [
    'Cafe Cursor Cannes brought builders together for an evening of specialty coffee, conversation, and community around Cursor, AI, and blockchain—hosted on the French Riviera during EthCC week.',
    'The format stayed intentionally small and social: new connections, relaxed demos, and plenty of room to dig into real workflows. The event was organized by the Cursor Community Serbia team (cursorserbia.com) as part of the global Cafe Cursor series.',
    'Thank you to everyone who joined and made it a memorable stop on the community calendar.',
  ],
  photos: [
    { src: drivePhoto('1yDEyEWC-1WACUkMkRIY_Y5EpkJh0Xkkd'), alt: 'Cafe Cursor Cannes — event photo 1' },
    { src: drivePhoto('1-5GR9tQ7bm5FcKq3WSb07l1qYuR1HfU9'), alt: 'Cafe Cursor Cannes — event photo 2' },
    { src: drivePhoto('1peO8jTCjUGpotG2_m6upLeU2HRgFrl9t'), alt: 'Cafe Cursor Cannes — event photo 3' },
    { src: drivePhoto('1WaNLD32SWivtbH3sEuOqYAKvGiIy43eo'), alt: 'Cafe Cursor Cannes — event photo 4' },
    { src: drivePhoto('1XiZlWd9LwMI6WqWXnQwPfILB4M2dEL3J'), alt: 'Cafe Cursor Cannes — event photo 5' },
    { src: drivePhoto('1WDVsezoCd6hnU7-w4ZekecaMDe7T7wxp'), alt: 'Cafe Cursor Cannes — event photo 6' },
    { src: drivePhoto('1-uHNfVY70eizp5YhywpiC6elIxb4q-eF'), alt: 'Cafe Cursor Cannes — event photo 7' },
    { src: drivePhoto('1k3gz731g8N5YUpTm0eIJwwXhu4OPZFoT'), alt: 'Cafe Cursor Cannes — event photo 8' },
    { src: drivePhoto('1raw5-swoDpMdRg5FYxhsYK7LG4liLCmi'), alt: 'Cafe Cursor Cannes — event photo 9' },
    { src: drivePhoto('110aDfDXX3SSjHxRez19jwKXpMdtREDxz'), alt: 'Cafe Cursor Cannes — event photo 10' },
  ],
}

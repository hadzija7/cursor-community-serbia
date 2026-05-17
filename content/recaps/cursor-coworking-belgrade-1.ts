import { RecapData } from '@/lib/types'

/** Luma listing: https://luma.com/9tlvu6ij · Gallery URLs map to Drive file IDs below */

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

export const cursorCoworkingBelgrade1Recap: RecapData = {
  slug: 'cursor-coworking-belgrade-1',
  title: 'Cursor Coworking Day in Belgrade — Recap',
  date: 'May 15, 2026',
  attendees: 41,
  summary: [
    'Forty-one people joined us in Belgrade for a full coworking day with Superteam Balkan — morning workstations, an evening AI workshop, and networking that carried late into conversations about Cursor and on-chain experiments.',
    'From 9:00 to 17:00 the room stayed in flow: Cursor credits for coworkers, coffee breaks, and the kind of ad-hoc help you only get when everyone is shipping in the same space.',
    'At 17:00 we pivoted into a Cursor and AI-focused session — practical patterns, tooling, and Q&A — followed by networking with food and drinks.',
    'Whether people came for the coworking block, the evening talk, or both, the takeaway was the same: new connections, hands-on Cursor energy, and a strong reason to show up again next time.',
  ],
  videoUrl: 'https://youtu.be/ApGre9Btaq0',
  extraPresentations: [
    { youtubeUrl: 'https://youtu.be/f_9HkQrMoCA' },
    { youtubeUrl: 'https://youtu.be/LY9Jd-n1qOA' },
  ],
  photos: [
    { src: driveImg('1BlbLo_xRyF3wGcuywTb5-uzqwh7Ona95'), alt: 'Cursor Coworking Day Belgrade' },
    { src: driveImg('1yRBGY-zQWvzHDTyLizatPJK5vBBE8ZuC'), alt: 'Coworking day in Belgrade' },
    { src: driveImg('1DSIOpWSrxbjw2NE1C-BEJCjFCQHZUvpy'), alt: 'Attendees during coworking' },
    { src: driveImg('1VjIvklAXy4vfnDdf50mr9CafVcw7bLh_'), alt: 'Cursor community Belgrade' },
    { src: driveImg('1HYJ52z7Vo0f3R6ap8644Hzy9t5ui2fXD'), alt: 'Workshop and networking' },
    { src: driveImg('1F14KXGvReQISIbH7m8x1jSFj8nIhcOko'), alt: 'Superteam Balkan × Cursor' },
    { src: driveImg('1MjV0u_hYDXqU5Cz_Jcj3yLZmDiQbwdaz'), alt: 'Coworking space' },
    { src: driveImg('1MM14HjABMaN6OOw33PsvXJ48Pc9kJyO3'), alt: 'Presentation and demos' },
    { src: driveImg('1WEuqTLoPdHRlobc8qAJdMceX3JVhYeNW'), alt: 'Networking' },
    { src: driveImg('1Y5BYXlt0opfn_KmDSY23RXU1RfJIsGSC'), alt: 'Cursor Belgrade event' },
    { src: driveImg('1XN6yvBCEbr_F2-8G2ErgVj7YRu3-d2um'), alt: 'AI workshop' },
    { src: driveImg('1JHNwCBqxErx9FttjXfPEaGzdMfxFxHsk'), alt: 'Community photo' },
    { src: driveImg('1rhlr2q5r5Z7nqKrQ03SjAjg6ke4vkJu8'), alt: 'Closing moments' },
  ],
}

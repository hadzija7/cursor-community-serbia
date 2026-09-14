import { RecapData } from '@/lib/types'

/** Luma listing: https://luma.com/ghvnbjlx · Site: https://hackathon.cursorserbia.com · Gallery URLs map to Drive file IDs below */

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

export const grokBotSerbiaHackathon2026Recap: RecapData = {
  slug: 'grok-bot-serbia-hackathon-2026',
  title: 'Grok Bot Serbia Hackathon — Recap',
  date: 'September 12, 2026',
  attendees: 168,
  summary: [
    'About 168 builders filled Startit in Belgrade for the Grok Bot Serbia Hackathon — a one-day sprint to ship something real with Grok Bot (Cursor welcome), mentors on the floor, and a partner stack ready to use.',
    'Teams leaned on Convex, Daytona, Firecrawl, Exa, Render, Fal.ai, and the rest of the toolkit while mentors circulated, demos took shape, and the room stayed loud with shipping energy from morning through the late-afternoon showcase.',
    'By the end of the day we had 37 project submissions, a packed demo showcase, community voting on the Projects page, and a well-earned pizza party. Huge thanks to Startit for hosting and Superteam Balkan for the community support that made the day feel like home.',
    'Judging and the winners announcement are still in progress — we will share official results when they are ready. Until then, the community favorites on the Projects page already show how much people loved what got built.',
  ],
  photos: [
    { src: driveImg('1a7U21uo5RNx_5YwRTFQluDac1OjseDID'), alt: 'Builders at the Grok Bot Serbia Hackathon at Startit' },
    { src: driveImg('1pqZJoO220-NJskZM37j06IIYYoBlCbmA'), alt: 'Hackathon workspace at Startit Belgrade' },
    { src: driveImg('1ksEqNJZZPSIdJrLViXAkw7c5qvaSE3Cx'), alt: 'Teams collaborating during the hackathon' },
    { src: driveImg('1pmHIVIFr6KSpBQ7A22U2WE8AcxpOnZ2P'), alt: 'Building with Grok Bot and partner tools' },
    { src: driveImg('17Txn9VeSO-yS6rCWllBeNQIWqus4CQNK'), alt: 'Demo preparation on the hackathon floor' },
    { src: driveImg('1qDQnF6U-oY3Nvzw862ZfTMcVLz9JagcC'), alt: 'Mentors and builders in conversation' },
    { src: driveImg('1nOUEPDnKKdhiLD0D_sK9wxr1ZxnD1IzX'), alt: 'Laptop-lined tables at Startit' },
    { src: driveImg('1IS6-BzE2JWgoUdumMI7Ya6CJZQqUYslO'), alt: 'Hackathon crowd during the build day' },
    { src: driveImg('14Boz1RDBabdzRYswzb2monrKkCdVR1WS'), alt: 'Project demos and discussion' },
    { src: driveImg('1nYcrSCTQ8bDqpUJaGL17DMpCkOyQj6rt'), alt: 'Late-afternoon energy at the venue' },
    { src: driveImg('1x4S7RvJP0ksNd0QjpBEwLJPGqUyKZet-'), alt: 'Showcase and community voting vibes' },
    { src: driveImg('1L4GicAqTYia29Z-PfX15xpTlzGIHl2zl'), alt: 'Builders presenting their projects' },
    { src: driveImg('1VuWzHzxqnl_7Xc0omMdrEIcOgBJXj1Xq'), alt: 'Audience watching hackathon demos' },
    { src: driveImg('1w8QVsjojHFjsDdlcHh-nUeBjm92xsJEe'), alt: 'Demo showcase at Grok Bot Serbia Hackathon' },
    { src: driveImg('1qFFgySMrIoAc1E2YvEfLZiwW3YHD9L5x'), alt: 'Teams gathered for project presentations' },
    { src: driveImg('1T8-FsZNXeNpVCqpwkJfXQjmen7Ysm2Xg'), alt: 'Community hanging out after demos' },
    { src: driveImg('1zV6zBLOJ6dj_jYD2OdTRohRN7t5EMEsS'), alt: 'Pizza party and wind-down at Startit' },
    { src: driveImg('1wFJHDe6zXTAZNLHSAOl28FkqeKQaRwmh'), alt: 'Closing moments of the hackathon day' },
  ],
}

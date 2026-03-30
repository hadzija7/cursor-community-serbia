import { RecapData } from '@/lib/types'

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

export const cursorCoworkingNovisad1Recap: RecapData = {
  slug: 'cursor-coworking-novisad-1',
  title: 'Cursor Coworking Day in Novi Sad — Recap',
  date: 'March 29, 2026',
  attendees: 30,
  summary: [
    'On March 29th, thirty of us spent a full day in Novi Sad coworking, learning, and meeting each other. The morning and afternoon were open coworking (10:00–17:00): people dropped in with laptops, used Cursor credits to work hands-on, and traded tips in between focused blocks. Food and drinks kept the room comfortable for both quiet work and casual conversation.',
    'From 17:00 to 18:00 we gathered for a presentation on Cursor and AI-assisted development, then stayed for another hour of networking. The mix of structured programming and open time worked well for newcomers who wanted an on-ramp as well as for regulars comparing workflows.',
    'Thank you to everyone who came — whether you were there for the whole day or joined for the evening segment. If you could not make it, the full talk from the event is available to watch below.',
  ],
  videoUrl: 'https://youtu.be/YaWtLDdTMWk',
  photoCredits: [{ name: 'Cursor Community Serbia' }],
  photos: [
    { src: driveImg('1w3sm1HJ0J5ozZEVp9-asQ9wOTKBSKfVI'), alt: 'Cursor Coworking Day Novi Sad' },
    { src: driveImg('1MXk5rmNcg8E1SrLVepVRMoR7SSTF1SDr'), alt: 'Attendees coworking' },
    { src: driveImg('1089LkUlqWsAXRHIKdR1t2Sao5U1Tjdlk'), alt: 'Community at the venue' },
    { src: driveImg('1ouUnog1KLARP1K8ojOSG8IKD0hfaLXue'), alt: 'Laptops and conversation' },
    { src: driveImg('1iDTUWjJ_FzxO-AfQDInbtQwqHIgwYlGj'), alt: 'Coworking session' },
    { src: driveImg('10cakFNp5exnYqTdBQenbJxhZJTpcQQj4'), alt: 'Event in Novi Sad' },
    { src: driveImg('1VI9r5xIX7-OuWlO6PV1SJQBZA8xtTddN'), alt: 'Presentation and demos' },
    { src: driveImg('1S_LLWVnbwIWhGV7lvv_X-CPhnkfNGI1H'), alt: 'Networking' },
    { src: driveImg('1fzHYV0_WXuHbDgsTqV7M2jUgfNZJezse'), alt: 'Cursor community members' },
    { src: driveImg('1nGxUOUjgQ9XxHhgo_z4t66s4GEASjgOG'), alt: 'Moments from the day' },
    { src: driveImg('19_bJ4CnO_QA4MgiOWtNMmRA5m_ZnS2HM'), alt: 'Cursor Coworking Novi Sad' },
    { src: driveImg('1Ly6Sx6_B3FFcxLp2g8DJTonZjz3vywwW'), alt: 'Group at the event' },
    { src: driveImg('10_kNRytDcHH10Q7D8t0G1qmQzQTNv43H'), alt: 'Closing moments' },
  ],
}

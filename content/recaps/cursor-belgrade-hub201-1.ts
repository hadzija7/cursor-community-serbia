import { RecapData } from '@/lib/types'

function driveImg(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`
}

export const cursorBelgradeHub201Meetup1Recap: RecapData = {
  slug: 'cursor-belgrade-hub201-1',
  title: 'Cursor Belgrade Hub201 Meetup - Recap',
  date: 'April 8, 2026',
  attendees: 40,
  summary: [
    'Forty people joined us in the amphitheatre at Hub201 in Belgrade for an evening focused on AI-driven development in cybersecurity. The room mixed developers, security practitioners, and Cursor enthusiasts ready to go deep on real workflows.',
    'Henry Wildermuth from Cursor took the stage for a talk and open Q&A, giving the group a clear view of how Cursor thinks about agents, product direction, and day-to-day use in professional settings.',
    'Aleksandar Hadžibabić followed with a hands-on demo of Cursor—practical patterns, concrete examples, and plenty of room for questions so people could see how the ideas land in actual projects.',
    'We closed with networking and sidebar conversations that carried the energy of the meetup well past the formal program.',
  ],
  videoUrl: 'https://youtu.be/_74ADFhLXZk',
  extraPresentations: [{ youtubeUrl: 'https://youtu.be/8OCQdietBCM' }],
  photos: [
    { src: driveImg('1hdysREWIcVBNH_TdtcqVI04Z_YDQaUyh'), alt: 'Cursor Belgrade Hub201 meetup' },
    { src: driveImg('1xczj8nYSXQTPnkEW9VSxHwg8sfBKhFwM'), alt: 'Attendees at Hub201' },
    { src: driveImg('19LcpvtDJNWGCoSi_DqGUHUWEz5xkRffd'), alt: 'Meetup session' },
    { src: driveImg('1hdUq9iNG8APZoyR3qneaizuo1CTMeQ_p'), alt: 'Presentation and demos' },
    { src: driveImg('1QkCuXuEEJAQA4Az3i1cj9cD-tvQQf1AI'), alt: 'Cursor community at Hub201' },
    { src: driveImg('16-rO9QD39nQvSPaMH81Qmo-MYyE46kkx'), alt: 'Hub201 amphitheatre' },
  ],
}

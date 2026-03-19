import { upcomingEvents } from '@/content/events'
import { isFutureEvent } from '@/lib/event-time'
import { fetchLumaUpcomingEvents } from '@/lib/luma'

function staticUpcomingEvents() {
  return upcomingEvents.filter(isFutureEvent)
}

export async function GET() {
  const apiKey = process.env.LUMA_API_KEY

  if (!apiKey) {
    return Response.json({
      source: 'static',
      events: staticUpcomingEvents(),
      updatedAt: new Date().toISOString(),
    })
  }

  try {
    const events = await fetchLumaUpcomingEvents({
      apiKey,
      baseUrl: process.env.LUMA_API_BASE_URL,
    })

    return Response.json({
      source: 'luma',
      events,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to load Luma events:', error)
    return Response.json({
      source: 'fallback',
      events: staticUpcomingEvents(),
      updatedAt: new Date().toISOString(),
    })
  }
}

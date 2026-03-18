import type { CursorEvent } from '@/lib/types'

export function cetOffsetFor(dateStr: string): string {
  const jan = new Date(`${dateStr.slice(0, 4)}-01-15T12:00:00Z`)
  const jul = new Date(`${dateStr.slice(0, 4)}-07-15T12:00:00Z`)
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
  const target = new Date(`${dateStr}T12:00:00Z`)
  const isDST =
    new Intl.DateTimeFormat('en', { timeZone: 'Europe/Belgrade', timeZoneName: 'short' })
      .formatToParts(target)
      .find((p) => p.type === 'timeZoneName')?.value?.includes('summer') ||
    target.getTimezoneOffset() < stdOffset
  return isDST ? '+02:00' : '+01:00'
}

export function eventStartMs(dateStr: string, time = '18:00') {
  const offset = cetOffsetFor(dateStr)
  return new Date(`${dateStr}T${time}:00${offset}`).getTime()
}

export function isFutureEvent(event: CursorEvent) {
  return eventStartMs(event.date, event.time) > Date.now()
}

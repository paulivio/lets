import type { Booking } from '../types'
import { ROOMS, ROOM_COLORS, SITES, CLIENTS } from '../constants'

// re-export so consumers can import from here
export { ROOM_COLORS }

function randInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}
function randOf<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)]
}

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}
function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

const STATUSES = ['Confirmed', 'Confirmed', 'Confirmed', 'Pending', 'Cancelled'] as const

export function generateSampleBookings(): Booking[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const bookings: Booking[] = []
  let id = 1

  for (let d = -3; d <= 10; d++) {
    const date = addDays(today, d)
    const ds = dateStr(date)
    const perDay = randInt(2, 7)
    for (let b = 0; b < perDay; b++) {
      const site = randOf(SITES)
      const room = randOf(ROOMS)
      const startH = randInt(8, 16)
      const dur = randInt(1, 3)
      const endH = Math.min(startH + dur, 20)
      bookings.push({
        id: id++,
        site,
        room,
        date: ds,
        startTime: `${String(startH).padStart(2, '0')}:00`,
        endTime: `${String(endH).padStart(2, '0')}:00`,
        booking: `BK-${String(1000 + id).slice(1)}`,
        client: randOf(CLIENTS),
        status: randOf(STATUSES),
        allocation: null,
      })
    }
  }
  return bookings
}

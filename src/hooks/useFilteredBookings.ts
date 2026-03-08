import { useMemo } from 'react'
import type { Booking } from '../types'
import { useDashboard } from '../context/DashboardContext'

export function useFilteredBookings(): Booking[] {
  const { state } = useDashboard()
  const { bookings, filterSite, filterRoom } = state

  return useMemo(
    () =>
      bookings.filter((b) => {
        if (filterSite && b.site !== filterSite) return false
        if (filterRoom && b.room !== filterRoom) return false
        return true
      }),
    [bookings, filterSite, filterRoom],
  )
}

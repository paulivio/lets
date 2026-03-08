import { useMemo } from 'react'
import type { Booking } from '../types'
import { useDashboard } from '../context/DashboardContext'

export function useFilteredBookings(): Booking[] {
  const { state } = useDashboard()
  const { bookings, filterSite, filterRoom, filterAllocation } = state

  return useMemo(
    () =>
      bookings.filter((b) => {
        if (filterSite && b.site !== filterSite) return false
        if (filterRoom && b.room !== filterRoom) return false
        if (filterAllocation === 'FT' && b.allocation !== 'FT') return false
        if (filterAllocation === 'CO' && b.allocation !== 'CO') return false
        if (filterAllocation === 'unallocated' && b.allocation !== null) return false
        return true
      }),
    [bookings, filterSite, filterRoom, filterAllocation],
  )
}

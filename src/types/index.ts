export type Allocation = 'FT' | 'CO'

export interface Booking {
  id: number
  site: string
  room: string
  date: string       // YYYY-MM-DD
  startTime: string  // HH:00
  endTime: string    // HH:00
  booking: string
  client: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  allocation: Allocation | null
}

export type View = 'calendar' | 'grid' | 'table' | 'rooms'

export interface DashboardState {
  bookings: Booking[]
  view: View
  weekOffset: number
  filterSite: string
  filterRoom: string
  filterAllocation: 'FT' | 'CO' | 'unallocated' | ''
  sortKey: keyof Booking
  sortDir: 1 | -1
  tableSearch: string
  tableStatusFilter: string
  activeRoomFilter: string | null
}

export type DashboardAction =
  | { type: 'SET_BOOKINGS'; bookings: Booking[] }
  | { type: 'SET_VIEW'; view: View }
  | { type: 'SET_WEEK_OFFSET'; offset: number }
  | { type: 'SET_FILTER_SITE'; site: string }
  | { type: 'SET_FILTER_ROOM'; room: string }
  | { type: 'SET_FILTER_ALLOCATION'; allocation: DashboardState['filterAllocation'] }
  | { type: 'SET_SORT'; key: keyof Booking }
  | { type: 'SET_TABLE_SEARCH'; search: string }
  | { type: 'SET_TABLE_STATUS'; status: string }
  | { type: 'SET_ACTIVE_ROOM_FILTER'; room: string | null }
  | { type: 'SET_ALLOCATION'; id: number; allocation: Allocation | null }

import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { DashboardState, DashboardAction } from '../types'
import { generateSampleBookings } from '../data/sample'

const initialState: DashboardState = {
  bookings: generateSampleBookings(),
  view: 'calendar',
  weekOffset: 0,
  filterSite: '',
  filterRoom: '',
  sortKey: 'date',
  sortDir: 1,
  tableSearch: '',
  tableStatusFilter: '',
  activeRoomFilter: null,
}

function reducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.bookings }
    case 'SET_VIEW':
      return { ...state, view: action.view }
    case 'SET_WEEK_OFFSET':
      return { ...state, weekOffset: action.offset }
    case 'SET_FILTER_SITE':
      return { ...state, filterSite: action.site }
    case 'SET_FILTER_ROOM':
      return { ...state, filterRoom: action.room }
    case 'SET_SORT':
      return {
        ...state,
        sortKey: action.key,
        sortDir: state.sortKey === action.key ? (state.sortDir === 1 ? -1 : 1) : 1,
      }
    case 'SET_TABLE_SEARCH':
      return { ...state, tableSearch: action.search }
    case 'SET_TABLE_STATUS':
      return { ...state, tableStatusFilter: action.status }
    case 'SET_ACTIVE_ROOM_FILTER':
      return { ...state, activeRoomFilter: action.room }
    default:
      return state
  }
}

interface ContextValue {
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
}

const DashboardContext = createContext<ContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}

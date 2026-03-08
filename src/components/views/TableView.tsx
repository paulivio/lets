import { useMemo } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { useFilteredBookings } from '../../hooks/useFilteredBookings'
import { RoomTag } from '../ui/RoomTag'
import { StatusTag } from '../ui/StatusTag'
import { AllocationToggle } from '../ui/AllocationToggle'
import type { Booking } from '../../types'

interface Props {
  onHover: (b: Booking | null, e?: React.MouseEvent) => void
}

const COLUMNS: { key: keyof Booking; label: string }[] = [
  { key: 'site', label: 'SITE' },
  { key: 'room', label: 'ROOM' },
  { key: 'date', label: 'DATE' },
  { key: 'startTime', label: 'START' },
  { key: 'endTime', label: 'END' },
  { key: 'booking', label: 'BOOKING REF' },
  { key: 'client', label: 'CLIENT' },
  { key: 'status', label: 'STATUS' },
]

export function TableView({ onHover }: Props) {
  const { state, dispatch } = useDashboard()
  const filtered = useFilteredBookings()

  const rows = useMemo(() => {
    const search = state.tableSearch.toLowerCase()
    const statusFilter = state.tableStatusFilter
    return filtered
      .filter((b) => {
        const hay = `${b.site} ${b.room} ${b.date} ${b.booking} ${b.client} ${b.status}`.toLowerCase()
        if (search && !hay.includes(search)) return false
        if (statusFilter && b.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        const av = String(a[state.sortKey] ?? '')
        const bv = String(b[state.sortKey] ?? '')
        return av < bv ? -state.sortDir : av > bv ? state.sortDir : 0
      })
  }, [filtered, state.tableSearch, state.tableStatusFilter, state.sortKey, state.sortDir])

  const sortIndicator = (key: keyof Booking) => {
    if (state.sortKey !== key) return ' ↕'
    return state.sortDir === 1 ? ' ↑' : ' ↓'
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-2.5 mb-3.5 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search bookings, sites, rooms…"
          value={state.tableSearch}
          onChange={(e) => dispatch({ type: 'SET_TABLE_SEARCH', search: e.target.value })}
          className="flex-1 min-w-[180px] px-3 py-1.5 rounded-md text-xs outline-none"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: "'DM Mono', monospace",
          }}
        />
        <select
          value={state.tableStatusFilter}
          onChange={(e) => dispatch({ type: 'SET_TABLE_STATUS', status: e.target.value })}
          className="px-3 py-1.5 rounded-md text-xs outline-none cursor-pointer"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: "'DM Mono', monospace",
          }}
        >
          <option value="">All Statuses</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className="w-full"
          style={{
            borderCollapse: 'collapse',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ background: 'var(--surface2)' }}>
              {COLUMNS.map(({ key, label }) => (
                <th
                  key={key}
                  className="px-3.5 py-2.5 text-left text-[10px] tracking-widest uppercase whitespace-nowrap select-none cursor-pointer transition-colors"
                  style={{
                    color: state.sortKey === key ? 'var(--accent)' : 'var(--muted)',
                    borderBottom: '1px solid var(--border)',
                    fontFamily: "'DM Mono', monospace",
                  }}
                  onClick={() => dispatch({ type: 'SET_SORT', key })}
                >
                  {label}{sortIndicator(key)}
                </th>
              ))}
              <th
                className="px-3.5 py-2.5 text-left text-[10px] tracking-widest uppercase whitespace-nowrap"
                style={{
                  color: 'var(--muted)',
                  borderBottom: '1px solid var(--border)',
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                COVERAGE
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-12"
                  style={{ color: 'var(--muted)' }}
                >
                  No bookings match your filters
                </td>
              </tr>
            ) : (
              rows.map((b) => (
                <tr
                  key={b.id}
                  className="transition-colors cursor-default"
                  style={{ borderBottom: '1px solid rgba(42,47,61,0.6)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface2)'
                    onHover(b, e)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = ''
                    onHover(null)
                  }}
                >
                  <td className="px-3.5 py-2 text-xs"><strong>{b.site}</strong></td>
                  <td className="px-3.5 py-2 text-xs"><RoomTag room={b.room} /></td>
                  <td className="px-3.5 py-2 text-xs">{b.date}</td>
                  <td className="px-3.5 py-2 text-xs">{b.startTime}</td>
                  <td className="px-3.5 py-2 text-xs">{b.endTime}</td>
                  <td className="px-3.5 py-2 text-xs" style={{ color: 'var(--muted)' }}>{b.booking}</td>
                  <td className="px-3.5 py-2 text-xs">{b.client}</td>
                  <td className="px-3.5 py-2 text-xs"><StatusTag status={b.status} /></td>
                  <td className="px-3.5 py-2 text-xs">
                    <AllocationToggle booking={b} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

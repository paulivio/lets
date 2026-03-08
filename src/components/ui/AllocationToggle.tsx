import { useDashboard } from '../../context/DashboardContext'
import type { Booking, Allocation } from '../../types'

export const ALLOC_COLORS: Record<Allocation, string> = {
  FT: '#00c2a8',
  CO: '#a78bfa',
}

interface Props {
  booking: Booking
  /** compact = single cycling pill for tight spaces (calendar/grid/roommap) */
  compact?: boolean
}

export function AllocationToggle({ booking, compact = false }: Props) {
  const { dispatch } = useDashboard()

  function set(val: Allocation, e: React.MouseEvent) {
    e.stopPropagation()
    dispatch({
      type: 'SET_ALLOCATION',
      id: booking.id,
      allocation: booking.allocation === val ? null : val,
    })
  }

  if (compact) {
    // Cycles: null → FT → CO → null
    const next: Allocation | null =
      booking.allocation === null ? 'FT' : booking.allocation === 'FT' ? 'CO' : null

    const color = booking.allocation ? ALLOC_COLORS[booking.allocation] : undefined

    return (
      <button
        title={
          booking.allocation
            ? `Allocated: ${booking.allocation} — click to change`
            : 'Unallocated — click to assign FT'
        }
        onClick={(e) => {
          e.stopPropagation()
          dispatch({ type: 'SET_ALLOCATION', id: booking.id, allocation: next })
        }}
        style={{
          background: color ? `${color}22` : 'rgba(0,0,0,0.25)',
          border: `1px solid ${color ?? 'rgba(255,255,255,0.15)'}`,
          color: color ?? 'rgba(255,255,255,0.45)',
          borderRadius: 3,
          padding: '1px 5px',
          fontSize: 9,
          fontWeight: 600,
          fontFamily: "'DM Mono', monospace",
          cursor: 'pointer',
          lineHeight: 1.4,
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}
      >
        {booking.allocation ?? '—'}
      </button>
    )
  }

  // Full two-button toggle for table view
  return (
    <div className="flex gap-1">
      {(['FT', 'CO'] as const).map((val) => {
        const isActive = booking.allocation === val
        return (
          <button
            key={val}
            onClick={(e) => set(val, e)}
            style={{
              background: isActive ? ALLOC_COLORS[val] : 'var(--surface2)',
              color: isActive ? '#000' : 'var(--muted)',
              border: `1px solid ${isActive ? ALLOC_COLORS[val] : 'var(--border)'}`,
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "'DM Mono', monospace",
              cursor: 'pointer',
              transition: 'all 0.12s',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = ALLOC_COLORS[val]
                e.currentTarget.style.color = ALLOC_COLORS[val]
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--muted)'
              }
            }}
          >
            {val}
          </button>
        )
      })}
    </div>
  )
}

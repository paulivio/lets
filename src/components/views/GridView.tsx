import { useMemo } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { useFilteredBookings } from '../../hooks/useFilteredBookings'
import { ROOMS, ROOM_COLORS, SITES } from '../../constants'
import { AllocationToggle, ALLOC_COLORS } from '../ui/AllocationToggle'
import type { Booking } from '../../types'

interface Props {
  onHover: (b: Booking | null, e?: React.MouseEvent) => void
}

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function GridView({ onHover }: Props) {
  const { state } = useDashboard()
  const filtered = useFilteredBookings()

  const todayStr = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return dateStr(t)
  }, [])

  const sitesToShow = state.filterSite ? [state.filterSite] : SITES

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
    >
      {sitesToShow.map((site) => {
        const sb = filtered.filter((b) => b.site === site)
        const rooms = state.filterRoom ? [state.filterRoom] : [...ROOMS]
        const activeRooms = rooms.filter((r) => sb.some((b) => b.room === r))

        const todayB = sb.filter((b) => b.date === todayStr)
        const nextB = sb.filter((b) => b.date > todayStr).slice(0, 5)
        const displayB = todayB.length ? todayB : nextB

        const unallocated = sb.filter((b) => !b.allocation).length

        return (
          <div
            key={site}
            className="rounded-[10px] overflow-hidden transition-colors"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent2)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {/* Card header */}
            <div
              className="px-[18px] py-[14px] flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div>
                <div className="font-[Syne,sans-serif] font-bold text-[15px]">{site}</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  {sb.length} bookings · {activeRooms.length} rooms active
                  {unallocated > 0 && (
                    <span style={{ color: '#e05a8a', marginLeft: 6 }}>· {unallocated} unallocated</span>
                  )}
                </div>
              </div>
              <div
                className="px-2.5 py-0.5 rounded-full text-[10px]"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--accent2)' }}
              >
                {todayB.length} today
              </div>
            </div>

            {/* Time axis */}
            <div className="px-[18px] pt-2 pb-1.5">
              <div className="flex ml-[80px]">
                {['08:00', '11:00', '14:00', '17:00', '20:00'].map((t) => (
                  <span key={t} className="flex-1 text-[9px]" style={{ color: 'var(--muted)' }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Room rows */}
            <div className="pb-2">
              {activeRooms.length === 0 ? (
                <div className="px-[18px] py-4 text-[11px]" style={{ color: 'var(--muted)' }}>
                  No bookings in this period
                </div>
              ) : (
                activeRooms.map((room) => {
                  const rb = displayB.filter((b) => b.room === room)
                  const color = ROOM_COLORS[room as keyof typeof ROOM_COLORS] ?? '#888'
                  return (
                    <div key={room} className="px-[18px] py-1.5 flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <div className="w-[70px] text-[11px] whitespace-nowrap" style={{ color: 'var(--muted)' }}>
                        {room}
                      </div>
                      <div
                        className="flex-1 h-[22px] rounded relative overflow-hidden"
                        style={{ background: 'var(--surface2)' }}
                      >
                        {rb.map((b) => {
                          const sH = parseInt(b.startTime) - 8
                          const eH = parseInt(b.endTime) - 8
                          const total = 12
                          const left = ((sH / total) * 100).toFixed(1) + '%'
                          const width = (((eH - sH) / total) * 100).toFixed(1) + '%'
                          const allocColor = b.allocation ? ALLOC_COLORS[b.allocation] : undefined
                          return (
                            <div
                              key={b.id}
                              className="absolute h-full rounded flex items-center justify-between px-1 overflow-hidden cursor-default transition-opacity hover:opacity-80"
                              style={{
                                left, width, background: color,
                                // teal/purple left border when allocated
                                boxShadow: allocColor ? `inset 3px 0 0 ${allocColor}` : undefined,
                              }}
                              onMouseEnter={(e) => onHover(b, e)}
                              onMouseLeave={() => onHover(null)}
                            >
                              <span className="text-[9px] font-medium text-black truncate">
                                {b.startTime.slice(0, 5)}
                              </span>
                              <AllocationToggle booking={b} compact />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

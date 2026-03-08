import { useMemo } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { useFilteredBookings } from '../../hooks/useFilteredBookings'
import { ROOMS, ROOM_COLORS, SITES } from '../../constants'
import type { Booking } from '../../types'

interface Props {
  onHover: (b: Booking | null, e?: React.MouseEvent) => void
}

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function RoomMapView({ onHover }: Props) {
  const { state, dispatch } = useDashboard()
  const filtered = useFilteredBookings()

  const todayStr = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return dateStr(t)
  }, [])

  const days = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => addDays(t, i - 1))
  }, [])

  const sitesToShow = state.filterSite ? [state.filterSite] : SITES
  const roomsToShow = state.activeRoomFilter
    ? [state.activeRoomFilter]
    : state.filterRoom
    ? [state.filterRoom]
    : [...ROOMS]

  return (
    <div>
      {/* Legend */}
      <div className="flex gap-3 mb-[18px] flex-wrap">
        {ROOMS.map((r) => {
          const color = ROOM_COLORS[r]
          const isActive = state.activeRoomFilter === r
          return (
            <div
              key={r}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] cursor-pointer transition-all"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${isActive ? color : 'var(--border)'}`,
                color: isActive ? color : 'var(--text)',
              }}
              onClick={() =>
                dispatch({
                  type: 'SET_ACTIVE_ROOM_FILTER',
                  room: state.activeRoomFilter === r ? null : r,
                })
              }
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {r}
            </div>
          )
        })}
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `110px repeat(7, 1fr)`,
            border: '1px solid var(--border)',
          }}
        >
          {/* Header row */}
          <div
            className="p-2 text-center text-[10px] font-semibold font-[Syne,sans-serif]"
            style={{
              background: 'var(--surface2)',
              borderBottom: '1px solid var(--border)',
              borderRight: '1px solid var(--border)',
              color: 'var(--muted)',
            }}
          >
            SITE / ROOM
          </div>
          {days.map((d, i) => (
            <div
              key={i}
              className="p-2 text-center text-[10px] font-semibold font-[Syne,sans-serif]"
              style={{
                background: 'var(--surface2)',
                borderBottom: '1px solid var(--border)',
                borderRight: i < 6 ? '1px solid var(--border)' : undefined,
                color: dateStr(d) === todayStr ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              {fmtDate(d)}
            </div>
          ))}

          {/* Data rows */}
          {sitesToShow.flatMap((site) =>
            roomsToShow.map((room) => {
              const color = ROOM_COLORS[room as keyof typeof ROOM_COLORS] ?? '#888'
              return [
                <div
                  key={`${site}-${room}-label`}
                  className="p-3 flex flex-col gap-0.5 text-[11px]"
                  style={{
                    background: 'var(--surface)',
                    borderBottom: '1px solid var(--border)',
                    borderRight: '1px solid var(--border)',
                  }}
                >
                  <strong className="font-[Syne,sans-serif] text-[12px]" style={{ color }}>
                    {room}
                  </strong>
                  <span className="text-[9px]" style={{ color: 'var(--muted)' }}>
                    {site.split(' ')[0]}
                  </span>
                </div>,
                ...days.map((d, di) => {
                  const ds = dateStr(d)
                  const dayB = filtered.filter(
                    (b) => b.site === site && b.room === room && b.date === ds,
                  )
                  return (
                    <div
                      key={`${site}-${room}-${di}`}
                      className="p-1 flex flex-col gap-0.5 min-h-[52px]"
                      style={{
                        borderBottom: '1px solid var(--border)',
                        borderRight: di < 6 ? '1px solid var(--border)' : undefined,
                      }}
                    >
                      {dayB.map((b) => (
                        <div
                          key={b.id}
                          className="rounded px-1.5 py-0.5 text-[9px] font-medium text-black leading-snug whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
                          style={{ background: color }}
                          title={`${b.client} (${b.status})`}
                          onMouseEnter={(e) => onHover(b, e)}
                          onMouseLeave={() => onHover(null)}
                        >
                          {b.startTime}–{b.endTime}
                        </div>
                      ))}
                    </div>
                  )
                }),
              ]
            }),
          )}
        </div>
      </div>
    </div>
  )
}

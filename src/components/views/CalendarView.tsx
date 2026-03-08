import { useMemo } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { useFilteredBookings } from '../../hooks/useFilteredBookings'
import { HOURS, ROOM_COLORS } from '../../constants'
import type { Booking } from '../../types'

interface Props {
  onHover: (b: Booking | null, e?: React.MouseEvent) => void
}

function getWeekStart(offset: number): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff + offset * 7)
  return d
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10)
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarView({ onHover }: Props) {
  const { state, dispatch } = useDashboard()
  const filtered = useFilteredBookings()

  const todayStr = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return dateStr(t)
  }, [])

  const ws = getWeekStart(state.weekOffset)
  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i))
  const weekLabel = `${fmtDate(days[0])} – ${fmtDate(days[6])}`

  return (
    <div>
      {/* Week nav */}
      <div className="flex items-center gap-3 mb-4">
        <button
          className="px-3 py-1.5 text-xs rounded-md cursor-pointer transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          onClick={() => dispatch({ type: 'SET_WEEK_OFFSET', offset: state.weekOffset - 1 })}
        >
          ← Prev Week
        </button>
        <span className="font-[Syne,sans-serif] font-bold text-[15px]" style={{ color: 'var(--text)' }}>
          {weekLabel}
        </span>
        <button
          className="px-3 py-1.5 text-xs rounded-md cursor-pointer transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          onClick={() => dispatch({ type: 'SET_WEEK_OFFSET', offset: state.weekOffset + 1 })}
        >
          Next Week →
        </button>
        <button
          className="px-3 py-1.5 text-xs rounded-md cursor-pointer ml-2 transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
          onClick={() => dispatch({ type: 'SET_WEEK_OFFSET', offset: 0 })}
        >
          Today
        </button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div
          className="grid rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: '90px repeat(7, 1fr)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Header row */}
          <div
            className="p-2.5 text-center text-xs font-[Syne,sans-serif] font-semibold"
            style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}
          />
          {days.map((d, i) => (
            <div
              key={i}
              className="p-2.5 text-center text-xs font-[Syne,sans-serif] font-semibold"
              style={{
                background: 'var(--surface2)',
                borderBottom: '1px solid var(--border)',
                borderRight: i < 6 ? '1px solid var(--border)' : undefined,
                color: dateStr(d) === todayStr ? 'var(--accent)' : 'var(--text)',
              }}
            >
              {DAY_LABELS[i]}
              <br />
              <span className="text-[15px] font-bold">{d.getDate()}</span>
            </div>
          ))}

          {/* Time column */}
          <div style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start pt-1 px-2 text-[10px]"
                style={{
                  height: 52,
                  color: 'var(--muted)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d, di) => {
            const ds = dateStr(d)
            const dayBookings = filtered.filter((b) => b.date === ds)
            return (
              <div
                key={di}
                className="relative"
                style={{ borderRight: di < 6 ? '1px solid var(--border)' : undefined }}
              >
                {HOURS.map((h) => (
                  <div
                    key={h}
                    style={{
                      height: 52,
                      borderBottom: 'none',
                      borderBottomColor: 'rgba(42,47,61,0.5)',
                    }}
                  />
                ))}
                {dayBookings.map((b) => {
                  const startH = parseInt(b.startTime)
                  const endH = parseInt(b.endTime)
                  const top = (startH - 8) * 52
                  const height = (endH - startH) * 52 - 2
                  const color = ROOM_COLORS[b.room as keyof typeof ROOM_COLORS] ?? '#888'
                  return (
                    <div
                      key={b.id}
                      className="absolute left-[3px] right-[3px] rounded text-[10px] leading-snug cursor-pointer overflow-hidden z-[2] transition-opacity hover:opacity-85"
                      style={{ top, height, background: color, padding: '3px 6px' }}
                      onMouseEnter={(e) => onHover(b, e)}
                      onMouseLeave={() => onHover(null)}
                    >
                      <div className="font-medium">{b.site.split(' ')[0]}</div>
                      <div className="opacity-85 text-[9px]">{b.room} · {b.startTime}–{b.endTime}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

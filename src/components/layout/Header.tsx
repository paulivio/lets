import { useRef } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { useFilteredBookings } from '../../hooks/useFilteredBookings'
import type { Booking } from '../../types'

// Dynamic SheetJS import
async function parseFile(file: File): Promise<Booking[]> {
  const xlsx = await import('xlsx')
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const wb = xlsx.read(ev.target!.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = xlsx.utils.sheet_to_json<Record<string, unknown>>(ws)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const bookings: Booking[] = data.map((row, i) => ({
          id: i + 1,
          site: String(row.site ?? row.Site ?? row.SITE ?? 'Unknown'),
          room: String(row.room ?? row.Room ?? row.ROOM ?? 'Room A'),
          date: String(row.date ?? row.Date ?? row.DATE ?? today.toISOString().slice(0, 10)),
          startTime: String(row.startTime ?? row.start_time ?? row['Start Time'] ?? '09:00'),
          endTime: String(row.endTime ?? row.end_time ?? row['End Time'] ?? '17:00'),
          booking: String(row.booking ?? row.Booking ?? row['Booking Ref'] ?? `BK-${1000 + i}`),
          client: String(row.client ?? row.Client ?? row.CLIENT ?? 'Unknown'),
          status: (['Confirmed', 'Pending', 'Cancelled'].includes(String(row.status ?? row.Status ?? ''))
            ? String(row.status ?? row.Status)
            : 'Confirmed') as Booking['status'],
          allocation: null,
        }))
        resolve(bookings)
      } catch {
        reject(new Error('Could not parse file. Ensure it has columns: site, room, date, startTime, endTime, client, status'))
      }
    }
    reader.readAsBinaryString(file)
  })
}

export function Header() {
  const { dispatch } = useDashboard()
  const filtered = useFilteredBookings()
  const fileRef = useRef<HTMLInputElement>(null)

  const sites = new Set(filtered.map((b) => b.site)).size
  const rooms = new Set(filtered.map((b) => b.room + b.site)).size
  const unallocated = filtered.filter((b) => !b.allocation).length

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const bookings = await parseFile(file)
      dispatch({ type: 'SET_BOOKINGS', bookings })
      alert(`✓ Loaded ${bookings.length} bookings from ${file.name}`)
    } catch (err) {
      alert(String(err))
    }
    e.target.value = ''
  }

  return (
    <header
      className="px-7 py-[18px] flex items-center justify-between sticky top-0 z-[100]"
      style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-4">
        <div
          className="font-[Syne,sans-serif] font-black text-[18px] tracking-tight"
          style={{ color: 'var(--accent)' }}
        >
          SITE<span style={{ color: 'var(--text)' }}>COVER</span>
        </div>
        <div
          className="px-2.5 py-0.5 rounded text-[11px] tracking-widest"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
        >
          COVERAGE PLANNER
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-6">
          {[
            { val: sites, label: 'SITES' },
            { val: filtered.length, label: 'BOOKINGS' },
            { val: rooms, label: 'ROOMS USED' },
            { val: unallocated, label: 'UNALLOCATED', warn: unallocated > 0 },
          ].map(({ val, label, warn }) => (
            <div key={label} className="text-right">
              <div
                className="font-[Syne,sans-serif] font-bold text-xl leading-none"
                style={{ color: warn ? '#e05a8a' : 'var(--accent)' }}
              >
                {val}
              </div>
              <div className="text-[10px] mt-0.5 tracking-widest" style={{ color: 'var(--muted)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
        <button
          className="px-5 py-2 rounded-md text-xs font-medium cursor-pointer transition-opacity hover:opacity-85"
          style={{ background: 'var(--accent)', color: '#000', border: 'none', fontFamily: "'DM Mono', monospace" }}
          onClick={() => fileRef.current?.click()}
        >
          ↑ Import Excel
        </button>
      </div>
    </header>
  )
}

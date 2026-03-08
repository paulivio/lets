import { useMemo } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import type { Allocation } from '../../types'

const FT_COLOR = '#00c2a8'
const CO_COLOR = '#a78bfa'
const ALLOC_COLORS: Record<Allocation, string> = { FT: FT_COLOR, CO: CO_COLOR }

function dateStr(d: Date) { return d.toISOString().slice(0, 10) }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function fmtDay(ds: string) {
  const d = new Date(ds + 'T00:00:00')
  const today = new Date(); today.setHours(0,0,0,0)
  if (ds === dateStr(today)) return 'Today'
  const tomorrow = addDays(today, 1)
  if (ds === dateStr(tomorrow)) return 'Tomorrow'
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function SiteCoveragePanel() {
  const { state, dispatch } = useDashboard()

  // Build window: today through next 13 days
  const { todayStr, window } = useMemo(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0)
    const ts = dateStr(t)
    const win = Array.from({ length: 14 }, (_, i) => dateStr(addDays(t, i)))
    return { todayStr: ts, window: win }
  }, [])

  // Find site+date pairs in window that have bookings
  const siteDates = useMemo(() => {
    const map = new Map<string, { site: string; date: string; count: number }>()
    for (const b of state.bookings) {
      if (!window.includes(b.date)) continue
      const key = `${b.site}__${b.date}`
      if (!map.has(key)) map.set(key, { site: b.site, date: b.date, count: 0 })
      map.get(key)!.count++
    }
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date) || a.site.localeCompare(b.site))
  }, [state.bookings, window])

  // Group by site
  const bySite = useMemo(() => {
    const map = new Map<string, { site: string; date: string; count: number }[]>()
    for (const sd of siteDates) {
      if (!map.has(sd.site)) map.set(sd.site, [])
      map.get(sd.site)!.push(sd)
    }
    return [...map.entries()].map(([site, dates]) => ({ site, dates }))
  }, [siteDates])

  const totalSlots = siteDates.length
  const confirmedSlots = siteDates.filter(({ site, date }) => state.siteAllocations[`${site}__${date}`]).length
  const allConfirmed = totalSlots > 0 && confirmedSlots === totalSlots

  function toggle(site: string, date: string, val: Allocation) {
    const key = `${site}__${date}`
    const current = state.siteAllocations[key]
    dispatch({
      type: 'SET_SITE_ALLOCATION',
      site, date,
      allocation: current === val ? null : val,
    })
  }

  if (bySite.length === 0) return null

  return (
    <section className="px-7 py-6" style={{ borderTop: '2px solid var(--border)' }}>
      {/* Panel header */}
      <div className="flex items-center gap-4 mb-5">
        <h2 className="font-[Syne,sans-serif] font-bold text-[15px] tracking-tight">
          SITE COVERAGE
        </h2>
        <div
          className="px-3 py-1 rounded-full text-[11px] font-medium"
          style={{
            background: allConfirmed ? 'rgba(0,194,168,0.12)' : 'rgba(224,90,138,0.12)',
            border: `1px solid ${allConfirmed ? 'rgba(0,194,168,0.4)' : 'rgba(224,90,138,0.4)'}`,
            color: allConfirmed ? FT_COLOR : '#e05a8a',
          }}
        >
          {confirmedSlots} / {totalSlots} confirmed
        </div>
        <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
          Next 14 days · confirm FT or CO cover for each site
        </span>
      </div>

      {/* Site cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {bySite.map(({ site, dates }) => {
          const siteConfirmed = dates.every(({ date }) => state.siteAllocations[`${site}__${date}`])
          return (
            <div
              key={site}
              className="rounded-lg overflow-hidden"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${siteConfirmed ? 'rgba(0,194,168,0.35)' : 'var(--border)'}`,
              }}
            >
              {/* Site header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="font-[Syne,sans-serif] font-bold text-[13px]">{site}</div>
                {siteConfirmed ? (
                  <span className="text-[10px] font-medium" style={{ color: FT_COLOR }}>✓ covered</span>
                ) : (
                  <span className="text-[10px]" style={{ color: '#e05a8a' }}>⚠ needs cover</span>
                )}
              </div>

              {/* Date rows */}
              <div className="divide-y" style={{ ['--tw-divide-opacity' as string]: 1 }}>
                {dates.map(({ date, count }) => {
                  const key = `${site}__${date}`
                  const alloc = state.siteAllocations[key] ?? null
                  const isToday = date === todayStr

                  return (
                    <div
                      key={date}
                      className="px-4 py-2.5 flex items-center justify-between gap-3"
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      {/* Date + booking count */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="text-[11px] font-medium whitespace-nowrap"
                          style={{ color: isToday ? 'var(--accent)' : 'var(--text)' }}
                        >
                          {fmtDay(date)}
                        </div>
                        <div
                          className="px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap"
                          style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                        >
                          {count} booking{count !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* FT / CO buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {alloc && (
                          <span
                            className="text-[10px] font-semibold mr-1"
                            style={{ color: ALLOC_COLORS[alloc] }}
                          >
                            ✓ {alloc}
                          </span>
                        )}
                        {(['FT', 'CO'] as const).map((val) => {
                          const isActive = alloc === val
                          return (
                            <button
                              key={val}
                              onClick={() => toggle(site, date, val)}
                              className="text-[11px] font-semibold cursor-pointer transition-all"
                              style={{
                                padding: '3px 10px',
                                borderRadius: 4,
                                border: `1px solid ${isActive ? ALLOC_COLORS[val] : 'var(--border)'}`,
                                background: isActive ? `${ALLOC_COLORS[val]}22` : 'var(--surface2)',
                                color: isActive ? ALLOC_COLORS[val] : 'var(--muted)',
                                fontFamily: "'DM Mono', monospace",
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
                        {alloc && (
                          <button
                            onClick={() => dispatch({ type: 'SET_SITE_ALLOCATION', site, date, allocation: null })}
                            className="text-[10px] cursor-pointer transition-colors"
                            style={{
                              background: 'none', border: 'none',
                              color: 'var(--muted)', padding: '3px 4px',
                              fontFamily: "'DM Mono', monospace",
                            }}
                            title="Clear"
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#e05a8a')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

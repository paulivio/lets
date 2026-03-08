import { useDashboard } from '../../context/DashboardContext'
import { SITES, ROOMS } from '../../constants'
import type { View } from '../../types'

const TABS: { view: View; label: string }[] = [
  { view: 'calendar', label: '📅 Calendar' },
  { view: 'grid',     label: '⊞ Site Grid' },
  { view: 'table',    label: '≡ Table' },
  { view: 'rooms',    label: '◉ Room Map' },
]

const selectStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  padding: '6px 12px',
  borderRadius: 5,
  fontFamily: "'DM Mono', monospace",
  fontSize: 12,
  outline: 'none',
  cursor: 'pointer',
}

export function Controls() {
  const { state, dispatch } = useDashboard()

  return (
    <div className="px-7 py-[14px] flex items-center gap-3 flex-wrap" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex overflow-hidden rounded-md" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {TABS.map(({ view, label }, i) => (
          <button
            key={view}
            className="px-4 py-1.5 text-xs cursor-pointer whitespace-nowrap"
            style={{
              background: state.view === view ? 'var(--accent)' : 'transparent',
              color: state.view === view ? '#000' : 'var(--muted)',
              fontWeight: state.view === view ? 500 : undefined,
              border: 'none',
              borderRight: i < TABS.length - 1 ? '1px solid var(--border)' : undefined,
              fontFamily: "'DM Mono', monospace",
            }}
            onClick={() => dispatch({ type: 'SET_VIEW', view })}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center ml-auto">
        <span className="text-[11px]" style={{ color: 'var(--muted)' }}>SITE:</span>
        <select style={selectStyle} value={state.filterSite} onChange={(e) => dispatch({ type: 'SET_FILTER_SITE', site: e.target.value })}>
          <option value="">All Sites</option>
          {SITES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="text-[11px]" style={{ color: 'var(--muted)' }}>ROOM:</span>
        <select style={selectStyle} value={state.filterRoom} onChange={(e) => dispatch({ type: 'SET_FILTER_ROOM', room: e.target.value })}>
          <option value="">All Rooms</option>
          {ROOMS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
    </div>
  )
}

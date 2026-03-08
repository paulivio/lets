import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DashboardProvider, useDashboard } from './context/DashboardContext'
import { Header } from './components/layout/Header'
import { Controls } from './components/layout/Controls'
import { CalendarView } from './components/views/CalendarView'
import { GridView } from './components/views/GridView'
import { TableView } from './components/views/TableView'
import { RoomMapView } from './components/views/RoomMapView'
import { Tooltip } from './components/ui/Tooltip'
import type { Booking } from './types'

function Dashboard() {
  const { state } = useDashboard()
  const [tooltip, setTooltip] = useState<{ booking: Booking; x: number; y: number } | null>(null)

  const handleHover = useCallback((booking: Booking | null, e?: React.MouseEvent) => {
    if (!booking || !e) {
      setTooltip(null)
    } else {
      setTooltip({ booking, x: e.clientX, y: e.clientY })
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header />
      <Controls />
      <main className="px-7 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.view}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {state.view === 'calendar' && <CalendarView onHover={handleHover} />}
            {state.view === 'grid' && <GridView onHover={handleHover} />}
            {state.view === 'table' && <TableView onHover={handleHover} />}
            {state.view === 'rooms' && <RoomMapView onHover={handleHover} />}
          </motion.div>
        </AnimatePresence>
      </main>
      {tooltip && (
        <Tooltip booking={tooltip.booking} x={tooltip.x} y={tooltip.y} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}

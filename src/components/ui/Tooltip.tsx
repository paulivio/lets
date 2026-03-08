import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Booking } from '../../types'
import { ALLOC_COLORS } from './AllocationToggle'

interface TooltipProps {
  booking: Booking | null
  x: number
  y: number
}

export function Tooltip({ booking, x, y }: TooltipProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !booking) return
    const el = ref.current
    const vw = window.innerWidth
    const vh = window.innerHeight
    const rect = el.getBoundingClientRect()
    let left = x + 14
    let top = y + 14
    if (left + rect.width > vw - 8) left = x - rect.width - 14
    if (top + rect.height > vh - 8) top = y - rect.height - 14
    el.style.left = left + 'px'
    el.style.top = top + 'px'
  }, [booking, x, y])

  if (!booking) return null

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[999] pointer-events-none max-w-[220px] leading-relaxed text-[11px]"
      style={{
        background: 'var(--surface2)',
        border: '1px solid var(--accent)',
        borderRadius: 6,
        padding: '8px 12px',
        left: x + 14,
        top: y + 14,
      }}
    >
      <strong className="text-[var(--accent)] font-[Syne,sans-serif]">{booking.site}</strong>
      <br />
      {booking.room} · {booking.date}
      <br />
      {booking.startTime} → {booking.endTime}
      <br />
      Client: {booking.client}
      <br />
      Ref: {booking.booking}
      <br />
      Status: {booking.status}
      <br />
      Coverage:{' '}
      {booking.allocation ? (
        <strong style={{ color: ALLOC_COLORS[booking.allocation] }}>{booking.allocation}</strong>
      ) : (
        <span style={{ color: 'var(--muted)' }}>Unallocated</span>
      )}
    </div>,
    document.body,
  )
}

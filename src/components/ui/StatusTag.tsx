import type { Booking } from '../../types'

const styles: Record<Booking['status'], string> = {
  Confirmed: 'bg-[rgba(0,194,168,0.15)] text-[#00c2a8] border border-[rgba(0,194,168,0.3)]',
  Pending:   'bg-[rgba(240,165,0,0.15)] text-[#f0a500] border border-[rgba(240,165,0,0.3)]',
  Cancelled: 'bg-[rgba(224,90,138,0.15)] text-[#e05a8a] border border-[rgba(224,90,138,0.3)]',
}

export function StatusTag({ status }: { status: Booking['status'] }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] ${styles[status]}`}>
      {status}
    </span>
  )
}

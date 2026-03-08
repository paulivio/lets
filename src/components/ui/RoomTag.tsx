import { ROOM_COLORS } from '../../constants'

export function RoomTag({ room }: { room: string }) {
  const color = ROOM_COLORS[room as keyof typeof ROOM_COLORS] ?? '#888'
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-black"
      style={{ background: color }}
    >
      {room}
    </span>
  )
}

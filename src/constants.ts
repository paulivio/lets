export const ROOMS = ['Room A', 'Room B', 'Room C', 'Room D', 'Room E', 'Room F'] as const
export type RoomName = (typeof ROOMS)[number]

export const ROOM_COLORS: Record<RoomName, string> = {
  'Room A': '#f0a500',
  'Room B': '#00c2a8',
  'Room C': '#e05a8a',
  'Room D': '#5a9ef0',
  'Room E': '#a78bfa',
  'Room F': '#34d399',
}

export const SITES = [
  'Holyrood Centre',
  'Leith Hub',
  'Morningside Suite',
  'Newington Hall',
  'Stockbridge Rooms',
]

export const CLIENTS = [
  'Acme Corp', 'GreenPath Ltd', 'City Council', 'TechStart',
  'Blue Ring Events', 'NovaCare', 'Summit Group', 'Local Authority',
  'Bright Futures', 'Alpha Services',
]

export const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8..20

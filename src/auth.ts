// Client-side only — not cryptographically secure, just a basic access gate.
const USERS: Record<string, string> = {
  kieran: 'password',
  paul: 'password',
}

const SESSION_KEY = 'sc_user'

export function tryLogin(username: string, password: string): string | null {
  const match = USERS[username.trim().toLowerCase()]
  if (match && match === password) {
    const name = username.trim().charAt(0).toUpperCase() + username.trim().slice(1).toLowerCase()
    sessionStorage.setItem(SESSION_KEY, name)
    return name
  }
  return null
}

export function getSessionUser(): string | null {
  return sessionStorage.getItem(SESSION_KEY)
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}

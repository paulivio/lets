import { useState } from 'react'
import { motion } from 'framer-motion'
import { tryLogin } from '../../auth'

interface Props {
  onLogin: (name: string) => void
}

export function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    // small delay so the button press registers visually
    setTimeout(() => {
      const name = tryLogin(username, password)
      if (name) {
        onLogin(name)
      } else {
        setError('Invalid username or password.')
        setLoading(false)
      }
    }, 300)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: 6,
    padding: '10px 14px',
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: 360 }}
        className="px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="font-[Syne,sans-serif] font-black text-[28px] tracking-tight mb-1"
            style={{ color: 'var(--accent)' }}
          >
            SITE<span style={{ color: 'var(--text)' }}>COVER</span>
          </div>
          <div className="text-[11px] tracking-widest" style={{ color: 'var(--muted)' }}>
            COVERAGE PLANNER
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-7"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h1
            className="font-[Syne,sans-serif] font-bold text-[15px] mb-5"
            style={{ color: 'var(--text)' }}
          >
            Sign in
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest" style={{ color: 'var(--muted)' }}>
                USERNAME
              </label>
              <input
                type="text"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-widest" style={{ color: 'var(--muted)' }}>
                PASSWORD
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>

            {error && (
              <div
                className="text-[11px] px-3 py-2 rounded"
                style={{
                  background: 'rgba(224,90,138,0.1)',
                  border: '1px solid rgba(224,90,138,0.3)',
                  color: '#e05a8a',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="mt-1 py-2.5 rounded-md text-[13px] font-medium cursor-pointer transition-opacity"
              style={{
                background: 'var(--accent)',
                color: '#000',
                border: 'none',
                fontFamily: "'DM Mono', monospace",
                opacity: loading || !username || !password ? 0.5 : 1,
                cursor: loading || !username || !password ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

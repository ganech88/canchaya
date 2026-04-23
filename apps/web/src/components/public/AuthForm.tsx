'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'

type Mode = 'signin' | 'signup'

export function AuthForm({ initialMode = 'signin' }: { initialMode?: Mode }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (err) throw err
        router.push('/' as never)
        router.refresh()
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        router.push('/' as never)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px] border-card border-cy-line bg-cy-paper">
      <div className="border-b-card border-cy-line bg-cy-ink px-5 py-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
          § {mode === 'signin' ? 'ACCESO' : 'REGISTRO'}
        </p>
        <p className="mt-1 font-display text-[28px] leading-[24px] tracking-tight text-cy-paper">
          {mode === 'signin' ? 'ENTRAR.' : 'CREAR CUENTA.'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-5">
        {mode === 'signup' && (
          <label className="block pb-4">
            <span className="block pb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
              Nombre
            </span>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full border-chip border-cy-line bg-cy-bg px-3 py-2 font-ui text-[14px] text-cy-ink focus:outline-none focus:border-cy-red"
            />
          </label>
        )}

        <label className="block pb-4">
          <span className="block pb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
            Email
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full border-chip border-cy-line bg-cy-bg px-3 py-2 font-mono text-[13px] text-cy-ink focus:outline-none focus:border-cy-red"
          />
        </label>

        <label className="block pb-4">
          <span className="block pb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
            Contraseña
          </span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={8}
            className="w-full border-chip border-cy-line bg-cy-bg px-3 py-2 font-mono text-[13px] text-cy-ink focus:outline-none focus:border-cy-red"
          />
        </label>

        {error && (
          <div className="mb-4 border-chip border-cy-red bg-cy-red/10 px-3 py-2 font-mono text-[11px] text-cy-red">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full border-card border-cy-line bg-cy-accent py-3 font-ui text-[13px] font-bold uppercase tracking-wide text-cy-ink disabled:opacity-50"
        >
          {loading ? '...' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}
        </button>

        <div className="mt-4 border-t border-cy-line pt-4 text-center">
          {mode === 'signin' ? (
            <p className="font-mono text-[11px] text-cy-muted">
              ¿Aún no tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold uppercase tracking-wider text-cy-ink hover:text-cy-red"
              >
                Crear una
              </button>
            </p>
          ) : (
            <p className="font-mono text-[11px] text-cy-muted">
              ¿Ya tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-bold uppercase tracking-wider text-cy-ink hover:text-cy-red"
              >
                Entrar
              </button>
            </p>
          )}
          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-cy-muted">
            <Link href="/" className="hover:text-cy-ink">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

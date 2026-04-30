'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FetchError } from '@nhost/nhost-js/fetch'
import { getBrowserClient, isNhostConfigured } from '@/lib/nhost/client'

type Mode = 'signin' | 'signup'

interface AuthErrorBody {
  error?: string
  message?: string
}

function getErrorMessage(err: unknown): string {
  if (err instanceof FetchError) {
    const body = err.body as AuthErrorBody | undefined
    return body?.message ?? body?.error ?? err.message
  }
  if (err instanceof Error) return err.message
  return 'Error desconocido'
}

export function AuthForm({ initialMode = 'signin' }: { initialMode?: Mode }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const nhostReady = isNhostConfigured()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const nhost = getBrowserClient()
      if (mode === 'signup') {
        await nhost.auth.signUpEmailPassword({
          email,
          password,
          options: {
            displayName: name,
            metadata: { name },
          },
        })
        router.push('/')
        router.refresh()
      } else {
        await nhost.auth.signInEmailPassword({ email, password })
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError(getErrorMessage(err))
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

      {!nhostReady && (
        <div className="border-b-chip border-cy-red bg-cy-red/10 px-5 py-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            ⚠ Demo — Nhost no configurado
          </p>
          <p className="mt-1 font-mono text-[11px] text-cy-ink">
            El formulario es navegable pero no se puede crear cuenta hasta linkear el proyecto.
          </p>
        </div>
      )}

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
          disabled={loading || !nhostReady}
          className="w-full border-card border-cy-line bg-cy-accent py-3 font-ui text-[13px] font-bold uppercase tracking-wide text-cy-ink disabled:opacity-50"
        >
          {loading ? '...' : !nhostReady ? 'Demo — no disponible' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}
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

'use client'

// Banner sticky que solo se renderiza cuando el visitante entra desde un device Android.
// Detecta el user agent en cliente (post-hydrate, evita mismatch) y muestra una barra editorial
// en bg-cy-ink con CTA a la URL del APK. Dismissible via localStorage.

import Link from 'next/link'
import { useEffect, useState } from 'react'

const DISMISS_KEY = 'canchaya:app-banner-dismissed'
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 días — después vuelve a aparecer

function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  // Excluir Windows (algunos browsers ponen Android en UA spoofing desktop)
  return /android/i.test(ua) && !/windows phone|win64|win32/i.test(ua)
}

function wasDismissedRecently(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const ts = Number.parseInt(raw, 10)
    return !Number.isNaN(ts) && Date.now() - ts < DISMISS_TTL_MS
  } catch {
    return false
  }
}

export function AppDownloadBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isAndroidDevice() && !wasDismissedRecently()) {
      setVisible(true)
    }
  }, [])

  const onDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // noop (localStorage bloqueado)
    }
    setVisible(false)
  }

  if (!visible) return null

  // Si la env var apunta a un APK real, la usamos; si no, caemos a /app con instrucciones.
  const apkUrl = process.env.NEXT_PUBLIC_ANDROID_APK_URL
  const href = apkUrl && apkUrl.length > 0 ? apkUrl : '/app'

  return (
    <div className="sticky top-0 z-50 flex items-center gap-3 border-b-card border-cy-accent bg-cy-ink px-4 py-2.5">
      <div className="flex-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
          § APP ANDROID DISPONIBLE
        </p>
        <p className="font-mono text-[11px] text-cy-paper">Reservás más rápido y recibís push</p>
      </div>

      <Link
        href={href as never}
        className="border-chip border-cy-accent bg-cy-accent px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-cy-ink transition-opacity hover:opacity-90"
      >
        Instalar
      </Link>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar banner"
        className="flex h-7 w-7 items-center justify-center border-chip border-cy-accent/40 font-mono text-[14px] text-cy-accent hover:bg-cy-accent/10"
      >
        ✕
      </button>
    </div>
  )
}

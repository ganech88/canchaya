'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@canchaya/ui'

const NAV = [
  { label: 'Canchas', href: '/results' as const },
  { label: 'Partidos', href: '/matches' as const },
  { label: 'Ayuda', href: '/help' as const },
] as const

export function PublicHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b-card border-cy-line bg-cy-paper">
      {/* Masthead top strip */}
      <div className="flex items-center justify-between border-b border-cy-line px-7 py-2 font-mono text-[10px] uppercase tracking-widest">
        <span>CanchaYa · Marketplace deportivo</span>
        <span>LATAM · ES-AR · ABR 2026</span>
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between px-7 py-4">
        <Link href="/" className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
          CANCHAYA.
        </Link>

        <nav className="flex items-center gap-6">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href) ?? false
            return (
              <Link
                key={item.href}
                href={item.href as never}
                className={cn(
                  'font-mono text-[11px] font-bold uppercase tracking-wider',
                  active ? 'text-cy-red' : 'text-cy-ink hover:text-cy-red',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={'/login' as never}
            className="font-mono text-[11px] font-bold uppercase tracking-wider text-cy-ink hover:text-cy-red"
          >
            Entrar
          </Link>
          <Link
            href={'/signup' as never}
            className="border-card border-cy-line bg-cy-ink px-3 py-2 font-ui text-[12px] font-bold uppercase tracking-wide text-cy-accent hover:opacity-90"
          >
            Crear cuenta
          </Link>
          <Link
            href={'/owner/dashboard' as never}
            className="border-card border-cy-line bg-cy-accent px-3 py-2 font-ui text-[12px] font-bold uppercase tracking-wide text-cy-ink hover:opacity-90"
          >
            Soy dueño
          </Link>
        </div>
      </div>
    </header>
  )
}

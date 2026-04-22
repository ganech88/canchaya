'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@canchaya/ui'

interface NavEntry {
  num: string
  label: string
  href: string
  match: string // segmento para marcar activo
}

const NAV: NavEntry[] = [
  { num: '01', label: 'Dashboard', href: '/dashboard', match: '/dashboard' },
  { num: '02', label: 'Calendario', href: '/calendar', match: '/calendar' },
  { num: '03', label: 'Canchas', href: '/courts', match: '/courts' },
  { num: '04', label: 'Reservas', href: '/bookings/248', match: '/bookings' },
  { num: '05', label: 'Consumo', href: '/drinks', match: '/drinks' },
  { num: '06', label: 'Ingresos', href: '/revenue', match: '/revenue' },
  { num: '07', label: 'Config', href: '/settings', match: '/settings' },
]

export function OwnerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-[200px] flex-col bg-cy-ink text-cy-paper">
      {/* Header */}
      <div className="border-b-chip border-white/15 px-4 pb-4 pt-5">
        <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-accent">
          CanchaYa · Ops
        </p>
        <p className="mt-1 font-display text-[22px] leading-[20px] tracking-tight text-cy-paper">
          LA BOMBO-
          <br />
          NERITA
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
          Palermo · 4 canchas
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2.5">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.match) ?? false
          return (
            <Link
              key={item.num}
              // typedRoutes de Next 15 exige el tipo `Route`; NAV usa string porque los paths los armamos en runtime.
              href={item.href as never}
              className={cn(
                'flex items-center gap-2.5 border-l-[4px] px-4 py-2.5 transition-colors',
                active
                  ? 'border-cy-ink bg-cy-accent text-cy-ink'
                  : 'border-transparent text-cy-paper hover:bg-white/5',
              )}
            >
              <span className="font-mono text-[10px] opacity-60">{item.num}</span>
              <span className="font-condensed text-[16px] uppercase">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="flex items-center gap-2.5 border-t-chip border-white/15 p-4">
        <div className="flex h-8 w-8 items-center justify-center border-chip border-cy-paper bg-cy-accent font-display text-[14px] text-cy-ink">
          DP
        </div>
        <div>
          <p className="text-[12px] font-bold text-cy-paper">Diego P.</p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/50">Admin</p>
        </div>
      </div>
    </aside>
  )
}

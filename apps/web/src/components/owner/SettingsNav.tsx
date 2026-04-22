'use client'

import { cn } from '@canchaya/ui'

export const SETTINGS_SECTIONS = [
  'Negocio',
  'Horarios',
  'Política de reserva',
  'Medios de pago',
  'Integraciones',
  'Equipo',
  'Facturación',
] as const

export type SettingsSection = (typeof SETTINGS_SECTIONS)[number]

interface Props {
  active: SettingsSection
  onChange: (s: SettingsSection) => void
}

export function SettingsNav({ active, onChange }: Props) {
  return (
    <nav>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
        § SECCIONES
      </p>
      {SETTINGS_SECTIONS.map((s) => {
        const on = s === active
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={cn(
              'block w-full border-chip border-cy-line px-3 py-2.5 text-left',
              '-mb-[1.5px]',
              on ? 'bg-cy-ink text-cy-accent' : 'bg-transparent text-cy-ink hover:bg-cy-paper/60',
            )}
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">{s}</span>
          </button>
        )
      })}
    </nav>
  )
}

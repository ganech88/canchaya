'use client'

import { useState } from 'react'
import { Button, Chip } from '@canchaya/ui/web'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import {
  SettingsNav,
  SETTINGS_SECTIONS,
  type SettingsSection,
} from '@/components/owner/SettingsNav'
import { SettingsField } from '@/components/owner/SettingsField'
import { AmenityToggleRow } from '@/components/owner/AmenityToggleRow'

const SPORTS = ['FÚTBOL 5', 'FÚTBOL 7/8', 'FÚTBOL 11', 'PÁDEL', 'TENIS', 'BÁSQUET'] as const

const INITIAL_AMENITIES: Array<{ label: string; on: boolean }> = [
  { label: 'Vestuarios', on: true },
  { label: 'Duchas', on: true },
  { label: 'Bar / Kiosco', on: true },
  { label: 'Estacionamiento', on: true },
  { label: 'Parrilla', on: false },
  { label: 'WiFi', on: true },
]

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>(SETTINGS_SECTIONS[0])
  const [amenities, setAmenities] = useState(INITIAL_AMENITIES)
  const [activeSports, setActiveSports] = useState<Set<string>>(
    new Set(['FÚTBOL 5', 'FÚTBOL 7/8', 'PÁDEL']),
  )

  const toggleAmenity = (i: number) =>
    setAmenities((curr) =>
      curr.map((a, idx) => (idx === i ? { ...a, on: !a.on } : a)),
    )

  const toggleSport = (s: string) =>
    setActiveSports((curr) => {
      const next = new Set(curr)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })

  return (
    <>
      <OwnerHeader
        eyebrow="AJUSTES · NEGOCIO"
        title="CONFIG."
        right={
          <Button variant="accent" className="!px-3.5 !py-2.5 !text-[12px]">
            Guardar cambios
          </Button>
        }
      />

      <div className="grid gap-7 p-7" style={{ gridTemplateColumns: '220px 1fr' }}>
        <SettingsNav active={section} onChange={setSection} />

        <div>
          <div className="border-card border-cy-line bg-cy-paper">
            {/* Header */}
            <div className="border-b-card border-cy-line bg-cy-ink px-4 py-3.5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
                § INFORMACIÓN DEL NEGOCIO
              </p>
              <p className="mt-0.5 font-display text-[22px] leading-[20px] tracking-tight text-cy-paper">
                LA BOMBONERITA
              </p>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-5 p-5">
              <SettingsField label="Nombre comercial" value="La Bombonerita" />
              <SettingsField label="CUIT / RUT" value="30-71234567-8" mono />
              <SettingsField label="Teléfono" value="+54 11 5534 2211" mono />
              <SettingsField label="Email" value="reservas@bombonerita.com" mono />
              <SettingsField label="Dirección" value="Av. Sarmiento 4320, Palermo" span={2} />
              <SettingsField
                label="Descripción"
                value="Complejo deportivo con 4 canchas F5, 1 cancha F8, y 2 canchas de pádel techadas. Bar completo y vestuarios."
                span={2}
                textarea
              />
            </div>

            {/* Deportes */}
            <div className="border-t-chip border-cy-line p-5">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">
                Deportes ofrecidos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SPORTS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSport(s)}>
                    <Chip variant={activeSports.has(s) ? 'accent' : 'outline'}>{s}</Chip>
                  </button>
                ))}
              </div>
            </div>

            {/* Comodidades */}
            <div className="border-t-chip border-cy-line p-5">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">
                Comodidades
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {amenities.map((a, i) => (
                  <AmenityToggleRow
                    key={a.label}
                    label={a.label}
                    on={a.on}
                    onToggle={() => toggleAmenity(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-5 flex items-center justify-between border-card border-cy-line bg-cy-accent p-[18px]">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase text-cy-ink">
                § ZONA DE PELIGRO
              </p>
              <p className="mt-0.5 font-condensed text-[20px] uppercase leading-tight text-cy-ink">
                Pausar el negocio en la app
              </p>
              <p className="mt-1 text-[12px] text-cy-ink">
                Las reservas nuevas no podrán crearse. Las reservas existentes se mantienen.
              </p>
            </div>
            <Button variant="ink" className="!px-3.5 !py-2.5 !text-[11px]">
              Pausar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

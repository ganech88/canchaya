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

const ALL_SPORTS = ['FÚTBOL 5', 'FÚTBOL 7/8', 'FÚTBOL 11', 'PÁDEL', 'TENIS', 'BÁSQUET'] as const
const ALL_AMENITIES = [
  { code: 'changing_rooms', label: 'Vestuarios' },
  { code: 'showers', label: 'Duchas' },
  { code: 'bar', label: 'Bar / Kiosco' },
  { code: 'parking', label: 'Estacionamiento' },
  { code: 'parrilla', label: 'Parrilla' },
  { code: 'wifi', label: 'WiFi' },
  { code: 'lighting', label: 'Iluminación' },
  { code: 'coaching', label: 'Profesores' },
] as const

export interface SettingsInitial {
  venueName: string
  city: string
  address: string
  phone: string
  email: string
  description: string
  sports: string[]
  amenityCodes: string[]
}

interface Props {
  initial: SettingsInitial
}

export function SettingsForm({ initial }: Props) {
  const [section, setSection] = useState<SettingsSection>(SETTINGS_SECTIONS[0])
  const [amenities, setAmenities] = useState(
    ALL_AMENITIES.map((a) => ({ ...a, on: initial.amenityCodes.includes(a.code) })),
  )
  const [activeSports, setActiveSports] = useState<Set<string>>(new Set(initial.sports))

  const toggleAmenity = (i: number) =>
    setAmenities((curr) => curr.map((a, idx) => (idx === i ? { ...a, on: !a.on } : a)))

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
            <div className="border-b-card border-cy-line bg-cy-ink px-4 py-3.5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
                § INFORMACIÓN DEL NEGOCIO
              </p>
              <p className="mt-0.5 font-display text-[22px] leading-[20px] tracking-tight text-cy-paper">
                {initial.venueName.toUpperCase()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 p-5">
              <SettingsField label="Nombre comercial" value={initial.venueName} />
              <SettingsField label="Ciudad" value={initial.city} />
              <SettingsField label="Teléfono" value={initial.phone || '—'} mono />
              <SettingsField label="Email" value={initial.email} mono />
              <SettingsField label="Dirección" value={initial.address} span={2} />
              <SettingsField
                label="Descripción"
                value={initial.description || 'Sin descripción cargada'}
                span={2}
                textarea
              />
            </div>

            <div className="border-t-chip border-cy-line p-5">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">
                Deportes ofrecidos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SPORTS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSport(s)}>
                    <Chip variant={activeSports.has(s) ? 'accent' : 'outline'}>{s}</Chip>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t-chip border-cy-line p-5">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">
                Comodidades
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {amenities.map((a, i) => (
                  <AmenityToggleRow
                    key={a.code}
                    label={a.label}
                    on={a.on}
                    onToggle={() => toggleAmenity(i)}
                  />
                ))}
              </div>
            </div>
          </div>

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

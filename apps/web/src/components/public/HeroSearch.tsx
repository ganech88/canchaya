'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@canchaya/ui/icons'
import { SPORTS_CATALOG, CITIES } from '@/data/mock'

export function HeroSearch() {
  const router = useRouter()
  const [sport, setSport] = useState('padel')
  const [city, setCity] = useState('palermo')
  const today = new Date().toISOString().slice(0, 10)
  const [day, setDay] = useState(today)
  const [hour, setHour] = useState('20:00')

  const onSubmit = () => {
    const params = new URLSearchParams({ sport, city, day, hour })
    router.push(`/results?${params.toString()}` as never)
  }

  return (
    <div className="border-card border-cy-line bg-cy-paper">
      <div className="flex items-center justify-between border-b border-cy-line px-5 py-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
          § BUSCÁ TU CANCHA
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-cy-muted">
          5 DEPORTES · LATAM
        </span>
      </div>

      <div className="grid grid-cols-5 gap-0">
        {/* Deporte */}
        <label className="border-r border-cy-line p-4">
          <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
            Deporte
          </span>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="mt-1 w-full bg-transparent font-display text-[22px] leading-[20px] tracking-tight text-cy-ink focus:outline-none"
          >
            {SPORTS_CATALOG.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        {/* Ciudad */}
        <label className="border-r border-cy-line p-4">
          <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
            Ciudad
          </span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full bg-transparent font-display text-[22px] leading-[20px] tracking-tight text-cy-ink focus:outline-none"
          >
            {CITIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {/* Día */}
        <label className="border-r border-cy-line p-4">
          <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
            Día
          </span>
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="mt-1 w-full bg-transparent font-display text-[18px] leading-[16px] tracking-tight text-cy-ink focus:outline-none"
          />
        </label>

        {/* Hora */}
        <label className="border-r border-cy-line p-4">
          <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
            Hora
          </span>
          <input
            type="time"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="mt-1 w-full bg-transparent font-display text-[22px] leading-[20px] tracking-tight text-cy-ink focus:outline-none"
          />
        </label>

        {/* CTA */}
        <button
          type="button"
          onClick={onSubmit}
          className="flex items-center justify-center gap-2 bg-cy-accent px-5 py-4 font-ui text-[14px] font-bold uppercase tracking-wide text-cy-ink transition-transform active:scale-[0.98]"
        >
          <Icon name="search" size={16} />
          Buscar
        </button>
      </div>
    </div>
  )
}

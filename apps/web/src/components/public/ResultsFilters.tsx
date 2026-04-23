'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Chip } from '@canchaya/ui/web'
import { SPORTS_CATALOG, CITIES } from '@/data/mock'

export function ResultsFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [sport, setSport] = useState(params?.get('sport') ?? '')
  const [city, setCity] = useState(params?.get('city') ?? '')
  const [hour, setHour] = useState(params?.get('hour') ?? '')
  const [extras, setExtras] = useState<string[]>(params?.getAll('amenity') ?? [])

  useEffect(() => {
    setSport(params?.get('sport') ?? '')
    setCity(params?.get('city') ?? '')
    setHour(params?.get('hour') ?? '')
    setExtras(params?.getAll('amenity') ?? [])
  }, [params])

  const push = (next: URLSearchParams) => {
    router.push(`/results?${next.toString()}` as never)
  }

  const toggleSport = (code: string) => {
    const next = new URLSearchParams(params?.toString() ?? '')
    if (sport === code) next.delete('sport')
    else next.set('sport', code)
    push(next)
  }

  const toggleExtra = (code: string) => {
    const next = new URLSearchParams(params?.toString() ?? '')
    const all = next.getAll('amenity')
    next.delete('amenity')
    if (all.includes(code)) {
      all.filter((x) => x !== code).forEach((x) => next.append('amenity', x))
    } else {
      all.forEach((x) => next.append('amenity', x))
      next.append('amenity', code)
    }
    push(next)
  }

  const changeCity = (code: string) => {
    const next = new URLSearchParams(params?.toString() ?? '')
    if (code) next.set('city', code)
    else next.delete('city')
    push(next)
  }

  const changeHour = (value: string) => {
    const next = new URLSearchParams(params?.toString() ?? '')
    if (value) next.set('hour', value)
    else next.delete('hour')
    push(next)
  }

  return (
    <aside className="flex flex-col gap-5 border-r-card border-cy-line bg-cy-paper p-6">
      <div>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
          § FILTROS
        </p>
        <div className="h-1 bg-cy-line" />
      </div>

      {/* Sport */}
      <section>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">Deporte</p>
        <div className="flex flex-wrap gap-1.5">
          {SPORTS_CATALOG.map((s) => (
            <button key={s.code} type="button" onClick={() => toggleSport(s.code)}>
              <Chip variant={sport === s.code ? 'accent' : 'outline'}>{s.label}</Chip>
            </button>
          ))}
        </div>
      </section>

      {/* City */}
      <section>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">Ciudad</p>
        <select
          value={city}
          onChange={(e) => changeCity(e.target.value)}
          className="w-full border-chip border-cy-line bg-cy-bg px-2.5 py-2 font-ui text-[13px] text-cy-ink focus:outline-none"
        >
          <option value="">Todas</option>
          {CITIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </section>

      {/* Hour */}
      <section>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">Hora</p>
        <input
          type="time"
          value={hour}
          onChange={(e) => changeHour(e.target.value)}
          className="w-full border-chip border-cy-line bg-cy-bg px-2.5 py-2 font-ui text-[13px] text-cy-ink focus:outline-none"
        />
      </section>

      {/* Amenities */}
      <section>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">Extras</p>
        <div className="flex flex-wrap gap-1.5">
          {['parking', 'bar', 'showers', 'changing_rooms', 'parrilla', 'coaching'].map((e) => (
            <button key={e} type="button" onClick={() => toggleExtra(e)}>
              <Chip variant={extras.includes(e) ? 'fill' : 'outline'}>{e.replace('_', ' ')}</Chip>
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

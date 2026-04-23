'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Chip } from '@canchaya/ui/web'
import { SPORTS_CATALOG } from '@/data/mock'

const LEVELS = [
  { code: 'principiante', label: 'Principiante' },
  { code: 'intermedio', label: 'Intermedio' },
  { code: 'avanzado', label: 'Avanzado' },
] as const

const GENDERS = [
  { code: 'any', label: 'Mixto' },
  { code: 'm', label: 'Masculino' },
  { code: 'f', label: 'Femenino' },
] as const

export function MatchesFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const sport = params?.get('sport') ?? ''
  const level = params?.get('level') ?? ''
  const gender = params?.get('gender') ?? ''
  const radius = params?.get('radius') ?? '5'

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params?.toString() ?? '')
    if (value) next.set(key, value)
    else next.delete(key)
    router.push(`/matches?${next.toString()}` as never)
  }

  return (
    <aside className="flex flex-col gap-5 border-r-card border-cy-line bg-cy-paper p-6">
      <div>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
          § FILTROS · COMUNIDAD
        </p>
        <div className="h-1 bg-cy-line" />
      </div>

      <section>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">Deporte</p>
        <div className="flex flex-wrap gap-1.5">
          {SPORTS_CATALOG.map((s) => (
            <button key={s.code} type="button" onClick={() => setParam('sport', sport === s.code ? '' : s.code)}>
              <Chip variant={sport === s.code ? 'accent' : 'outline'}>{s.label}</Chip>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">Nivel</p>
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <button key={l.code} type="button" onClick={() => setParam('level', level === l.code ? '' : l.code)}>
              <Chip variant={level === l.code ? 'accent' : 'outline'}>{l.label}</Chip>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">Género</p>
        <div className="flex flex-wrap gap-1.5">
          {GENDERS.map((g) => (
            <button key={g.code} type="button" onClick={() => setParam('gender', gender === g.code ? '' : g.code)}>
              <Chip variant={gender === g.code ? 'fill' : 'outline'}>{g.label}</Chip>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase text-cy-ink">Radio</p>
        <select
          value={radius}
          onChange={(e) => setParam('radius', e.target.value)}
          className="w-full border-chip border-cy-line bg-cy-bg px-2.5 py-2 font-ui text-[13px] text-cy-ink focus:outline-none"
        >
          <option value="2">2 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="25">25 km</option>
        </select>
      </section>
    </aside>
  )
}

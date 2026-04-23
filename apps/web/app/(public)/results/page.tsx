// SSR — Next 15 pasa `searchParams` como Promise.
// URL canónica: /results?sport=padel&city=palermo&day=2026-04-23&hour=20:00&amenity=parking

import Link from 'next/link'
import { Icon } from '@canchaya/ui/icons'
import { ResultsFilters } from '@/components/public/ResultsFilters'
import { VenueCard } from '@/components/public/VenueCard'
import { MOCK_VENUES, SPORTS_CATALOG, CITIES } from '@/data/mock'

interface PageProps {
  searchParams: Promise<{
    sport?: string
    city?: string
    day?: string
    hour?: string
    amenity?: string | string[]
  }>
}

function filterVenues(params: {
  sport?: string
  city?: string
  amenities: string[]
}): typeof MOCK_VENUES {
  return MOCK_VENUES.filter((v) => {
    if (params.sport) {
      const parent = SPORTS_CATALOG.find((s) => s.code === params.sport)
      const childCodes = 'children' in (parent ?? {}) ? (parent as { children?: string[] }).children ?? [] : []
      const match = v.sports.includes(params.sport) || v.sports.some((s) => childCodes.includes(s))
      if (!match) return false
    }
    if (params.city) {
      const cityEntry = CITIES.find((c) => c.code === params.city)
      if (cityEntry && v.city.toLowerCase() !== cityEntry.name.toLowerCase()) return false
    }
    if (params.amenities.length > 0) {
      const hasAll = params.amenities.every((a) => v.amenities.includes(a))
      if (!hasAll) return false
    }
    return true
  })
}

export default async function ResultsPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const amenities = Array.isArray(sp.amenity) ? sp.amenity : sp.amenity ? [sp.amenity] : []
  const results = filterVenues({ sport: sp.sport, city: sp.city, amenities })

  const sportLabel = sp.sport ? SPORTS_CATALOG.find((s) => s.code === sp.sport)?.label : 'Todos los deportes'
  const cityLabel = sp.city ? CITIES.find((c) => c.code === sp.city)?.name : 'Todas las ciudades'

  // Slots mock para cada venue
  const mockSlots = [
    { start: '19:00', priceFromCents: 1800000 },
    { start: '20:00', priceFromCents: 1800000 },
    { start: '20:30', priceFromCents: 1800000 },
    { start: '21:00', priceFromCents: 2000000 },
    { start: '22:00', priceFromCents: 2000000 },
    { start: '22:30', priceFromCents: 2000000 },
  ]

  return (
    <div className="grid" style={{ gridTemplateColumns: '280px 1fr' }}>
      <ResultsFilters />

      <div className="flex flex-col">
        {/* Breadcrumbs + header */}
        <div className="border-b-card border-cy-line bg-cy-paper px-8 py-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cy-muted">
            <Link href="/" className="hover:text-cy-red">
              Inicio
            </Link>
            {' / '}
            {sportLabel}
            {sp.city ? ` / ${cityLabel}` : ''}
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <h1 className="font-display text-[40px] leading-[0.9] tracking-tight text-cy-ink">
              {sportLabel?.toUpperCase() ?? 'CANCHAS'} · {cityLabel?.toUpperCase()}
            </h1>
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-cy-ink">
              {results.length} resultado{results.length === 1 ? '' : 's'}
            </p>
          </div>
          {sp.day || sp.hour ? (
            <p className="mt-1 font-mono text-[11px] text-cy-muted">
              {sp.day ? sp.day : 'Hoy'}
              {sp.hour ? ` · ${sp.hour}` : ''}
            </p>
          ) : null}
        </div>

        {/* Grid results */}
        <div className="flex-1 p-8">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <Icon name="search" size={48} />
              <p className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
                SIN RESULTADOS.
              </p>
              <p className="max-w-[400px] text-center text-[13px] text-cy-muted">
                Probá ampliar el rango horario, sacar filtros de extras o cambiar de ciudad.
              </p>
              <Link
                href={'/results' as never}
                className="mt-3 border-card border-cy-line bg-cy-accent px-4 py-2 font-ui text-[13px] font-bold uppercase tracking-wide text-cy-ink"
              >
                Limpiar filtros
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">
              {results.map((v) => (
                <VenueCard key={v.id} venue={v} slots={mockSlots} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

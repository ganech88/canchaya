// SSR — Next 15 pasa `searchParams` como Promise.
// URL canónica: /results?sport=padel&city=palermo&day=2026-04-23&hour=20:00&amenity=parking

import Link from 'next/link'
import { Icon } from '@canchaya/ui/icons'
import { fetchVenueList } from '@canchaya/db'
import { ResultsFilters } from '@/components/public/ResultsFilters'
import { VenueCard } from '@/components/public/VenueCard'
import { SPORTS_CATALOG, CITIES } from '@/data/mock'
import { venuesToCards } from '@/lib/adapters'
import { getServerClient, isNhostConfigured } from '@/lib/nhost/server'

interface PageProps {
  searchParams: Promise<{
    sport?: string
    city?: string
    day?: string
    hour?: string
    amenity?: string | string[]
  }>
}

export default async function ResultsPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const amenities = Array.isArray(sp.amenity) ? sp.amenity : sp.amenity ? [sp.amenity] : []

  // Fetch real desde Nhost si está configurado; sino fallback a array vacío.
  let venues: ReturnType<typeof venuesToCards> = []
  if (isNhostConfigured()) {
    try {
      const nhost = getServerClient()
      const rows = await fetchVenueList(nhost, { sportCode: sp.sport, limit: 50 })
      venues = venuesToCards(rows)
    } catch {
      venues = []
    }
  }

  // Filtros que aplicamos en cliente (city + amenities) — el sport ya va en GraphQL.
  const results = venues.filter((v) => {
    if (sp.city) {
      const cityEntry = CITIES.find((c) => c.code === sp.city)
      if (cityEntry && v.city.toLowerCase() !== cityEntry.name.toLowerCase()) return false
    }
    if (amenities.length > 0) {
      const hasAll = amenities.every((a) => v.amenities.includes(a))
      if (!hasAll) return false
    }
    return true
  })

  const sportLabel = sp.sport ? SPORTS_CATALOG.find((s) => s.code === sp.sport)?.label : 'Todos los deportes'
  const cityLabel = sp.city ? CITIES.find((c) => c.code === sp.city)?.name : 'Todas las ciudades'

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
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

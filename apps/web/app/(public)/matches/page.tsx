import { MatchesFilters } from '@/components/public/MatchesFilters'
import { MatchCard } from '@/components/public/MatchCard'
import { MOCK_MATCHES } from '@/data/matches'

interface PageProps {
  searchParams: Promise<{
    sport?: string
    level?: string
    gender?: string
    radius?: string
  }>
}

export default async function MatchesPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const radiusKm = Number(sp.radius ?? '5')

  const filtered = MOCK_MATCHES.filter((m) => {
    if (sp.sport && m.sportCode !== sp.sport) {
      const parent = sp.sport === 'futbol' ? m.sportCode.startsWith('futbol_') : false
      if (!parent) return false
    }
    if (sp.level && m.level !== sp.level) return false
    if (sp.gender && m.genderFilter !== sp.gender && m.genderFilter !== 'any') return false
    if (m.distanceKm > radiusKm) return false
    return true
  })

  return (
    <div className="grid" style={{ gridTemplateColumns: '280px 1fr' }}>
      <MatchesFilters />

      <div className="flex flex-col">
        <div className="border-b-card border-cy-line bg-cy-paper px-8 py-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § COMUNIDAD · EN VIVO
          </p>
          <div className="mt-2 flex items-baseline justify-between">
            <h1 className="font-display text-[48px] leading-[0.88] tracking-tight text-cy-ink">
              PARTIDOS<br />ABIERTOS.
            </h1>
            <div className="text-right">
              <p className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
                {filtered.length}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-cy-muted">
                Dentro de {radiusKm}km
              </p>
            </div>
          </div>
          <p className="mt-2 max-w-[600px] text-[13px] text-cy-muted">
            Sumate a un partido armado cerca tuyo. Filtrá por nivel, género y rango de edad. La
            seña se divide entre todos los jugadores.
          </p>
        </div>

        <div className="flex-1 p-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <p className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
                SIN PARTIDOS ABIERTOS.
              </p>
              <p className="max-w-[400px] text-center text-[13px] text-cy-muted">
                Probá ampliar el radio o cambiar los filtros. O publicá vos tu propia
                convocatoria.
              </p>
              <button
                type="button"
                className="mt-3 border-card border-cy-line bg-cy-accent px-4 py-2 font-ui text-[13px] font-bold uppercase tracking-wide text-cy-ink"
              >
                Armar un partido
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">
              {filtered.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

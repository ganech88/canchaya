import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Chip, Placeholder, Rating, Stamp } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'
import { fetchVenueBySlug, fetchVenueList } from '@canchaya/db'
import { SectionTitle } from '@/components/owner/SectionTitle'
import { VenueCalendar } from '@/components/public/VenueCalendar'
import { MOCK_VENUES, formatPriceFromCents } from '@/data/mock'
import { venueDetailToView, venueToCard } from '@/lib/adapters'
import { getServerClient, isNhostConfigured } from '@/lib/nhost/server'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Si Nhost está configurado, generamos rutas para los venues reales; sino, los mocks.
  if (isNhostConfigured()) {
    try {
      const rows = await fetchVenueList(getServerClient(), { limit: 50 })
      if (rows.length > 0) return rows.map((v) => ({ slug: v.slug }))
    } catch {
      /* fallback to mocks */
    }
  }
  return MOCK_VENUES.map((v) => ({ slug: v.slug }))
}

const AMENITY_LABELS: Record<string, string> = {
  parking: 'Estacionamiento',
  bar: 'Bar',
  showers: 'Duchas',
  changing_rooms: 'Vestuarios',
  parrilla: 'Parrilla',
  coaching: 'Profesores',
  wifi: 'WiFi',
  lighting: 'Iluminación',
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { slug } = await params

  // Intentamos primero contra Nhost real; si no responde o no existe, fallback a mocks.
  let venue: ReturnType<typeof venueToCard> | null = null
  if (isNhostConfigured()) {
    try {
      const detail = await fetchVenueBySlug(getServerClient(), slug)
      if (detail) venue = venueDetailToView(detail)
    } catch {
      /* fallback */
    }
  }
  if (!venue) {
    const mock = MOCK_VENUES.find((v) => v.slug === slug)
    if (!mock) notFound()
    venue = mock
  }

  const reviews = [
    { user: 'Martín B.', stars: 5, text: 'Excelente cancha, muy mantenida. El bar es un plus. Volvemos todas las semanas.', date: '14 MAR' },
    { user: 'Laura G.', stars: 5, text: 'La mejor de la zona. Siempre puntuales con las reservas.', date: '07 MAR' },
    { user: 'Nicolás P.', stars: 4, text: 'Muy bien todo. El estacionamiento a veces se llena.', date: '28 FEB' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="border-b-card border-cy-line">
        <Placeholder variant={venue.imgVariant} className="h-[360px] w-full" label="Foto principal" />
      </section>

      <div className="mx-auto max-w-[1280px] px-7">
        {/* Breadcrumb */}
        <div className="py-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cy-muted">
            <Link href="/" className="hover:text-cy-red">
              Inicio
            </Link>
            {' / '}
            <Link href={'/results' as never} className="hover:text-cy-red">
              Canchas
            </Link>
            {' / '}
            <Link href={`/results?city=${venue.city.toLowerCase()}` as never} className="hover:text-cy-red">
              {venue.city}
            </Link>
            {' / '}
            <span className="text-cy-ink">{venue.name}</span>
          </p>
        </div>

        {/* Title block */}
        <section className="border-b-card border-cy-line bg-cy-paper px-6 pb-6 pt-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
                § FICHA · {venue.country.toUpperCase()}
              </p>
              <h1 className="mt-1 font-display text-[72px] leading-[0.88] tracking-tighter text-cy-ink">
                {venue.name}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <Rating value={venue.rating} count={venue.reviewsCount} />
                <span className="font-mono text-[10px] text-cy-muted">·</span>
                <p className="font-mono text-[11px] uppercase text-cy-ink">
                  {venue.city} · {venue.distanceKm}km
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
                DESDE / HORA
              </p>
              <p className="font-display text-[48px] leading-[0.85] tracking-tight text-cy-ink">
                {formatPriceFromCents(venue.priceFromCents, venue.priceCurrency)}
              </p>
              <Stamp>Seña 50% al reservar</Stamp>
            </div>
          </div>
        </section>

        {/* Body: 2 cols */}
        <div className="grid gap-8 py-10" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
          <div>
            {/* Deportes */}
            <section className="mb-8">
              <SectionTitle eyebrow="DISPONIBLE" title="Deportes" />
              <div className="flex flex-wrap gap-2">
                {venue.sports.map((s) => (
                  <Chip key={s} variant="fill">
                    {s.replace('_', ' ').toUpperCase()}
                  </Chip>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section className="mb-8">
              <SectionTitle eyebrow="COMODIDADES" title="Qué ofrecemos" />
              <div className="grid grid-cols-3 gap-2.5">
                {venue.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 border-chip border-cy-line bg-cy-paper px-3 py-2.5">
                    <Icon name="dot" size={8} />
                    <span className="font-mono text-[12px] uppercase tracking-wider text-cy-ink">
                      {AMENITY_LABELS[a] ?? a}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Calendario */}
            <section>
              <SectionTitle eyebrow="RESERVAR" title="Turnos disponibles" />
              <VenueCalendar />
            </section>

            {/* Reseñas */}
            <section className="mt-10">
              <SectionTitle
                eyebrow={`${venue.reviewsCount} RESEÑAS`}
                title="Qué dicen los jugadores"
                right={
                  <span className="flex items-center gap-1 font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
                    ★ {venue.rating}
                  </span>
                }
              />
              <div className="space-y-0">
                {reviews.map((r, i) => (
                  <div key={i} className="flex gap-4 border-b border-cy-line py-4">
                    <div className="w-[48px] shrink-0">
                      <Placeholder variant="accent" className="h-[40px] w-[40px]" label={r.user.split(' ').map((p) => p[0]).join('')} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="font-display text-[16px] leading-[14px] tracking-tight text-cy-ink">
                          {r.user}
                        </p>
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-cy-muted">
                          <span>{'★'.repeat(r.stars)}</span>
                          <span>·</span>
                          <span>{r.date}</span>
                        </div>
                      </div>
                      <p className="mt-1.5 text-[13px] text-cy-ink">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column: map + contacto + policies */}
          <aside className="flex flex-col gap-5">
            <div className="border-card border-cy-line bg-cy-field p-4">
              <div className="flex h-[200px] items-center justify-center bg-cy-field-2 font-mono text-[10px] uppercase tracking-widest text-cy-accent">
                MAPA · INTEGRAR MAPBOX
              </div>
            </div>

            <div className="border-card border-cy-line bg-cy-paper p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-muted">
                Dirección
              </p>
              <p className="mt-1 font-ui text-[14px] text-cy-ink">
                Av. Sarmiento 4320, {venue.city}
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  href="#"
                  className="flex-1 border-chip border-cy-line bg-cy-ink px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-cy-accent"
                >
                  Llamar
                </Link>
                <Link
                  href="#"
                  className="flex-1 border-chip border-cy-line bg-cy-paper px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-cy-ink"
                >
                  Cómo llegar
                </Link>
              </div>
            </div>

            <div className="border-card border-cy-line bg-cy-accent p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-ink">
                § POLÍTICA DE RESERVA
              </p>
              <ul className="mt-2 space-y-1 text-[12px] text-cy-ink">
                <li>→ Seña del 50% al confirmar</li>
                <li>→ Saldo en cancha</li>
                <li>→ Cancelación gratis con 24h de antelación</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

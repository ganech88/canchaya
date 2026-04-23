import Link from 'next/link'
import { Chip, Placeholder, Rating } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'
import { formatPriceFromCents, type MockVenueCard } from '@/data/mock'

interface Props {
  venue: MockVenueCard
  slots?: Array<{ start: string; priceFromCents: number }>
}

const SPORT_LABELS: Record<string, string> = {
  futbol_5: 'F5',
  futbol_7: 'F7',
  futbol_8: 'F8',
  futbol_11: 'F11',
  padel: 'Pádel',
  tenis: 'Tenis',
  basquet: 'Básquet',
  voley: 'Vóley',
}

export function VenueCard({ venue, slots }: Props) {
  return (
    <Link
      href={`/venues/${venue.slug}` as never}
      className="group block border-card border-cy-line bg-cy-paper transition-colors hover:bg-cy-bg"
    >
      <div className="relative">
        <Placeholder variant={venue.imgVariant} className="h-[180px] w-full" label="Foto" />
        {venue.tag && (
          <div className="absolute left-3 top-3">
            <Chip variant="fill">{venue.tag}</Chip>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {venue.sports.slice(0, 2).map((s) => (
            <Chip key={s} variant="accent">
              {SPORT_LABELS[s] ?? s}
            </Chip>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
            {venue.name}
          </h3>
          <Rating value={venue.rating} count={venue.reviewsCount} />
        </div>

        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-cy-muted">
          {venue.city} · {venue.distanceKm}km · {venue.country}
        </p>

        {slots && slots.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {slots.slice(0, 5).map((s, i) => (
              <div key={i} className="border-chip border-cy-line bg-cy-bg px-2 py-1">
                <span className="font-mono text-[10px] font-bold uppercase text-cy-ink">
                  {s.start}
                </span>
              </div>
            ))}
            {slots.length > 5 && (
              <span className="font-mono text-[10px] text-cy-muted">+{slots.length - 5}</span>
            )}
          </div>
        )}

        <div className="my-2.5 h-[2px] bg-cy-line" />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">
              Desde / hora
            </p>
            <p className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
              {formatPriceFromCents(venue.priceFromCents, venue.priceCurrency)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 border-card border-cy-line bg-cy-ink px-3 py-2 font-ui text-[12px] font-bold uppercase tracking-wide text-cy-accent group-hover:bg-cy-accent group-hover:text-cy-ink">
            Ver detalle
            <Icon name="arrow" size={14} />
          </div>
        </div>
      </div>
    </Link>
  )
}

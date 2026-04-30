import type { VenueListItem } from '@canchaya/db'
import type { PlaceholderVariant } from '@canchaya/ui/native'
import type { MockCourt } from '@/data/courts'

const VARIANTS: PlaceholderVariant[] = ['field', 'accent', 'dark']

const SPORT_LABELS: Record<string, string> = {
  futbol: 'Fútbol',
  futbol_5: 'Fútbol 5',
  futbol_7: 'Fútbol 7',
  futbol_8: 'Fútbol 8',
  futbol_11: 'Fútbol 11',
  padel: 'Pádel',
  tenis: 'Tenis',
  basquet: 'Básquet',
  voley: 'Vóley',
}

/**
 * VenueListItem (GraphQL UUIDs) → MockCourt (legacy con `id: number`).
 * Asignamos ids secuenciales 1..N en base al orden recibido. Para navegación,
 * el detail screen también recibe el index — cuando refactoricemos detail a
 * usar slug, esto pierde sentido.
 */
export function venuesToMobileCourts(venues: VenueListItem[]): MockCourt[] {
  return venues.map((v, i) => {
    const cheapestCourt = v.courts[0]
    const sportCode = cheapestCourt?.sport.code ?? ''
    return {
      id: i + 1,
      name: v.name.toUpperCase(),
      zone: v.city ? `${v.city} · 0km` : 'Sin ubicación',
      type: SPORT_LABELS[sportCode] ?? cheapestCourt?.sport.name ?? '—',
      price: Math.round((cheapestCourt?.base_price_cents ?? 0) / 100),
      rating: Number(v.rating_stars) || 0,
      reviews: v.rating_count,
      open: true,
      tag: v.rating_count > 200 ? 'HOT' : v.rating_count < 100 ? 'NEW' : null,
      color: VARIANTS[i % VARIANTS.length]!,
    }
  })
}

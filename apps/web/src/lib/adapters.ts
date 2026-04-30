// Mappers: VenueListItem (GraphQL) → shapes que esperan los componentes legacy.
// Cuando montemos codegen, los tipos generados reemplazan estos shapes y los
// adapters quedan obsoletos. Por ahora puente entre lo viejo y lo nuevo.

import type { VenueListItem, VenueDetail } from '@canchaya/db'
import type { MockVenueCard } from '@/data/mock'
import type { PlaceholderVariant } from '@canchaya/ui/web'

const VARIANTS: PlaceholderVariant[] = ['field', 'accent', 'dark']

function pickVariant(seed: string): PlaceholderVariant {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return VARIANTS[Math.abs(h) % VARIANTS.length]!
}

export function venueToCard(v: VenueListItem): MockVenueCard {
  const cheapestCourt = v.courts[0]
  return {
    id: v.id,
    slug: v.slug,
    name: v.name.toUpperCase(),
    city: v.city ?? '—',
    country: 'Argentina', // TODO: traer country join cuando agreguemos i18n
    distanceKm: 0, // TODO: calcular vía haversine cuando tengamos geo del user
    sports: v.courts.map((c) => c.sport.code),
    rating: Number(v.rating_stars) || 0,
    reviewsCount: v.rating_count,
    priceFromCents: cheapestCourt?.base_price_cents ?? 0,
    priceCurrency: 'ARS',
    imgVariant: pickVariant(v.id),
    amenities: v.amenities.map((a) => a.amenity.code),
    tag: v.rating_count > 200 ? 'HOT' : v.rating_count < 100 ? 'NEW' : null,
  }
}

export function venuesToCards(venues: VenueListItem[]): MockVenueCard[] {
  return venues.map(venueToCard)
}

// ── Open matches ────────────────────────────────────────────────────────────
import type { OpenMatchListItem } from '@canchaya/db'
import type { MockMatch } from '@/data/matches'

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

function formatMatchDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const isTomorrow =
    d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate()
  const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  if (sameDay) return `HOY ${time}`
  if (isTomorrow) return `MAÑANA ${time}`
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${time}`
}

export function openMatchToCard(m: OpenMatchListItem): MockMatch {
  const initials = m.booking.host.name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const sportCode = m.booking.court.sport.code
  return {
    id: m.id,
    venueName: m.booking.court.venue.name.toUpperCase(),
    venueCity: m.booking.court.venue.city ?? '—',
    distanceKm: 0,
    sportCode,
    sportLabel: SPORT_LABELS[sportCode] ?? m.booking.court.sport.name,
    dateLabel: formatMatchDate(m.booking.starts_at),
    level: m.level as MockMatch['level'],
    genderFilter: m.gender_filter as MockMatch['genderFilter'],
    ageMin: m.age_min,
    ageMax: m.age_max,
    spotsFilled: m.spots_filled,
    spotsTotal: m.spots_total,
    pricePerPlayerCents: m.price_per_player_cents,
    currency: 'ARS',
    host: { name: m.booking.host.name, initials },
  }
}

export function openMatchesToCards(rows: OpenMatchListItem[]): MockMatch[] {
  return rows.map(openMatchToCard)
}

export interface VenueDetailView extends MockVenueCard {
  description: string | null
  address: string
  phone: string | null
  hasRecording: boolean
  depositPercent: number
  cancellationHoursNotice: number
  businessHours: Array<{ day_of_week: string; open_time: string; close_time: string }>
}

export function venueDetailToView(v: VenueDetail): VenueDetailView {
  return {
    ...venueToCard(v),
    description: v.description,
    address: v.address,
    phone: v.phone,
    hasRecording: v.has_recording,
    depositPercent: v.deposit_percent,
    cancellationHoursNotice: v.cancellation_hours_notice,
    businessHours: v.business_hours,
  }
}

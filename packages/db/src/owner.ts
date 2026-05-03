// Queries del dashboard del owner. Estas queries asumen que el caller resolvió
// el venue_id (un owner puede tener varios venues; el seleccionado se pasa como
// parámetro). Las shapes evitan exponer columnas internas y se mapean a vistas
// de UI vía adapters en `apps/web/src/lib/adapters.ts`.

import type { CanchaYaClient } from './client'

// ── Shapes ──────────────────────────────────────────────────────────────────
export interface OwnerVenueSummary {
  id: string
  slug: string
  name: string
  city: string | null
  address: string
  phone: string | null
  description: string | null
  rating_stars: number
  rating_count: number
  deposit_percent: number
  cancellation_hours_notice: number
  has_recording: boolean
  amenities: Array<{ amenity: { id: number; code: string; name: string } }>
  courts_aggregate: { aggregate: { count: number } }
}

export interface OwnerCourtRow {
  id: string
  name: string
  surface: string | null
  covered: boolean
  base_price_cents: number
  capacity: number | null
  active: boolean
  photos: string[]
  sport: { code: string; name: string }
  bookings_aggregate: { aggregate: { count: number } }
}

export interface OwnerBookingRow {
  id: string
  starts_at: string
  ends_at: string
  total_cents: number
  deposit_cents: number
  balance_cents: number
  status: string
  payment_status: string
  party_size: number
  notes: string | null
  has_recording: boolean
  cancelled_at: string | null
  cancelled_reason: string | null
  created_at: string
  court: {
    id: string
    name: string
    sport: { code: string; name: string }
  }
  host: {
    id: string
    name: string
    phone: string | null
    email: string
    avatar_url: string | null
    stats_matches: number
  }
  open_match: {
    id: string
    spots_total: number
    spots_filled: number
    level: string
  } | null
}

export interface OwnerProductRow {
  id: string
  name: string
  category: string
  price_cents: number
  cost_cents: number | null
  stock: number
  stock_min: number
  active: boolean
}

export interface OwnerSaleRow {
  id: string
  total_cents: number
  paid_at: string
  items: Array<{ product_id: string; qty: number; unit_price_cents: number }>
  booking_id: string | null
}

// ── Query strings ───────────────────────────────────────────────────────────
const OWNER_VENUE_FIELDS = `
  id slug name city address phone description rating_stars rating_count
  deposit_percent cancellation_hours_notice has_recording
  amenities { amenity { id code name } }
  courts_aggregate { aggregate { count } }
`

export const Q_OWNER_VENUES = `
  query OwnerVenues($ownerId: uuid!) {
    venues(where: {owner_id: {_eq: $ownerId}, active: {_eq: true}}, order_by: {name: asc}) {
      ${OWNER_VENUE_FIELDS}
    }
  }
`

const OWNER_COURT_FIELDS = `
  id name surface covered base_price_cents capacity active photos
  sport { code name }
  bookings_aggregate(
    where: {starts_at: {_gte: $weekStart}, status: {_in: ["confirmed", "paid", "done"]}}
  ) { aggregate { count } }
`

export const Q_OWNER_COURTS = `
  query OwnerCourts($venueId: uuid!, $weekStart: timestamptz!) {
    courts(where: {venue_id: {_eq: $venueId}}, order_by: {name: asc}) {
      ${OWNER_COURT_FIELDS}
    }
  }
`

const OWNER_BOOKING_FIELDS = `
  id starts_at ends_at total_cents deposit_cents balance_cents
  status payment_status party_size notes has_recording
  cancelled_at cancelled_reason created_at
  court { id name sport { code name } }
  host { id name phone email avatar_url stats_matches }
  open_match { id spots_total spots_filled level }
`

export const Q_OWNER_BOOKINGS_RANGE = `
  query OwnerBookingsRange($venueId: uuid!, $from: timestamptz!, $to: timestamptz!) {
    bookings(
      where: {
        court: {venue_id: {_eq: $venueId}},
        starts_at: {_gte: $from, _lt: $to}
      },
      order_by: {starts_at: asc}
    ) { ${OWNER_BOOKING_FIELDS} }
  }
`

export const Q_OWNER_BOOKING_BY_ID = `
  query OwnerBookingById($id: uuid!) {
    bookings_by_pk(id: $id) { ${OWNER_BOOKING_FIELDS} }
  }
`

export const Q_OWNER_PRODUCTS = `
  query OwnerProducts($venueId: uuid!) {
    products(where: {venue_id: {_eq: $venueId}}, order_by: {name: asc}) {
      id name category price_cents cost_cents stock stock_min active
    }
  }
`

export const Q_OWNER_SALES = `
  query OwnerSales($venueId: uuid!, $from: timestamptz!) {
    sales(
      where: {venue_id: {_eq: $venueId}, paid_at: {_gte: $from}},
      order_by: {paid_at: desc}
    ) { id total_cents paid_at items booking_id }
  }
`

// ── Helpers ─────────────────────────────────────────────────────────────────
function unwrap<T>(res: { body: { data?: T; errors?: Array<{ message: string }> } }): T {
  if (res.body.errors?.length) {
    throw new Error(res.body.errors.map((e) => e.message).join('; '))
  }
  if (!res.body.data) throw new Error('GraphQL response sin data')
  return res.body.data
}

export async function fetchOwnerVenues(
  nhost: CanchaYaClient,
  ownerId: string,
): Promise<OwnerVenueSummary[]> {
  const res = await nhost.graphql.request<{ venues: OwnerVenueSummary[] }>({
    query: Q_OWNER_VENUES,
    variables: { ownerId },
  })
  return unwrap(res).venues
}

export async function fetchOwnerCourts(
  nhost: CanchaYaClient,
  venueId: string,
  weekStart: Date,
): Promise<OwnerCourtRow[]> {
  const res = await nhost.graphql.request<{ courts: OwnerCourtRow[] }>({
    query: Q_OWNER_COURTS,
    variables: { venueId, weekStart: weekStart.toISOString() },
  })
  return unwrap(res).courts
}

export async function fetchOwnerBookingsRange(
  nhost: CanchaYaClient,
  venueId: string,
  from: Date,
  to: Date,
): Promise<OwnerBookingRow[]> {
  const res = await nhost.graphql.request<{ bookings: OwnerBookingRow[] }>({
    query: Q_OWNER_BOOKINGS_RANGE,
    variables: { venueId, from: from.toISOString(), to: to.toISOString() },
  })
  return unwrap(res).bookings
}

export async function fetchOwnerBookingById(
  nhost: CanchaYaClient,
  bookingId: string,
): Promise<OwnerBookingRow | null> {
  const res = await nhost.graphql.request<{ bookings_by_pk: OwnerBookingRow | null }>({
    query: Q_OWNER_BOOKING_BY_ID,
    variables: { id: bookingId },
  })
  return unwrap(res).bookings_by_pk
}

export async function fetchOwnerProducts(
  nhost: CanchaYaClient,
  venueId: string,
): Promise<OwnerProductRow[]> {
  const res = await nhost.graphql.request<{ products: OwnerProductRow[] }>({
    query: Q_OWNER_PRODUCTS,
    variables: { venueId },
  })
  return unwrap(res).products
}

export async function fetchOwnerSales(
  nhost: CanchaYaClient,
  venueId: string,
  from: Date,
): Promise<OwnerSaleRow[]> {
  const res = await nhost.graphql.request<{ sales: OwnerSaleRow[] }>({
    query: Q_OWNER_SALES,
    variables: { venueId, from: from.toISOString() },
  })
  return unwrap(res).sales
}

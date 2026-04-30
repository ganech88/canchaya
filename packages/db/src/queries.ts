// GraphQL queries reusables. La idea: una query por "view" del producto, con
// shape estable que mappea a los tipos de UI. Cuando montemos codegen, los tipos
// generados reemplazan los manuales.

import type { CanchaYaClient } from './client'

// ── Shapes ──────────────────────────────────────────────────────────────────
export interface VenueListItem {
  id: string
  slug: string
  name: string
  city: string | null
  latitude: number | null
  longitude: number | null
  rating_stars: number
  rating_count: number
  amenities: Array<{ amenity: { code: string; name: string } }>
  courts: Array<{
    id: string
    name: string
    base_price_cents: number
    sport: { code: string; name: string }
  }>
}

export interface VenueDetail extends VenueListItem {
  description: string | null
  address: string
  phone: string | null
  photos: string[]
  has_recording: boolean
  deposit_percent: number
  cancellation_hours_notice: number
  business_hours: Array<{
    day_of_week: string
    open_time: string
    close_time: string
  }>
}

export interface OpenMatchListItem {
  id: string
  spots_total: number
  spots_filled: number
  level: string
  price_per_player_cents: number
  gender_filter: string
  age_min: number | null
  age_max: number | null
  expires_at: string
  booking: {
    starts_at: string
    ends_at: string
    host: { id: string; name: string; avatar_url: string | null }
    court: {
      sport: { code: string; name: string }
      venue: { name: string; city: string | null }
    }
  }
}

// ── Query strings ───────────────────────────────────────────────────────────
const VENUE_LIST_FIELDS = `
  id slug name city latitude longitude rating_stars rating_count
  amenities { amenity { code name } }
  courts(where: {active: {_eq: true}}, order_by: {base_price_cents: asc}) {
    id name base_price_cents
    sport { code name }
  }
`

export const Q_VENUE_LIST = `
  query VenueList($limit: Int = 20, $sportCode: String) {
    venues(
      where: {
        active: {_eq: true},
        _or: [
          {courts: {sport: {code: {_eq: $sportCode}}}},
          {_not: {courts: {}}}
        ]
      },
      order_by: {rating_stars: desc},
      limit: $limit
    ) { ${VENUE_LIST_FIELDS} }
  }
`

export const Q_VENUE_LIST_ALL = `
  query VenueListAll($limit: Int = 20) {
    venues(
      where: {active: {_eq: true}},
      order_by: {rating_stars: desc},
      limit: $limit
    ) { ${VENUE_LIST_FIELDS} }
  }
`

export const Q_VENUE_BY_SLUG = `
  query VenueBySlug($slug: String!) {
    venues(where: {slug: {_eq: $slug}, active: {_eq: true}}, limit: 1) {
      ${VENUE_LIST_FIELDS}
      description address phone photos has_recording
      deposit_percent cancellation_hours_notice
      business_hours(order_by: {day_of_week: asc, open_time: asc}) {
        day_of_week open_time close_time
      }
    }
  }
`

export const Q_OPEN_MATCHES = `
  query OpenMatches($limit: Int = 20) {
    open_matches(
      where: {status: {_eq: "open"}, expires_at: {_gt: "now()"}},
      order_by: {booking: {starts_at: asc}},
      limit: $limit
    ) {
      id spots_total spots_filled level price_per_player_cents
      gender_filter age_min age_max expires_at
      booking {
        starts_at ends_at
        host { id name avatar_url }
        court {
          sport { code name }
          venue { name city }
        }
      }
    }
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

export async function fetchVenueList(
  nhost: CanchaYaClient,
  options: { sportCode?: string; limit?: number } = {},
): Promise<VenueListItem[]> {
  const { sportCode, limit = 20 } = options
  if (sportCode) {
    const res = await nhost.graphql.request<{ venues: VenueListItem[] }>({
      query: Q_VENUE_LIST,
      variables: { limit, sportCode },
    })
    return unwrap(res).venues
  }
  const res = await nhost.graphql.request<{ venues: VenueListItem[] }>({
    query: Q_VENUE_LIST_ALL,
    variables: { limit },
  })
  return unwrap(res).venues
}

export async function fetchVenueBySlug(
  nhost: CanchaYaClient,
  slug: string,
): Promise<VenueDetail | null> {
  const res = await nhost.graphql.request<{ venues: VenueDetail[] }>({
    query: Q_VENUE_BY_SLUG,
    variables: { slug },
  })
  return unwrap(res).venues[0] ?? null
}

export async function fetchOpenMatches(
  nhost: CanchaYaClient,
  limit = 20,
): Promise<OpenMatchListItem[]> {
  const res = await nhost.graphql.request<{ open_matches: OpenMatchListItem[] }>({
    query: Q_OPEN_MATCHES,
    variables: { limit },
  })
  return unwrap(res).open_matches
}

// ── Mercado Pago ────────────────────────────────────────────────────────────
export interface CheckoutPreference {
  init_point: string
  preference_id: string
}

/**
 * Llama a la Nhost Function `createPaymentPreference` para iniciar el checkout
 * de MP de una booking. Devuelve la URL `init_point` que la app abre en un
 * browser/in-app browser.
 */
export async function createCheckoutForBooking(
  nhost: CanchaYaClient,
  bookingId: string,
): Promise<CheckoutPreference> {
  const res = await nhost.functions.post<CheckoutPreference>(
    '/createPaymentPreference',
    { booking_id: bookingId },
  )
  if (res.status >= 400 || !res.body) {
    const errBody = res.body as { error?: string } | null
    throw new Error(errBody?.error ?? `Function error ${res.status}`)
  }
  return res.body
}

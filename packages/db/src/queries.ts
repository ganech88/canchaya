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

// ── Open match detail + creación ────────────────────────────────────────────
export interface OpenMatchDetail extends OpenMatchListItem {
  status: string
}

export const Q_OPEN_MATCH_BY_ID = `
  query OpenMatchById($id: uuid!) {
    open_matches_by_pk(id: $id) {
      id spots_total spots_filled level price_per_player_cents
      gender_filter age_min age_max expires_at status
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

export async function fetchOpenMatchById(
  nhost: CanchaYaClient,
  id: string,
): Promise<OpenMatchDetail | null> {
  const res = await nhost.graphql.request<{ open_matches_by_pk: OpenMatchDetail | null }>({
    query: Q_OPEN_MATCH_BY_ID,
    variables: { id },
  })
  return unwrap(res).open_matches_by_pk
}

export interface CreateOpenMatchInput {
  bookingId: string
  spotsTotal: number
  level: 'principiante' | 'intermedio' | 'avanzado' | 'profesional'
  pricePerPlayerCents: number
  genderFilter?: 'any' | 'm' | 'f'
  ageMin?: number | null
  ageMax?: number | null
  expiresAt?: string // ISO; default = booking.starts_at - 30min
  visibleRadiusKm?: number
}

const M_CREATE_OPEN_MATCH = `
  mutation CreateOpenMatch($obj: open_matches_insert_input!) {
    insert_open_matches_one(object: $obj) { id }
  }
`

export async function createOpenMatch(
  nhost: CanchaYaClient,
  input: CreateOpenMatchInput,
): Promise<string> {
  const obj = {
    booking_id: input.bookingId,
    spots_total: input.spotsTotal,
    level: input.level,
    price_per_player_cents: input.pricePerPlayerCents,
    gender_filter: input.genderFilter ?? 'any',
    age_min: input.ageMin ?? null,
    age_max: input.ageMax ?? null,
    expires_at: input.expiresAt,
    visible_radius_km: input.visibleRadiusKm ?? 5,
  }
  const res = await nhost.graphql.request<{ insert_open_matches_one: { id: string } }>({
    query: M_CREATE_OPEN_MATCH,
    variables: { obj },
  })
  return unwrap(res).insert_open_matches_one.id
}

// ── User's recent bookings (host) ───────────────────────────────────────────
export interface UserBookingRow {
  id: string
  starts_at: string
  ends_at: string
  total_cents: number
  party_size: number
  status: string
  court: {
    name: string
    sport: { code: string; name: string }
    venue: { name: string; city: string | null }
  }
  open_match: { id: string } | null
}

export const Q_USER_RECENT_BOOKINGS = `
  query UserRecentBookings($userId: uuid!, $limit: Int = 5) {
    bookings(
      where: {host_id: {_eq: $userId}, starts_at: {_gte: "now()"}},
      order_by: {starts_at: asc},
      limit: $limit
    ) {
      id starts_at ends_at total_cents party_size status
      court {
        name
        sport { code name }
        venue { name city }
      }
      open_match { id }
    }
  }
`

export async function fetchUserUpcomingBookings(
  nhost: CanchaYaClient,
  userId: string,
  limit = 5,
): Promise<UserBookingRow[]> {
  const res = await nhost.graphql.request<{ bookings: UserBookingRow[] }>({
    query: Q_USER_RECENT_BOOKINGS,
    variables: { userId, limit },
  })
  return unwrap(res).bookings
}

// ── Chat (messages del partido) ─────────────────────────────────────────────
export interface ChatMessageRow {
  id: string
  user_id: string | null
  text: string | null
  kind: 'user' | 'system'
  meta: Record<string, unknown> | null
  created_at: string
  user: { id: string; name: string; avatar_url: string | null } | null
}

export const Q_CHAT_MESSAGES = `
  query ChatMessages($bookingId: uuid!, $since: timestamptz = "1970-01-01") {
    chat_messages(
      where: {booking_id: {_eq: $bookingId}, created_at: {_gt: $since}},
      order_by: {created_at: asc}
    ) {
      id user_id text kind meta created_at
      user { id name avatar_url }
    }
  }
`

export async function fetchChatMessages(
  nhost: CanchaYaClient,
  bookingId: string,
  since?: Date,
): Promise<ChatMessageRow[]> {
  const res = await nhost.graphql.request<{ chat_messages: ChatMessageRow[] }>({
    query: Q_CHAT_MESSAGES,
    variables: { bookingId, since: since?.toISOString() ?? '1970-01-01' },
  })
  return unwrap(res).chat_messages
}

const M_INSERT_CHAT_MESSAGE = `
  mutation InsertChatMessage($obj: chat_messages_insert_input!) {
    insert_chat_messages_one(object: $obj) { id created_at }
  }
`

export async function sendChatMessage(
  nhost: CanchaYaClient,
  bookingId: string,
  userId: string,
  text: string,
): Promise<{ id: string; created_at: string }> {
  const res = await nhost.graphql.request<{ insert_chat_messages_one: { id: string; created_at: string } }>({
    query: M_INSERT_CHAT_MESSAGE,
    variables: { obj: { booking_id: bookingId, user_id: userId, text, kind: 'user' } },
  })
  return unwrap(res).insert_chat_messages_one
}

// Booking básico para el header del chat
export interface ChatBookingHeader {
  id: string
  starts_at: string
  party_size: number
  court: {
    name: string
    sport: { code: string; name: string }
    venue: { name: string; address: string }
  }
  open_match: { spots_total: number; spots_filled: number } | null
}

export const Q_CHAT_BOOKING_HEADER = `
  query ChatBookingHeader($id: uuid!) {
    bookings_by_pk(id: $id) {
      id starts_at party_size
      court {
        name
        sport { code name }
        venue { name address }
      }
      open_match { spots_total spots_filled }
    }
  }
`

export async function fetchChatBookingHeader(
  nhost: CanchaYaClient,
  bookingId: string,
): Promise<ChatBookingHeader | null> {
  const res = await nhost.graphql.request<{ bookings_by_pk: ChatBookingHeader | null }>({
    query: Q_CHAT_BOOKING_HEADER,
    variables: { id: bookingId },
  })
  return unwrap(res).bookings_by_pk
}

// ── Bookings (creación) ─────────────────────────────────────────────────────
export interface CreateBookingInput {
  courtId: string
  hostId: string
  startsAt: string // ISO
  endsAt: string // ISO
  totalCents: number
  depositCents: number
  partySize?: number
  notes?: string | null
}

const M_CREATE_BOOKING = `
  mutation CreateBooking($obj: bookings_insert_input!) {
    insert_bookings_one(object: $obj) {
      id total_cents deposit_cents balance_cents starts_at ends_at status payment_status
    }
  }
`

export async function createBooking(
  nhost: CanchaYaClient,
  input: CreateBookingInput,
): Promise<{ id: string; total_cents: number; deposit_cents: number }> {
  const obj = {
    court_id: input.courtId,
    host_id: input.hostId,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    total_cents: input.totalCents,
    deposit_cents: input.depositCents,
    balance_cents: input.totalCents - input.depositCents,
    party_size: input.partySize ?? 1,
    notes: input.notes ?? null,
    status: 'pending',
    payment_status: 'pending',
  }
  const res = await nhost.graphql.request<{
    insert_bookings_one: { id: string; total_cents: number; deposit_cents: number }
  }>({
    query: M_CREATE_BOOKING,
    variables: { obj },
  })
  return unwrap(res).insert_bookings_one
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

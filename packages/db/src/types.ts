// Types del dominio — espejo manual del schema SQL.
// Cuando tengamos Supabase linkeado, corremos `pnpm db:types` y este archivo se reemplaza
// con los generados automáticamente.

// ═══ Enums ═══════════════════════════════════════════════════════════════════
export type UserRole = 'player' | 'owner' | 'admin'
export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'done'
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
export type MatchLevel = 'principiante' | 'intermedio' | 'avanzado' | 'profesional'
export type OpenMatchStatus = 'open' | 'filled' | 'expired' | 'cancelled'
export type ProductCategory = 'bebida' | 'comida' | 'alquiler' | 'otro'
export type Gender = 'm' | 'f' | 'x' | 'prefiero_no_decir'
export type GenderFilter = 'any' | 'm' | 'f'
export type DayOfWeekCode = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU' | 'HO'

// ═══ Catálogos ═══════════════════════════════════════════════════════════════
export interface Country {
  id: number
  code: string // ISO 3166-1 alpha-2
  name: string
  currency: string // ISO 4217
  timezone: string
  phone_code: string
  active: boolean
  is_default: boolean
}

export interface Sport {
  id: number
  code: string
  name: string
  parent_id: number | null
  default_duration: number // minutos
  players_min: number
  players_max: number
  order_index: number
  icon: string | null
  active: boolean
}

export interface Amenity {
  id: number
  code: string
  name: string
  icon: string | null
  order_index: number
}

// ═══ Profiles ════════════════════════════════════════════════════════════════
export interface Profile {
  id: string
  role: UserRole
  country_id: number | null
  name: string
  phone: string | null
  email: string
  avatar_url: string | null
  gender: Gender | null
  birth_date: string | null // date
  level: MatchLevel | null
  bio: string | null
  stats_matches: number
  stats_goals: number
  stats_rating: number
  created_at: string
  updated_at: string
}

// ═══ Venues ══════════════════════════════════════════════════════════════════
export interface Venue {
  id: string
  owner_id: string
  country_id: number
  name: string
  slug: string
  description: string | null
  address: string
  city: string | null
  location: { type: 'Point'; coordinates: [number, number] } | null
  geohash: string | null
  phone: string | null
  photos: string[]
  logo_url: string | null
  background_url: string | null
  active: boolean
  deposit_percent: number
  cancellation_hours_notice: number
  has_recording: boolean
  rating_stars: number
  rating_count: number
  created_at: string
  updated_at: string
}

export interface VenueSport {
  venue_id: string
  sport_id: number
}

export interface VenueAmenity {
  venue_id: string
  amenity_id: number
}

export interface BusinessHour {
  id: number
  venue_id: string
  day_of_week: DayOfWeekCode
  open_time: string // 'HH:mm:ss'
  close_time: string
}

export interface VenueClosure {
  id: number
  venue_id: string
  starts_at: string
  ends_at: string
  reason: string | null
  created_at: string
}

// ═══ Courts + pricing ════════════════════════════════════════════════════════
export interface Court {
  id: string
  venue_id: string
  sport_id: number
  name: string
  surface: string | null
  covered: boolean
  base_price_cents: number
  capacity: number | null
  photos: string[]
  active: boolean
  created_at: string
}

export interface PriceRule {
  id: string
  court_id: string
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6
  hour_start: number
  hour_end: number
  price_cents: number
  discount_rule: string | null
  created_at: string
}

// ═══ Bookings ════════════════════════════════════════════════════════════════
export interface Booking {
  id: string
  court_id: string
  host_id: string
  starts_at: string
  ends_at: string
  total_cents: number
  deposit_cents: number
  balance_cents: number
  cancellation_hours_notice: number
  status: BookingStatus
  party_size: number
  notes: string | null
  has_recording: boolean
  payment_provider: string | null
  external_payment_id: string | null
  payment_status: PaymentStatus
  cancelled_at: string | null
  cancelled_reason: string | null
  created_at: string
  updated_at: string
}

export interface BookingParticipant {
  booking_id: string
  user_id: string
  paid_amount_cents: number
  paid_at: string | null
  joined_at: string
}

// ═══ Open matches (comunidad) ════════════════════════════════════════════════
export interface OpenMatch {
  id: string
  booking_id: string
  spots_total: number
  spots_filled: number
  level: MatchLevel
  price_per_player_cents: number
  visible_radius_km: number
  gender_filter: GenderFilter
  age_min: number | null
  age_max: number | null
  status: OpenMatchStatus
  expires_at: string
  created_at: string
}

// ═══ Reviews ═════════════════════════════════════════════════════════════════
export interface Review {
  id: string
  venue_id: string
  user_id: string
  booking_id: string | null
  stars: number
  text: string | null
  created_at: string
}

// ═══ Productos / ventas ══════════════════════════════════════════════════════
export interface Product {
  id: string
  venue_id: string
  name: string
  category: ProductCategory
  price_cents: number
  cost_cents: number | null
  stock: number
  stock_min: number
  active: boolean
  created_at: string
}

export interface SaleItem {
  product_id: string
  qty: number
  unit_price_cents: number
}

export interface Sale {
  id: string
  venue_id: string
  booking_id: string | null
  items: SaleItem[]
  total_cents: number
  paid_at: string
  created_at: string
}

// ═══ Chat ════════════════════════════════════════════════════════════════════
export interface ChatMessage {
  id: string
  booking_id: string
  user_id: string | null
  text: string | null
  kind: 'user' | 'system'
  meta: Record<string, unknown> | null
  created_at: string
}

// ═══ Helpers de funciones ════════════════════════════════════════════════════
export interface AvailableSlot {
  start_at: string
  end_at: string
  price_cents: number
}

// ═══ Database shape (la pide @supabase/supabase-js) ══════════════════════════
type OmitAudit<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>

export type Database = {
  public: {
    Tables: {
      countries:            { Row: Country;        Insert: Country;                                       Update: Partial<Country> }
      sports:               { Row: Sport;          Insert: Sport;                                         Update: Partial<Sport> }
      amenities:            { Row: Amenity;        Insert: Omit<Amenity, 'id'>;                           Update: Partial<Amenity> }
      profiles:             { Row: Profile;        Insert: Partial<Profile> & { id: string; name: string; email: string }; Update: Partial<Profile> }
      venues:               { Row: Venue;          Insert: OmitAudit<Venue> & { id?: string };            Update: Partial<Venue> }
      venue_sports:         { Row: VenueSport;     Insert: VenueSport;                                    Update: Partial<VenueSport> }
      venue_amenities:      { Row: VenueAmenity;   Insert: VenueAmenity;                                  Update: Partial<VenueAmenity> }
      business_hours:       { Row: BusinessHour;   Insert: Omit<BusinessHour, 'id'>;                      Update: Partial<BusinessHour> }
      venue_closures:       { Row: VenueClosure;   Insert: Omit<VenueClosure, 'id' | 'created_at'>;       Update: Partial<VenueClosure> }
      courts:               { Row: Court;          Insert: Omit<Court, 'id' | 'created_at'> & { id?: string }; Update: Partial<Court> }
      price_rules:          { Row: PriceRule;      Insert: Omit<PriceRule, 'id' | 'created_at'> & { id?: string }; Update: Partial<PriceRule> }
      bookings:             { Row: Booking;        Insert: OmitAudit<Booking> & { id?: string };          Update: Partial<Booking> }
      booking_participants: { Row: BookingParticipant; Insert: BookingParticipant;                        Update: Partial<BookingParticipant> }
      open_matches:         { Row: OpenMatch;      Insert: Omit<OpenMatch, 'id' | 'created_at'> & { id?: string }; Update: Partial<OpenMatch> }
      reviews:              { Row: Review;         Insert: Omit<Review, 'id' | 'created_at'> & { id?: string }; Update: Partial<Review> }
      products:             { Row: Product;        Insert: Omit<Product, 'id' | 'created_at'> & { id?: string }; Update: Partial<Product> }
      sales:                { Row: Sale;           Insert: Omit<Sale, 'id' | 'created_at'> & { id?: string }; Update: Partial<Sale> }
      chat_messages:        { Row: ChatMessage;    Insert: Omit<ChatMessage, 'id' | 'created_at'> & { id?: string }; Update: Partial<ChatMessage> }
    }
    Views: Record<string, never>
    Functions: {
      available_slots: {
        Args: { p_court_id: string; p_date: string; p_duration_minutes?: number }
        Returns: AvailableSlot[]
      }
    }
    Enums: {
      user_role: UserRole
      booking_status: BookingStatus
      payment_status: PaymentStatus
      match_level: MatchLevel
      open_match_status: OpenMatchStatus
      product_category: ProductCategory
      gender_option: Gender
      gender_filter: GenderFilter
      day_of_week_code: DayOfWeekCode
    }
  }
}

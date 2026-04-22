// Types manuales del dominio — espejan el schema SQL.
// Los types generados por `supabase gen types` viven en `types.generated.ts` (gitignored al inicio
// hasta que el proyecto Supabase esté linkeado). Este archivo es la fuente de verdad temporal.

export type Sport = 'futbol5' | 'futbol8' | 'futbol11' | 'padel' | 'tenis'
export type UserRole = 'player' | 'owner' | 'admin'
export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'done'
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
export type MatchLevel = 'principiante' | 'intermedio' | 'avanzado' | 'profesional'
export type OpenMatchStatus = 'open' | 'filled' | 'expired' | 'cancelled'
export type ProductCategory = 'bebida' | 'comida' | 'alquiler' | 'otro'

export interface Profile {
  id: string
  role: UserRole
  name: string
  phone: string | null
  email: string
  avatar_url: string | null
  level: MatchLevel | null
  bio: string | null
  stats_matches: number
  stats_goals: number
  stats_rating: number
  created_at: string
  updated_at: string
}

export interface Venue {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  address: string
  city: string | null
  // geography(point,4326) viaja como GeoJSON cuando usás PostgREST con representation=geojson.
  // Si se lee como texto (WKT), cambiar a `string | null`.
  location: { type: 'Point'; coordinates: [number, number] } | null
  sports: Sport[]
  amenities: string[]
  photos: string[]
  phone: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Court {
  id: string
  venue_id: string
  name: string
  sport: Sport
  surface: string | null
  covered: boolean
  base_price: number
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
  price: number
  discount_rule: string | null
  created_at: string
}

export interface Booking {
  id: string
  court_id: string
  host_id: string
  starts_at: string
  ends_at: string
  total: number
  status: BookingStatus
  party_size: number
  notes: string | null
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
  paid_amount: number
  paid_at: string | null
  joined_at: string
}

export interface OpenMatch {
  id: string
  booking_id: string
  spots_total: number
  spots_filled: number
  level: MatchLevel
  price_per_player: number
  visible_radius_km: number
  status: OpenMatchStatus
  expires_at: string
  created_at: string
}

export interface Product {
  id: string
  venue_id: string
  name: string
  category: ProductCategory
  price: number
  cost: number | null
  stock: number
  stock_min: number
  active: boolean
  created_at: string
}

export interface SaleItem {
  product_id: string
  qty: number
  unit_price: number
}

export interface Sale {
  id: string
  venue_id: string
  booking_id: string | null
  items: SaleItem[]
  total: number
  paid_at: string
  created_at: string
}

export interface ChatMessage {
  id: string
  booking_id: string
  user_id: string | null
  text: string | null
  kind: 'user' | 'system'
  meta: Record<string, unknown> | null
  created_at: string
}

// Placeholder para la shape de `Database` que espera @supabase/supabase-js.
// Apenas linkeemos el proyecto corremos `supabase gen types typescript --local > types.generated.ts`
// y este archivo se convierte en un re-export del generado.
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; email: string; name: string }; Update: Partial<Profile> }
      venues: { Row: Venue; Insert: Omit<Venue, 'id' | 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<Venue> }
      courts: { Row: Court; Insert: Omit<Court, 'id' | 'created_at'> & { id?: string }; Update: Partial<Court> }
      price_rules: { Row: PriceRule; Insert: Omit<PriceRule, 'id' | 'created_at'> & { id?: string }; Update: Partial<PriceRule> }
      bookings: { Row: Booking; Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<Booking> }
      booking_participants: { Row: BookingParticipant; Insert: BookingParticipant; Update: Partial<BookingParticipant> }
      open_matches: { Row: OpenMatch; Insert: Omit<OpenMatch, 'id' | 'created_at'> & { id?: string }; Update: Partial<OpenMatch> }
      products: { Row: Product; Insert: Omit<Product, 'id' | 'created_at'> & { id?: string }; Update: Partial<Product> }
      sales: { Row: Sale; Insert: Omit<Sale, 'id' | 'created_at'> & { id?: string }; Update: Partial<Sale> }
      chat_messages: { Row: ChatMessage; Insert: Omit<ChatMessage, 'id' | 'created_at'> & { id?: string }; Update: Partial<ChatMessage> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      sport: Sport
      user_role: UserRole
      booking_status: BookingStatus
      payment_status: PaymentStatus
      match_level: MatchLevel
      open_match_status: OpenMatchStatus
      product_category: ProductCategory
    }
  }
}

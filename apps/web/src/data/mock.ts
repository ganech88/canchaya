// Mock data para la web pública — reemplazar por queries a Supabase cuando esté linkeado.

import type { PlaceholderVariant } from '@canchaya/ui/web'

export interface MockVenueCard {
  id: string
  slug: string
  name: string
  city: string
  country: string
  distanceKm: number
  sports: string[] // codes
  rating: number
  reviewsCount: number
  priceFromCents: number
  priceCurrency: 'ARS' | 'MXN' | 'CLP' | 'UYU' | 'PEN' | 'USD'
  imgVariant: PlaceholderVariant
  amenities: string[]
  tag?: 'HOT' | 'NEW' | null
}

export const MOCK_VENUES: MockVenueCard[] = [
  {
    id: '1',
    slug: 'la-bombonerita',
    name: 'LA BOMBONERITA',
    city: 'Palermo',
    country: 'Argentina',
    distanceKm: 1.2,
    sports: ['futbol_5', 'futbol_8'],
    rating: 4.9,
    reviewsCount: 284,
    priceFromCents: 1800000,
    priceCurrency: 'ARS',
    imgVariant: 'field',
    amenities: ['parking', 'bar', 'showers'],
    tag: 'HOT',
  },
  {
    id: '2',
    slug: 'padel-club-sur',
    name: 'PÁDEL CLUB SUR',
    city: 'Caballito',
    country: 'Argentina',
    distanceKm: 2.4,
    sports: ['padel'],
    rating: 4.7,
    reviewsCount: 142,
    priceFromCents: 950000,
    priceCurrency: 'ARS',
    imgVariant: 'accent',
    amenities: ['parking', 'bar'],
    tag: null,
  },
  {
    id: '3',
    slug: 'el-potrero',
    name: 'EL POTRERO',
    city: 'Villa Crespo',
    country: 'Argentina',
    distanceKm: 0.8,
    sports: ['futbol_8', 'futbol_11'],
    rating: 4.8,
    reviewsCount: 398,
    priceFromCents: 2600000,
    priceCurrency: 'ARS',
    imgVariant: 'dark',
    amenities: ['parrilla', 'changing_rooms', 'parking'],
    tag: 'NEW',
  },
  {
    id: '4',
    slug: 'roja-court',
    name: 'ROJA COURT',
    city: 'Belgrano',
    country: 'Argentina',
    distanceKm: 3.1,
    sports: ['padel', 'tenis'],
    rating: 4.6,
    reviewsCount: 87,
    priceFromCents: 1100000,
    priceCurrency: 'ARS',
    imgVariant: 'field',
    amenities: ['parking', 'coaching'],
    tag: null,
  },
  {
    id: '5',
    slug: 'norte-arena',
    name: 'NORTE ARENA',
    city: 'San Isidro',
    country: 'Argentina',
    distanceKm: 8.5,
    sports: ['basquet', 'voley'],
    rating: 4.5,
    reviewsCount: 64,
    priceFromCents: 1500000,
    priceCurrency: 'ARS',
    imgVariant: 'accent',
    amenities: ['changing_rooms', 'showers', 'bar'],
    tag: null,
  },
  {
    id: '6',
    slug: 'club-san-fernando',
    name: 'CLUB SAN FERNANDO',
    city: 'Hurlingham',
    country: 'Argentina',
    distanceKm: 12.3,
    sports: ['padel', 'futbol_5'],
    rating: 4.4,
    reviewsCount: 52,
    priceFromCents: 1200000,
    priceCurrency: 'ARS',
    imgVariant: 'field',
    amenities: ['parking', 'parrilla'],
    tag: null,
  },
]

export const SPORTS_CATALOG = [
  { code: 'futbol', label: 'Fútbol', children: ['futbol_5', 'futbol_7', 'futbol_8', 'futbol_11'] },
  { code: 'padel', label: 'Pádel' },
  { code: 'tenis', label: 'Tenis' },
  { code: 'basquet', label: 'Básquet' },
  { code: 'voley', label: 'Vóley' },
] as const

export const CITIES = [
  { code: 'palermo', name: 'Palermo', country: 'AR' },
  { code: 'belgrano', name: 'Belgrano', country: 'AR' },
  { code: 'caballito', name: 'Caballito', country: 'AR' },
  { code: 'villa-crespo', name: 'Villa Crespo', country: 'AR' },
  { code: 'san-isidro', name: 'San Isidro', country: 'AR' },
  { code: 'hurlingham', name: 'Hurlingham', country: 'AR' },
  { code: 'la-plata', name: 'La Plata', country: 'AR' },
  { code: 'rosario', name: 'Rosario', country: 'AR' },
  { code: 'cordoba', name: 'Córdoba', country: 'AR' },
  { code: 'mendoza', name: 'Mendoza', country: 'AR' },
  { code: 'cdmx', name: 'CDMX', country: 'MX' },
  { code: 'santiago', name: 'Santiago', country: 'CL' },
  { code: 'montevideo', name: 'Montevideo', country: 'UY' },
  { code: 'lima', name: 'Lima', country: 'PE' },
  { code: 'bogota', name: 'Bogotá', country: 'CO' },
] as const

export const COUNTRIES = [
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
] as const

export function formatPriceFromCents(cents: number, currency: string): string {
  const value = cents / 100
  if (value >= 1000) {
    const k = value / 1000
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`
  }
  return `$${value}`
}

export function priceCurrencySymbol(currency: string): string {
  const map: Record<string, string> = {
    ARS: 'AR$',
    MXN: 'MX$',
    CLP: 'CL$',
    UYU: 'UY$',
    PEN: 'S/',
    USD: 'US$',
    COP: 'CO$',
    BRL: 'R$',
  }
  return map[currency] ?? currency
}

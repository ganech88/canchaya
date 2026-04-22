// Datos mock de canchas para desarrollo. Mismos datos que los mocks del handoff — cuando
// conectemos Supabase real, esto se reemplaza por queries a `courts` + `venues`.

import type { PlaceholderVariant } from '@canchaya/ui/native'

export interface MockCourt {
  id: number
  name: string
  zone: string
  type: string
  price: number
  rating: number
  reviews: number
  open: boolean
  tag: 'HOT' | 'NEW' | null
  color: PlaceholderVariant
}

export const MOCK_COURTS: MockCourt[] = [
  {
    id: 1,
    name: 'LA BOMBONERITA',
    zone: 'Palermo · 1.2km',
    type: 'Fútbol 5',
    price: 18000,
    rating: 4.9,
    reviews: 284,
    open: true,
    tag: 'HOT',
    color: 'field',
  },
  {
    id: 2,
    name: 'PÁDEL CLUB SUR',
    zone: 'Caballito · 2.4km',
    type: 'Pádel',
    price: 9500,
    rating: 4.7,
    reviews: 142,
    open: true,
    tag: null,
    color: 'accent',
  },
  {
    id: 3,
    name: 'EL POTRERO',
    zone: 'Villa Crespo · 0.8km',
    type: 'Fútbol 8',
    price: 26000,
    rating: 4.8,
    reviews: 398,
    open: false,
    tag: 'NEW',
    color: 'dark',
  },
  {
    id: 4,
    name: 'ROJA COURT',
    zone: 'Belgrano · 3.1km',
    type: 'Pádel',
    price: 11000,
    rating: 4.6,
    reviews: 87,
    open: true,
    tag: null,
    color: 'field',
  },
]

// Formatea 18000 → "$18K", 9500 → "$9.5K" — estilo editorial del mock.
export function formatPriceK(price: number): string {
  const k = price / 1000
  return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`
}

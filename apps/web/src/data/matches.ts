import type { MatchLevel } from '@canchaya/db'

export interface MockMatch {
  id: string
  venueName: string
  venueCity: string
  distanceKm: number
  sportCode: string
  sportLabel: string
  dateLabel: string // 'HOY 21:00'
  level: MatchLevel
  genderFilter: 'any' | 'm' | 'f'
  ageMin: number | null
  ageMax: number | null
  spotsFilled: number
  spotsTotal: number
  pricePerPlayerCents: number
  currency: 'ARS'
  host: { name: string; initials: string }
  description?: string
}

export const MOCK_MATCHES: MockMatch[] = [
  {
    id: '1',
    venueName: 'EL POTRERO',
    venueCity: 'Villa Crespo',
    distanceKm: 0.8,
    sportCode: 'futbol_5',
    sportLabel: 'F5',
    dateLabel: 'HOY 21:00',
    level: 'intermedio',
    genderFilter: 'any',
    ageMin: null,
    ageMax: null,
    spotsFilled: 8,
    spotsTotal: 10,
    pricePerPlayerCents: 260000,
    currency: 'ARS',
    host: { name: 'Martín B.', initials: 'MB' },
    description: 'Partido armado, nivel medio/alto. Llevamos pelota y pecheras.',
  },
  {
    id: '2',
    venueName: 'PÁDEL CLUB SUR',
    venueCity: 'Caballito',
    distanceKm: 2.4,
    sportCode: 'padel',
    sportLabel: 'Pádel',
    dateLabel: 'HOY 20:30',
    level: 'avanzado',
    genderFilter: 'f',
    ageMin: 25,
    ageMax: 40,
    spotsFilled: 3,
    spotsTotal: 4,
    pricePerPlayerCents: 240000,
    currency: 'ARS',
    host: { name: 'Laura G.', initials: 'LG' },
    description: 'Pádel competitivo. Mujeres, +25 años.',
  },
  {
    id: '3',
    venueName: 'NORTE ARENA',
    venueCity: 'San Isidro',
    distanceKm: 8.5,
    sportCode: 'basquet',
    sportLabel: 'Básquet',
    dateLabel: 'MAÑ 19:00',
    level: 'principiante',
    genderFilter: 'any',
    ageMin: 18,
    ageMax: null,
    spotsFilled: 5,
    spotsTotal: 10,
    pricePerPlayerCents: 150000,
    currency: 'ARS',
    host: { name: 'Carlos F.', initials: 'CF' },
    description: 'Pickup amistoso. Nivel relajado, todos bienvenidos.',
  },
  {
    id: '4',
    venueName: 'ROJA COURT',
    venueCity: 'Belgrano',
    distanceKm: 3.1,
    sportCode: 'tenis',
    sportLabel: 'Tenis',
    dateLabel: 'MAÑ 08:00',
    level: 'intermedio',
    genderFilter: 'm',
    ageMin: 30,
    ageMax: 50,
    spotsFilled: 3,
    spotsTotal: 4,
    pricePerPlayerCents: 280000,
    currency: 'ARS',
    host: { name: 'Juan P.', initials: 'JP' },
  },
  {
    id: '5',
    venueName: 'LA BOMBONERITA',
    venueCity: 'Palermo',
    distanceKm: 1.2,
    sportCode: 'futbol_8',
    sportLabel: 'F8',
    dateLabel: 'SÁB 20:00',
    level: 'intermedio',
    genderFilter: 'any',
    ageMin: null,
    ageMax: null,
    spotsFilled: 14,
    spotsTotal: 16,
    pricePerPlayerCents: 163000,
    currency: 'ARS',
    host: { name: 'Nico R.', initials: 'NR' },
    description: 'F8 dominical entre amigos. Cerveza después.',
  },
  {
    id: '6',
    venueName: 'CLUB SAN FERNANDO',
    venueCity: 'Hurlingham',
    distanceKm: 12.3,
    sportCode: 'voley',
    sportLabel: 'Vóley',
    dateLabel: 'DOM 11:00',
    level: 'principiante',
    genderFilter: 'any',
    ageMin: null,
    ageMax: null,
    spotsFilled: 9,
    spotsTotal: 12,
    pricePerPlayerCents: 120000,
    currency: 'ARS',
    host: { name: 'Sofía M.', initials: 'SM' },
  },
]

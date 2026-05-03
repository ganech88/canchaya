import { fetchOwnerCourts } from '@canchaya/db'
import { SettingsForm, type SettingsInitial } from '@/components/owner/SettingsForm'
import { getOwnerContext } from '@/lib/nhost/owner'

const FALLBACK: SettingsInitial = {
  venueName: 'La Bombonerita',
  city: 'Palermo',
  address: 'Av. Sarmiento 4320, Palermo',
  phone: '+54 11 5534 2211',
  email: 'reservas@bombonerita.com',
  description:
    'Complejo deportivo con 4 canchas F5, 1 cancha F8, y 2 canchas de pádel techadas. Bar completo y vestuarios.',
  sports: ['FÚTBOL 5', 'FÚTBOL 7/8', 'PÁDEL'],
  amenityCodes: ['changing_rooms', 'showers', 'bar', 'parking', 'wifi'],
}

const SPORT_LABEL: Record<string, string> = {
  futbol_5: 'FÚTBOL 5',
  futbol_7: 'FÚTBOL 7/8',
  futbol_8: 'FÚTBOL 7/8',
  futbol_11: 'FÚTBOL 11',
  padel: 'PÁDEL',
  tenis: 'TENIS',
  basquet: 'BÁSQUET',
}

async function loadSettings(): Promise<SettingsInitial> {
  const ctx = await getOwnerContext()
  if (!ctx) return FALLBACK
  try {
    const courts = await fetchOwnerCourts(ctx.client, ctx.selectedVenue.id, new Date())
    const sportsSet = new Set<string>()
    for (const c of courts) {
      const label = SPORT_LABEL[c.sport.code]
      if (label) sportsSet.add(label)
    }
    const v = ctx.selectedVenue
    return {
      venueName: v.name,
      city: v.city ?? '',
      address: v.address,
      phone: v.phone ?? '',
      email: 'system@canchaya.local',
      description: v.description ?? '',
      sports: Array.from(sportsSet),
      amenityCodes: v.amenities.map((a) => a.amenity.code),
    }
  } catch {
    return FALLBACK
  }
}

export default async function SettingsPage() {
  const initial = await loadSettings()
  return <SettingsForm initial={initial} />
}

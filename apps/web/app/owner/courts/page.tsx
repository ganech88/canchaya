import { fetchOwnerCourts } from '@canchaya/db'
import { Button } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import { CourtsTabs } from '@/components/owner/CourtsTabs'
import type { OwnerCourt } from '@/components/owner/CourtManageCard'
import { getOwnerContext } from '@/lib/nhost/owner'
import { courtsToManageRows } from '@/lib/owner-adapters'

const FALLBACK_COURTS: OwnerCourt[] = [
  { number: 1, name: 'C1 · Fútbol 5', surface: 'Sintético', covered: true, price: 18000, status: 'ACTIVA', occupancyPct: 92, imgVariant: 'field' },
  { number: 2, name: 'C2 · Fútbol 5', surface: 'Sintético', covered: true, price: 18000, status: 'ACTIVA', occupancyPct: 88, imgVariant: 'field' },
  { number: 3, name: 'C3 · Fútbol 5', surface: 'Sintético', covered: false, price: 16000, status: 'ACTIVA', occupancyPct: 74, imgVariant: 'field' },
  { number: 4, name: 'C4 · Fútbol 8', surface: 'Césped natural', covered: false, price: 26000, status: 'ACTIVA', occupancyPct: 68, imgVariant: 'field' },
  { number: 5, name: 'P1 · Pádel', surface: 'Cemento', covered: true, price: 9500, status: 'ACTIVA', occupancyPct: 84, imgVariant: 'dark' },
  { number: 6, name: 'P2 · Pádel', surface: 'Cemento', covered: true, price: 9500, status: 'MANTENIMIENTO', occupancyPct: 0, imgVariant: 'dark' },
]

async function loadCourts(): Promise<{ rows: OwnerCourt[]; venueName: string }> {
  const ctx = await getOwnerContext()
  if (!ctx) return { rows: FALLBACK_COURTS, venueName: 'La Bombonerita' }
  try {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const courts = await fetchOwnerCourts(ctx.client, ctx.selectedVenue.id, weekStart)
    if (courts.length === 0) return { rows: FALLBACK_COURTS, venueName: ctx.selectedVenue.name }
    return { rows: courtsToManageRows(courts), venueName: ctx.selectedVenue.name }
  } catch {
    return { rows: FALLBACK_COURTS, venueName: ctx.selectedVenue.name }
  }
}

export default async function CourtsPage() {
  const { rows, venueName } = await loadCourts()

  return (
    <>
      <OwnerHeader
        eyebrow={`INVENTARIO · ${rows.length} CANCHA${rows.length === 1 ? '' : 'S'} · ${venueName.toUpperCase()}`}
        title="CANCHAS."
        right={
          <Button
            variant="accent"
            leftIcon={<Icon name="plus" size={12} />}
            className="!px-3.5 !py-2.5 !text-[12px]"
          >
            Agregar cancha
          </Button>
        }
      />

      <CourtsTabs courts={rows} />
    </>
  )
}

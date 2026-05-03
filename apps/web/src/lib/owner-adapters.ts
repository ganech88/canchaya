// Adapters: tipos GraphQL del owner → shapes que esperan los componentes del dashboard.
// Computa también métricas derivadas (ocupación, agregados) que no vienen del schema.

import type {
  OwnerBookingRow,
  OwnerCourtRow,
  OwnerSaleRow,
  OwnerVenueSummary,
} from '@canchaya/db'
import type { Kpi } from '@/components/owner/KpiGrid'
import type { TimelineRow, TimelineStatus } from '@/components/owner/TodayTimeline'
import type { LiveCourt } from '@/components/owner/LiveCourts'
import type { CalendarBooking } from '@/components/owner/CalendarGrid'
import type { OwnerCourt } from '@/components/owner/CourtManageCard'

// ── Helpers de formato ──────────────────────────────────────────────────────
function formatARS(cents: number): string {
  const ars = Math.round(cents / 100)
  if (ars >= 1_000_000) return `$${(ars / 1_000_000).toFixed(1)}M`
  if (ars >= 1_000) return `$${Math.round(ars / 1_000)}K`
  return `$${ars}`
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function durationLabel(starts: string, ends: string): string {
  const ms = new Date(ends).getTime() - new Date(starts).getTime()
  const minutes = Math.round(ms / 60_000)
  if (minutes % 60 === 0) return `${minutes / 60}h`
  return `${(minutes / 60).toFixed(1)}h`
}

function bookingStatusLabel(b: OwnerBookingRow): TimelineStatus {
  if (b.status === 'cancelled') return 'CANCELADA'
  if (b.payment_status === 'paid') return 'PAGADA'
  if (b.deposit_cents > 0 && b.balance_cents > 0) return 'SEÑADO'
  if (b.open_match) {
    const remaining = b.open_match.spots_total - b.open_match.spots_filled
    if (remaining > 0) return remaining === 1 ? 'FALTAN 2' : 'FALTAN 2'
  }
  return 'CONFIRMADA'
}

function courtShortLabel(courtName: string, sportCode: string): string {
  // El mock usa "F5 · C1". Tratamos de derivar algo similar de "C1 · Fútbol 5"
  // sin parsear nombres reales heterogéneos: si el name ya contiene "·", lo
  // dejamos. Si no, antepones código de sport.
  if (courtName.includes('·')) return courtName.toUpperCase()
  const sportShort: Record<string, string> = {
    futbol_5: 'F5',
    futbol_7: 'F7',
    futbol_8: 'F8',
    futbol_11: 'F11',
    padel: 'PÁDEL',
    tenis: 'TENIS',
    basquet: 'BÁSQ.',
    voley: 'VÓLEY',
  }
  return `${sportShort[sportCode] ?? sportCode.toUpperCase()} · ${courtName}`
}

// ── Today timeline ──────────────────────────────────────────────────────────
export function bookingsToTimeline(bookings: OwnerBookingRow[]): TimelineRow[] {
  return bookings.map((b) => ({
    time: formatTime(b.starts_at),
    duration: durationLabel(b.starts_at, b.ends_at),
    court: courtShortLabel(b.court.name, b.court.sport.code),
    who: b.host.name,
    people: `${b.party_size} pers.`,
    status: bookingStatusLabel(b),
  }))
}

// ── Live courts ─────────────────────────────────────────────────────────────
export function courtsToLive(
  courts: OwnerCourtRow[],
  todayBookings: OwnerBookingRow[],
  now: Date = new Date(),
): LiveCourt[] {
  const byCourt = new Map<string, OwnerBookingRow[]>()
  for (const b of todayBookings) {
    const arr = byCourt.get(b.court.id) ?? []
    arr.push(b)
    byCourt.set(b.court.id, arr)
  }

  return courts.map((c) => {
    const inactiveStatus: LiveCourt['status'] = c.active ? 'LIBRE' : 'MANTENIMIENTO'
    const courtBookings = (byCourt.get(c.id) ?? []).sort(
      (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
    )
    const live = courtBookings.find((b) => {
      const starts = new Date(b.starts_at).getTime()
      const ends = new Date(b.ends_at).getTime()
      return starts <= now.getTime() && ends > now.getTime()
    })
    if (live) {
      const starts = new Date(live.starts_at).getTime()
      const ends = new Date(live.ends_at).getTime()
      const pct = Math.min(100, Math.max(0, ((now.getTime() - starts) / (ends - starts)) * 100))
      return {
        label: courtShortLabel(c.name, c.sport.code),
        status: 'EN JUEGO',
        who: live.host.name,
        time: `${formatTime(live.starts_at)} – ${formatTime(live.ends_at)}`,
        pct: Math.round(pct),
      }
    }
    const next = courtBookings.find((b) => new Date(b.starts_at).getTime() > now.getTime())
    return {
      label: courtShortLabel(c.name, c.sport.code),
      status: inactiveStatus,
      who: next ? `— próximo ${formatTime(next.starts_at)}` : '— sin reservas hoy',
      time: '—',
      pct: 0,
    }
  })
}

// ── KPIs ────────────────────────────────────────────────────────────────────
interface KpiInput {
  todayBookings: OwnerBookingRow[]
  weekBookings: OwnerBookingRow[]
  prevWeekBookings: OwnerBookingRow[]
  courtsCount: number
  todaySalesCents: number
}

function deltaPct(curr: number, prev: number): string {
  if (prev === 0) return curr > 0 ? '+100%' : ''
  const pct = Math.round(((curr - prev) / prev) * 100)
  if (pct === 0) return '—'
  return `${pct > 0 ? '+' : ''}${pct}%`
}

export function buildKpis({
  todayBookings,
  weekBookings,
  prevWeekBookings,
  courtsCount,
  todaySalesCents,
}: KpiInput): Kpi[] {
  const todayCount = todayBookings.length
  const todayRevenueCents = todayBookings.reduce((acc, b) => acc + b.total_cents, 0) + todaySalesCents
  const prevDayCount = Math.round(prevWeekBookings.length / 7)

  // Ocupación = horas reservadas / horas operables (12h por cancha por día → 84h/sem por cancha)
  const operableHours = courtsCount * 12 * 7
  const reservedHours = weekBookings.reduce((acc, b) => {
    const ms = new Date(b.ends_at).getTime() - new Date(b.starts_at).getTime()
    return acc + ms / 3_600_000
  }, 0)
  const occupancyPct = operableHours > 0 ? Math.round((reservedHours / operableHours) * 100) : 0

  // Clientes únicos esta semana
  const clients = new Set(weekBookings.map((b) => b.host.id))

  return [
    {
      key: 'Reservas hoy',
      value: String(todayCount),
      delta: deltaPct(todayCount, prevDayCount),
      sub: todayBookings.length > 0
        ? Object.entries(
            todayBookings.reduce<Record<string, number>>((acc, b) => {
              acc[b.court.sport.code] = (acc[b.court.sport.code] ?? 0) + 1
              return acc
            }, {}),
          )
            .slice(0, 3)
            .map(([code, n]) => `${n} ${code}`)
            .join(' · ')
        : 'sin reservas hoy',
    },
    {
      key: 'Ingresos hoy',
      value: formatARS(todayRevenueCents),
      delta: '',
      sub: 'reservas + bar',
      accent: true,
    },
    {
      key: 'Ocupación',
      value: `${occupancyPct}%`,
      delta: '',
      sub: `${courtsCount} cancha${courtsCount === 1 ? '' : 's'} · 7 días`,
    },
    {
      key: 'Clientes',
      value: String(clients.size),
      delta: '',
      sub: 'únicos esta semana',
    },
  ]
}

// ── Calendar grid ───────────────────────────────────────────────────────────
function calendarColor(b: OwnerBookingRow): CalendarBooking['color'] {
  if (b.payment_status === 'paid') return 'accent'
  if (b.open_match) return 'accent'
  if (b.party_size >= 12) return 'red'
  return 'ink'
}

export function bookingsToCalendar(
  bookings: OwnerBookingRow[],
  weekStart: Date,
): CalendarBooking[] {
  const startMs = weekStart.getTime()
  const dayMs = 24 * 60 * 60 * 1000
  return bookings
    .filter((b) => {
      const t = new Date(b.starts_at).getTime()
      return t >= startMs && t < startMs + 7 * dayMs
    })
    .map((b) => {
      const start = new Date(b.starts_at)
      const end = new Date(b.ends_at)
      const day = Math.floor((start.getTime() - startMs) / dayMs)
      const startHour = start.getHours() + start.getMinutes() / 60
      const endHour = end.getHours() + end.getMinutes() / 60
      // Court chip: extraer la primera "palabra" del nombre (e.g. "C1 · F5" → "C1")
      const courtChip = b.court.name.split(/\s|·/)[0] ?? b.court.name
      return {
        day,
        startHour,
        endHour,
        court: courtChip,
        who: b.host.name.split(' ')[0] ?? b.host.name,
        color: calendarColor(b),
      }
    })
}

// ── Courts page ─────────────────────────────────────────────────────────────
const PLACEHOLDER_VARIANTS: OwnerCourt['imgVariant'][] = ['field', 'accent', 'dark']

function pickVariant(seed: string): OwnerCourt['imgVariant'] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return PLACEHOLDER_VARIANTS[Math.abs(h) % PLACEHOLDER_VARIANTS.length]!
}

export function courtsToManageRows(courts: OwnerCourtRow[]): OwnerCourt[] {
  // Ocupación = bookings esta semana vs slots operables (12 slots por día × 7 días = 84)
  const SLOTS_PER_WEEK = 84
  return courts.map((c, i) => {
    const occ = Math.min(
      100,
      Math.round((c.bookings_aggregate.aggregate.count / SLOTS_PER_WEEK) * 100),
    )
    return {
      number: i + 1,
      name: courtShortLabel(c.name, c.sport.code),
      surface: c.surface ?? '—',
      covered: c.covered,
      price: Math.round(c.base_price_cents / 100),
      status: c.active ? 'ACTIVA' : 'MANTENIMIENTO',
      occupancyPct: occ,
      imgVariant: pickVariant(c.id),
    }
  })
}

// ── Sales aggregates (drinks page) ──────────────────────────────────────────
export interface SalesAggregate {
  totalCents: number
  units: number
  ticketAvgCents: number
  daysCovered: number
}

export function aggregateSales(sales: OwnerSaleRow[]): SalesAggregate {
  const totalCents = sales.reduce((acc, s) => acc + s.total_cents, 0)
  const units = sales.reduce(
    (acc, s) => acc + s.items.reduce((a, it) => a + it.qty, 0),
    0,
  )
  const ticketAvgCents = sales.length > 0 ? Math.round(totalCents / sales.length) : 0
  const days = new Set(sales.map((s) => s.paid_at.slice(0, 10))).size
  return { totalCents, units, ticketAvgCents, daysCovered: days }
}

// ── Venue → settings page ───────────────────────────────────────────────────
export interface VenueSettingsView {
  name: string
  city: string
  address: string
  phone: string
  description: string
  rating: number
  ratingCount: number
  amenityIds: number[]
}

export function venueToSettings(v: OwnerVenueSummary): VenueSettingsView {
  return {
    name: v.name,
    city: v.city ?? '',
    address: v.address,
    phone: v.phone ?? '',
    description: v.description ?? '',
    rating: v.rating_stars,
    ratingCount: v.rating_count,
    amenityIds: v.amenities.map((a) => a.amenity.id),
  }
}

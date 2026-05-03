import { fetchOwnerBookingsRange } from '@canchaya/db'
import { CalendarView } from '@/components/owner/CalendarView'
import type { CalendarBooking } from '@/components/owner/CalendarGrid'
import { getOwnerContext } from '@/lib/nhost/owner'
import { bookingsToCalendar } from '@/lib/owner-adapters'

const FALLBACK_BOOKINGS: CalendarBooking[] = [
  { day: 0, startHour: 19, endHour: 20, court: 'C1', who: 'Martín B.', color: 'ink' },
  { day: 0, startHour: 19, endHour: 20, court: 'C2', who: 'Emp. XYZ', color: 'accent' },
  { day: 0, startHour: 20, endHour: 21.5, court: 'P1', who: 'Laura/Nico', color: 'ink' },
  { day: 0, startHour: 21, endHour: 22, court: 'C4', who: 'Veteranos', color: 'red' },
  { day: 1, startHour: 18, endHour: 19, court: 'C1', who: 'Pablo', color: 'ink' },
  { day: 1, startHour: 20, endHour: 21, court: 'C2', who: 'Abierto', color: 'accent' },
  { day: 2, startHour: 17, endHour: 18, court: 'P1', who: 'Ana', color: 'ink' },
  { day: 2, startHour: 20, endHour: 21, court: 'C1', who: 'Juan', color: 'ink' },
  { day: 3, startHour: 19, endHour: 20, court: 'C3', who: 'Abierto', color: 'accent' },
  { day: 3, startHour: 21, endHour: 22, court: 'C4', who: 'Veteranos', color: 'red' },
  { day: 4, startHour: 18, endHour: 20, court: 'C1', who: 'Torneo', color: 'red' },
  { day: 4, startHour: 20, endHour: 21, court: 'P1', who: 'Nico', color: 'ink' },
  { day: 4, startHour: 21, endHour: 22, court: 'C2', who: 'Privada', color: 'ink' },
  { day: 5, startHour: 15, endHour: 17, court: 'C1', who: 'Cumpleaños', color: 'accent' },
  { day: 5, startHour: 17, endHour: 18, court: 'P1', who: 'Clases', color: 'ink' },
  { day: 5, startHour: 20, endHour: 22, court: 'C3', who: 'Torneo F5', color: 'red' },
  { day: 6, startHour: 16, endHour: 17, court: 'C2', who: 'Familiar', color: 'ink' },
  { day: 6, startHour: 19, endHour: 20, court: 'P1', who: 'Recurrente', color: 'ink' },
]

const DAY_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function buildWeekDays(weekStart: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return `${DAY_LABELS[i]} ${d.getDate()}`
  })
}

function weekLabel(weekStart: Date): string {
  const end = new Date(weekStart)
  end.setDate(weekStart.getDate() + 6)
  const m1 = MONTHS[weekStart.getMonth()]!
  const m2 = MONTHS[end.getMonth()]!
  if (m1 === m2) {
    return `SEMANA · ${weekStart.getDate()}—${end.getDate()} ${m1} ${end.getFullYear()}`
  }
  return `SEMANA · ${weekStart.getDate()} ${m1} — ${end.getDate()} ${m2} ${end.getFullYear()}`
}

interface FooterStats {
  bookings: number
  revenueLabel: string
  occupancyPct: number
  freeHours: number
}

function formatRevenue(cents: number): string {
  const ars = Math.round(cents / 100)
  if (ars >= 1_000_000) return `$${(ars / 1_000_000).toFixed(1)}M`
  if (ars >= 1_000) return `$${Math.round(ars / 1_000)}K`
  return `$${ars}`
}

export default async function CalendarPage() {
  const today = new Date()
  // Lunes de esta semana (ISO: lunes = 1)
  const weekStart = new Date(today)
  const dow = weekStart.getDay() // 0=Sun..6=Sat
  const offset = dow === 0 ? -6 : 1 - dow
  weekStart.setDate(weekStart.getDate() + offset)
  weekStart.setHours(0, 0, 0, 0)

  const days = buildWeekDays(weekStart)
  const todayIndex = Math.floor((today.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000))

  let bookings: CalendarBooking[] = FALLBACK_BOOKINGS
  let footer: FooterStats = {
    bookings: 148,
    revenueLabel: '$2.4M',
    occupancyPct: 78,
    freeHours: 22,
  }

  const ctx = await getOwnerContext()
  if (ctx) {
    try {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      const rows = await fetchOwnerBookingsRange(ctx.client, ctx.selectedVenue.id, weekStart, weekEnd)
      const calBookings = bookingsToCalendar(rows, weekStart)
      if (calBookings.length > 0) {
        bookings = calBookings
        const totalCents = rows.reduce((acc, b) => acc + b.total_cents, 0)
        const reservedHours = rows.reduce(
          (acc, b) =>
            acc + (new Date(b.ends_at).getTime() - new Date(b.starts_at).getTime()) / 3_600_000,
          0,
        )
        const courtsCount = ctx.selectedVenue.courts_aggregate.aggregate.count || 1
        const operableHours = courtsCount * 12 * 7
        footer = {
          bookings: rows.length,
          revenueLabel: formatRevenue(totalCents),
          occupancyPct: Math.round((reservedHours / operableHours) * 100),
          freeHours: Math.max(0, Math.round(operableHours - reservedHours)),
        }
      }
    } catch {
      /* fallback */
    }
  }

  return (
    <CalendarView
      weekLabel={weekLabel(weekStart)}
      days={days}
      bookings={bookings}
      todayIndex={Math.max(0, Math.min(6, todayIndex))}
      footer={footer}
    />
  )
}

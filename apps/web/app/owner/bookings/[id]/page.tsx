import { notFound } from 'next/navigation'
import { Button, Chip, Placeholder } from '@canchaya/ui/web'
import { fetchOwnerBookingById } from '@canchaya/db'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import { SectionTitle } from '@/components/owner/SectionTitle'
import { BookingStatsStrip } from '@/components/owner/BookingStatsStrip'
import { EconomicBreakdown } from '@/components/owner/EconomicBreakdown'
import { EventsTimeline } from '@/components/owner/EventsTimeline'
import { getOwnerContext } from '@/lib/nhost/owner'

interface PageProps {
  params: Promise<{ id: string }>
}

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const DAY_NAMES = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']

function formatARS(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString('es-AR')}`
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

function dateLabel(iso: string): string {
  const d = new Date(iso)
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

function statusChip(status: string, paymentStatus: string): string {
  if (status === 'cancelled') return 'CANCELADA'
  if (paymentStatus === 'paid') return 'PAGADA'
  if (status === 'confirmed') return 'CONFIRMADA'
  if (status === 'done') return 'FINALIZADA'
  return status.toUpperCase()
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface FallbackBooking {
  id: string
  startsAt: string
  endsAt: string
  totalCents: number
  depositCents: number
  partySize: number
  hostName: string
  hostInitials: string
  hostStatsMatches: number
  courtName: string
  notes: string | null
  status: string
  paymentStatus: string
  events: Array<{ date: string; text: string }>
}

const FALLBACK: FallbackBooking = {
  id: '00001',
  startsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  totalCents: 4140000,
  depositCents: 2070000,
  partySize: 16,
  hostName: 'Ramón G.',
  hostInitials: 'RG',
  hostStatsMatches: 68,
  courtName: 'C4 · F8',
  notes: 'Prefieren la C4 siempre. Llevan su propio árbitro. Piden que prendamos el reflector del lado norte.',
  status: 'confirmed',
  paymentStatus: 'paid',
  events: [
    { date: 'AHORA', text: 'Turno próximo a comenzar' },
    { date: 'AYER · 18:30', text: 'Pago recibido · Mercado Pago' },
    { date: '24 MAR · 11:40', text: 'Reserva creada' },
  ],
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params

  let view: FallbackBooking = FALLBACK
  let realFound = false

  // Probar como UUID — si no, mostrar fallback con id paddeado
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  const ctx = isUuid ? await getOwnerContext() : null
  if (ctx && isUuid) {
    try {
      const b = await fetchOwnerBookingById(ctx.client, id)
      if (b) {
        const events: Array<{ date: string; text: string }> = []
        if (b.cancelled_at) {
          events.push({
            date: new Date(b.cancelled_at)
              .toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
              .toUpperCase(),
            text: `Cancelada${b.cancelled_reason ? ` · ${b.cancelled_reason}` : ''}`,
          })
        }
        if (b.payment_status === 'paid') {
          events.push({
            date: '—',
            text: `Pago recibido · ${formatARS(b.total_cents)} · Mercado Pago`,
          })
        }
        events.push({
          date: new Date(b.created_at)
            .toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
            .toUpperCase(),
          text: `Reserva creada por ${b.host.name}`,
        })

        view = {
          id: b.id.slice(0, 8).toUpperCase(),
          startsAt: b.starts_at,
          endsAt: b.ends_at,
          totalCents: b.total_cents,
          depositCents: b.deposit_cents,
          partySize: b.party_size,
          hostName: b.host.name,
          hostInitials: initials(b.host.name),
          hostStatsMatches: b.host.stats_matches,
          courtName: b.court.name,
          notes: b.notes,
          status: b.status,
          paymentStatus: b.payment_status,
          events,
        }
        realFound = true
      }
    } catch {
      /* fallback */
    }
  }

  if (isUuid && ctx && !realFound) {
    notFound()
  }

  const balanceCents = view.totalCents - view.depositCents

  return (
    <>
      <OwnerHeader
        eyebrow={`RESERVA · N°${view.id}`}
        title={
          <>
            {view.hostName.split(' ').slice(0, 2).join(' ').toUpperCase()}
            <br />
            {view.courtName.toUpperCase()}
          </>
        }
        right={
          <div className="flex gap-2">
            <Button variant="ghost" className="!px-3.5 !py-2.5 !text-[12px]">
              Cancelar
            </Button>
            <Button variant="accent" className="!px-3.5 !py-2.5 !text-[12px]">
              Marcar como finalizada
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 p-7" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div>
          <BookingStatsStrip
            section={`TURNO · ${dateLabel(view.startsAt)}`}
            status={statusChip(view.status, view.paymentStatus)}
            stats={[
              { key: 'Hora', value: formatTime(view.startsAt) },
              { key: 'Duración', value: durationLabel(view.startsAt, view.endsAt) },
              { key: 'Cancha', value: view.courtName },
              { key: 'Personas', value: String(view.partySize) },
            ]}
          />

          <div className="mt-5">
            <EconomicBreakdown
              lines={[
                { label: `Cancha · ${durationLabel(view.startsAt, view.endsAt)}`, amount: formatARS(view.totalCents) },
                { label: 'Seña pagada', amount: formatARS(view.depositCents) },
                { label: 'Saldo en cancha', amount: formatARS(balanceCents) },
              ]}
              totalAmount={formatARS(view.totalCents)}
            />
          </div>

          <div className="mt-5">
            <SectionTitle eyebrow="HISTORIAL" title="Eventos" />
            <EventsTimeline events={view.events} />
          </div>
        </div>

        <aside className="flex flex-col gap-[18px]">
          <div className="border-card border-cy-line bg-cy-paper p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-muted">
              Titular
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Placeholder variant="accent" className="h-[52px] w-[52px]" label={view.hostInitials} />
              <div>
                <p className="font-display text-[18px] leading-[16px] tracking-tight text-cy-ink">
                  {view.hostName.toUpperCase()}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-cy-muted">— sin teléfono</p>
              </div>
            </div>
            <div className="my-3 h-[2px] bg-cy-line" />
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">
                  Reservas
                </p>
                <p className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
                  {view.hostStatsMatches}
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">
                  Total reserva
                </p>
                <p className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
                  {formatARS(view.totalCents)}
                </p>
              </div>
            </div>
            <div className="mt-2.5">
              <Chip variant="fill">{view.hostStatsMatches > 30 ? 'VIP · RECURRENTE' : 'CLIENTE'}</Chip>
            </div>
          </div>

          {view.notes && (
            <div className="border-card border-cy-line bg-cy-accent p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-ink">
                § NOTA INTERNA
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.4] text-cy-ink">{view.notes}</p>
            </div>
          )}

          <div className="border-card border-cy-line bg-cy-paper p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-muted">
              PARTICIPANTES · {view.partySize}
            </p>
            <div className="mt-2 grid grid-cols-8 gap-1">
              {Array.from({ length: view.partySize }).map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center border-chip border-cy-line bg-cy-sand font-mono text-[10px] text-cy-ink"
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

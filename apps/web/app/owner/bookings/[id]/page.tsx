import { Button, Chip, Placeholder } from '@canchaya/ui/web'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import { SectionTitle } from '@/components/owner/SectionTitle'
import { BookingStatsStrip } from '@/components/owner/BookingStatsStrip'
import { EconomicBreakdown } from '@/components/owner/EconomicBreakdown'
import { EventsTimeline } from '@/components/owner/EventsTimeline'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params
  const paddedId = id.padStart(5, '0')

  return (
    <>
      <OwnerHeader
        eyebrow={`RESERVA · N°${paddedId}`}
        title={
          <>
            LOS VETE-
            <br />
            RANOS F8
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
        {/* Left column */}
        <div>
          <BookingStatsStrip
            section="TURNO · SÁBADO 27 MAR"
            status="PAGADA"
            stats={[
              { key: 'Hora', value: '21:00' },
              { key: 'Duración', value: '1h' },
              { key: 'Cancha', value: 'C4 · F8' },
              { key: 'Personas', value: '16' },
            ]}
          />

          <div className="mt-5">
            <EconomicBreakdown
              lines={[
                { label: 'Cancha F8 · 1 h', amount: '$26.000' },
                { label: 'Pelotas (x2)', amount: '$1.600' },
                { label: 'Bebidas (barra)', amount: '$18.400' },
                { label: 'Descuento recurrente (-10%)', amount: '-$4.600' },
              ]}
              totalAmount="$41.400"
            />
          </div>

          <div className="mt-5">
            <SectionTitle eyebrow="HISTORIAL" title="Eventos" />
            <EventsTimeline
              events={[
                { date: '27 MAR · 22:02', text: 'Turno finalizado' },
                { date: '27 MAR · 21:05', text: 'Check-in confirmado (16 personas)' },
                { date: '27 MAR · 18:30', text: 'Pago recibido · $41.400 · Mercado Pago' },
                { date: '24 MAR · 11:40', text: 'Reserva creada por Ramón G.' },
              ]}
            />
          </div>
        </div>

        {/* Right column */}
        <aside className="flex flex-col gap-[18px]">
          {/* Titular */}
          <div className="border-card border-cy-line bg-cy-paper p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-muted">
              Titular
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Placeholder variant="accent" className="h-[52px] w-[52px]" label="RG" />
              <div>
                <p className="font-display text-[18px] leading-[16px] tracking-tight text-cy-ink">
                  RAMÓN G.
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-cy-muted">+54 11 5534 2211</p>
              </div>
            </div>
            <div className="my-3 h-[2px] bg-cy-line" />
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">
                  Reservas
                </p>
                <p className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
                  68
                </p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">
                  Gastado
                </p>
                <p className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
                  $2.8M
                </p>
              </div>
            </div>
            <div className="mt-2.5">
              <Chip variant="fill">VIP · RECURRENTE</Chip>
            </div>
          </div>

          {/* Internal note */}
          <div className="border-card border-cy-line bg-cy-accent p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-ink">
              § NOTA INTERNA
            </p>
            <p className="mt-1.5 text-[13px] leading-[1.4] text-cy-ink">
              Prefieren la C4 siempre. Llevan su propio árbitro. Piden que prendamos el reflector
              del lado norte.
            </p>
          </div>

          {/* Participants */}
          <div className="border-card border-cy-line bg-cy-paper p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-muted">
              PARTICIPANTES · 16
            </p>
            <div className="mt-2 grid grid-cols-8 gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
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

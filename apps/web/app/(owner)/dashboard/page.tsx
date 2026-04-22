import Link from 'next/link'
import { Button } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import { SectionTitle } from '@/components/owner/SectionTitle'
import { KpiGrid, type Kpi } from '@/components/owner/KpiGrid'
import { TodayTimeline, type TimelineRow } from '@/components/owner/TodayTimeline'
import { LiveCourts, type LiveCourt } from '@/components/owner/LiveCourts'
import { AlertCard } from '@/components/owner/AlertCard'
import { DrinksRanking, type DrinkRow } from '@/components/owner/DrinksRanking'
import { RevenueChart } from '@/components/owner/RevenueChart'

const KPIS: Kpi[] = [
  { key: 'Reservas hoy', value: '24', delta: '+18%', sub: '17 F5 · 5 Pádel · 2 F8' },
  { key: 'Ingresos hoy', value: '$438K', delta: '+24%', sub: '$310K canchas · $128K bar', accent: true },
  { key: 'Ocupación', value: '82%', delta: '+6pts', sub: '4 canchas · 14h activas' },
  { key: 'Clientes', value: '186', delta: '+32', sub: '48 nuevos este mes' },
]

const TIMELINE: TimelineRow[] = [
  { time: '19:00', duration: '1h', court: 'F5 · C1', who: 'Martín B.', people: '10 pers.', status: 'CONFIRMADA' },
  { time: '19:00', duration: '1h', court: 'F5 · C2', who: 'Empresa XYZ', people: '10 pers.', status: 'PAGADA' },
  { time: '20:00', duration: '1.5h', court: 'PÁDEL · P1', who: 'Laura / Nico', people: '4 pers.', status: 'CONFIRMADA' },
  { time: '20:30', duration: '1h', court: 'F5 · C3', who: 'Abierto #124', people: '8/10', status: 'FALTAN 2' },
  { time: '21:00', duration: '1h', court: 'F8 · C4', who: 'Los Veteranos', people: '16 pers.', status: 'RECURRENTE' },
  { time: '22:00', duration: '1h', court: 'F5 · C1', who: 'Reserva app', people: '10 pers.', status: 'SEÑADO' },
]

const LIVE: LiveCourt[] = [
  { label: 'C1 · F5', status: 'EN JUEGO', who: 'Los Muchachos', time: '19:00 – 20:00', pct: 68 },
  { label: 'C2 · F5', status: 'EN JUEGO', who: 'Empresa XYZ', time: '19:00 – 20:00', pct: 68 },
  { label: 'C3 · F5', status: 'LIBRE', who: '— próximo 20:30', time: '—', pct: 0 },
  { label: 'P1 · Pádel', status: 'LIBRE', who: '— próximo 20:00', time: '—', pct: 0 },
]

const DRINKS: DrinkRow[] = [
  { rank: 1, name: 'Cerveza Quilmes 1L', units: 284, revenue: '$340K' },
  { rank: 2, name: 'Gatorade Naranja 500ml', units: 211, revenue: '$148K' },
  { rank: 3, name: 'Coca-Cola 500ml', units: 198, revenue: '$118K' },
  { rank: 4, name: 'Agua Mineral 500ml', units: 176, revenue: '$88K' },
  { rank: 5, name: 'Powerade Azul 500ml', units: 142, revenue: '$98K' },
]

const REVENUE_30D = [
  42, 58, 51, 72, 64, 80, 92, 68, 77, 85, 90, 63, 74, 88, 95, 82, 70, 91, 98, 86, 73, 90, 102, 88,
  79, 95, 110, 94, 88, 100,
]

export default function DashboardPage() {
  return (
    <>
      <OwnerHeader
        eyebrow="VISTA GENERAL · HOY · MAR 22"
        title={
          <>
            BUENOS DÍAS,
            <br />
            DIEGO.
          </>
        }
        right={
          <div className="flex gap-2">
            <Button variant="ghost" className="!px-3.5 !py-2.5 !text-[12px]">
              Exportar
            </Button>
            <Button
              variant="accent"
              leftIcon={<Icon name="plus" size={12} />}
              className="!px-3.5 !py-2.5 !text-[12px]"
            >
              Bloquear turno
            </Button>
          </div>
        }
      />

      <KpiGrid kpis={KPIS} />

      {/* Timeline + live col */}
      <div className="grid border-b-card border-cy-line" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <section className="border-r-card border-cy-line p-7">
          <SectionTitle
            eyebrow="AGENDA DEL DÍA"
            title="Próximos turnos"
            right={
              <Link
                href="/calendar"
                className="font-mono text-[10px] uppercase text-cy-ink hover:text-cy-red"
              >
                Ver calendario →
              </Link>
            }
          />
          <TodayTimeline rows={TIMELINE} />
        </section>

        <aside className="flex flex-col gap-5 p-7">
          <div>
            <SectionTitle eyebrow="AHORA MISMO · 19:42" title="Canchas en vivo" />
            <LiveCourts courts={LIVE} />
          </div>

          <div>
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
              § ALERTAS
            </p>
            <div className="flex flex-col gap-2">
              <AlertCard tag="⚡ Stock bajo" variant="accent">
                Gatorade Naranja · quedan 8 unidades
              </AlertCard>
              <AlertCard tag="📅 Recurrencia">
                Los Veteranos renovaron trimestre · $312K cobrados
              </AlertCard>
            </div>
          </div>
        </aside>
      </div>

      {/* Drinks + Revenue */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <section className="border-r-card border-cy-line p-7">
          <SectionTitle eyebrow="RANKING DEL MES" title="Bebidas más vendidas" />
          <DrinksRanking rows={DRINKS} maxUnits={284} />
        </section>

        <section className="p-7">
          <p className="mb-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § INGRESOS · 30 DÍAS
          </p>
          <div className="flex items-baseline justify-between">
            <span className="font-condensed text-[26px] uppercase text-cy-ink">$8.4M</span>
            <span className="font-mono text-[11px] font-bold text-cy-ink">
              +22% vs mes anterior
            </span>
          </div>
          <div className="mt-1 h-1 bg-cy-line" />
          <div className="mt-3">
            <RevenueChart values={REVENUE_30D} highlightLastN={8} />
            <div className="mt-1 flex justify-between">
              <span className="font-mono text-[9px] text-cy-muted">FEB 22</span>
              <span className="font-mono text-[9px] text-cy-muted">HOY</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              { k: 'Canchas', v: '$6.1M' },
              { k: 'Bar', v: '$1.8M' },
              { k: 'Extras', v: '$0.5M' },
            ].map((x) => (
              <div key={x.k} className="border-chip border-cy-line p-2.5">
                <p className="font-mono text-[9px] text-cy-muted">{x.k}</p>
                <p className="mt-0.5 font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
                  {x.v}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

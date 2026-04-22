import { Button } from '@canchaya/ui/web'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import { SectionTitle } from '@/components/owner/SectionTitle'
import { KpiGrid, type Kpi } from '@/components/owner/KpiGrid'
import { DrinkRankingFull, type FullDrinkRow } from '@/components/owner/DrinkRankingFull'
import { MixSegmentedBar, type MixSegment } from '@/components/owner/MixSegmentedBar'
import { ConsumptionHeatmap } from '@/components/owner/ConsumptionHeatmap'

const KPIS: Kpi[] = [
  { key: 'Ingreso barra', value: '$1.8M', delta: '', sub: '22% del total', accent: true },
  { key: 'Unidades', value: '2.847', delta: '', sub: '94/día promedio' },
  { key: 'Ticket prom.', value: '$4.2K', delta: '', sub: '2.3 items por reserva' },
  { key: 'Margen bruto', value: '62%', delta: '', sub: '+4 pts vs feb' },
]

const TOP_DRINKS: FullDrinkRow[] = [
  { rank: 1, name: 'Cerveza Quilmes 1L', units: 284, revenueK: 340, category: 'Cerveza', trend: '+28%' },
  { rank: 2, name: 'Gatorade Naranja 500ml', units: 211, revenueK: 148, category: 'Isotónica', trend: '+14%' },
  { rank: 3, name: 'Coca-Cola 500ml', units: 198, revenueK: 118, category: 'Gaseosa', trend: '+6%' },
  { rank: 4, name: 'Agua Mineral 500ml', units: 176, revenueK: 88, category: 'Agua', trend: '-2%' },
  { rank: 5, name: 'Powerade Azul 500ml', units: 142, revenueK: 98, category: 'Isotónica', trend: '+22%' },
  { rank: 6, name: 'Cerveza Stella 473', units: 128, revenueK: 230, category: 'Cerveza', trend: '+8%' },
  { rank: 7, name: 'Fernet + Coca (jarra)', units: 94, revenueK: 310, category: 'Bar', trend: '+44%' },
  { rank: 8, name: 'Gatorade Limón 500ml', units: 84, revenueK: 58, category: 'Isotónica', trend: '—' },
]

const MIX: MixSegment[] = [
  { label: 'Cerv.', pct: 38, tone: 'ink' },
  { label: 'Isot.', pct: 26, tone: 'accent' },
  { label: 'Bar', pct: 18, tone: 'red' },
  { label: 'Gas.', pct: 12, tone: 'sand' },
  { label: 'H₂O', pct: 6, tone: 'paper' },
]

const RESTOCK = [
  { n: 'Gatorade Naranja', s: '8 u' },
  { n: 'Stella 473', s: '12 u' },
  { n: 'Coca-Cola 500ml', s: '14 u' },
]

const HEATMAP_DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const HEATMAP_HOURS = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '0', '1', '2', '3']

function heatmapIntensity(dayIdx: number, hourIdx: number): number {
  // Pseudorandom determinístico que replica el mock: peak en jueves-domingo 19-23h.
  const base = ((dayIdx * 7 + hourIdx * 3) % 10) / 10
  const peak = dayIdx >= 3 && hourIdx >= 5 && hourIdx <= 9 ? 1 : 0.3
  return Math.min(1, base + peak * 0.8)
}

export default function DrinksPage() {
  return (
    <>
      <OwnerHeader
        eyebrow="ANALYTICS · MARZO 2026"
        title={
          <>
            CONSUMO
            <br />
            DE BARRA.
          </>
        }
        right={
          <div className="flex gap-2">
            <Button variant="ghost" className="!px-3.5 !py-2.5 !text-[12px]">
              30 días ▾
            </Button>
            <Button variant="accent" className="!px-3.5 !py-2.5 !text-[12px]">
              Exportar CSV
            </Button>
          </div>
        }
      />

      <KpiGrid kpis={KPIS} />

      {/* Body */}
      <div className="grid border-b-card border-cy-line" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <section className="border-r-card border-cy-line p-7">
          <SectionTitle eyebrow="TOP 8 · POR UNIDADES" title="Ranking del mes" />
          <DrinkRankingFull rows={TOP_DRINKS} maxUnits={284} />
        </section>

        <section className="p-7">
          <SectionTitle eyebrow="POR CATEGORÍA" title="Mix de barra" />
          <MixSegmentedBar segments={MIX} />

          {/* Insight */}
          <div className="mt-4 border-card border-cy-line bg-cy-accent p-3.5">
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-ink">
              § INSIGHT
            </p>
            <p className="mt-1 font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
              JUEVES = CERVEZA
            </p>
            <p className="mt-1.5 text-[12px] leading-[1.4] text-cy-ink">
              Los jueves 21-23h concentran el <strong>34% del consumo</strong> de cerveza semanal.
              Probar packs F5+cerveza puede aumentar ticket.
            </p>
          </div>

          {/* Restock */}
          <div className="mt-3 border-card border-cy-line bg-cy-paper p-3.5">
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-red">
              ⚡ REPONER
            </p>
            <div className="mt-1.5">
              {RESTOCK.map((s) => (
                <div
                  key={s.n}
                  className="flex items-center justify-between border-b border-cy-line py-1.5 last:border-b-0"
                >
                  <span className="text-[12px] text-cy-ink">{s.n}</span>
                  <span className="font-mono text-[11px] font-bold text-cy-ink">{s.s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Heatmap */}
      <section className="p-7">
        <SectionTitle eyebrow="HEATMAP · CONSUMO POR HORA" title="¿Cuándo se consume más?" />
        <ConsumptionHeatmap
          days={HEATMAP_DAYS}
          hours={HEATMAP_HOURS}
          getIntensity={heatmapIntensity}
        />
      </section>
    </>
  )
}

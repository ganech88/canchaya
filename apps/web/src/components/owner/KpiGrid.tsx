import { cn } from '@canchaya/ui'

export interface Kpi {
  key: string
  value: string
  delta: string
  sub: string
  accent?: boolean
}

interface Props {
  kpis: Kpi[]
}

export function KpiGrid({ kpis }: Props) {
  return (
    <div
      className={cn(
        'grid border-b-card border-cy-line',
        kpis.length === 4 && 'grid-cols-4',
        kpis.length === 3 && 'grid-cols-3',
      )}
    >
      {kpis.map((kpi, i) => (
        <div
          key={kpi.key}
          className={cn(
            'px-5 py-[22px]',
            i < kpis.length - 1 && 'border-r-chip border-cy-line',
            kpi.accent ? 'bg-cy-accent' : 'bg-cy-paper',
          )}
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-muted">
            {kpi.key}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2.5">
            <span className="font-display text-[56px] leading-[0.85] tracking-tight text-cy-ink">
              {kpi.value}
            </span>
            <span className="font-mono text-[11px] font-bold text-cy-ink">{kpi.delta}</span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-cy-muted">{kpi.sub}</p>
        </div>
      ))}
    </div>
  )
}

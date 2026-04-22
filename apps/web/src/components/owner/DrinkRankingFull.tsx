// Ranking extendido (8 items) con barra de unidades, revenue y trend.

import { cn } from '@canchaya/ui'

export interface FullDrinkRow {
  rank: number
  name: string
  category: string
  units: number
  revenueK: number // en miles
  trend: string // '+28%' | '—'
}

interface Props {
  rows: FullDrinkRow[]
  maxUnits: number
}

export function DrinkRankingFull({ rows, maxUnits }: Props) {
  return (
    <div>
      {rows.map((d) => {
        const isTop3 = d.rank <= 3
        const isPositive = d.trend.startsWith('+')
        return (
          <div
            key={d.rank}
            className="grid items-center gap-2.5 border-b border-cy-line py-3.5"
            style={{ gridTemplateColumns: '44px 1fr 80px 1fr 90px 70px' }}
          >
            <span
              className={cn(
                'font-display text-[30px] leading-[26px] tracking-tight',
                isTop3 ? 'text-cy-red' : 'text-cy-ink',
              )}
            >
              {String(d.rank).padStart(2, '0')}
            </span>
            <div>
              <p className="text-[14px] font-semibold text-cy-ink">{d.name}</p>
              <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">
                {d.category}
              </p>
            </div>
            <p className="font-mono text-[12px] font-bold text-cy-ink">{d.units} u.</p>
            <div className="h-2 border-chip border-cy-line bg-cy-sand">
              <div
                className={cn('h-full', d.rank === 1 ? 'bg-cy-red' : 'bg-cy-ink')}
                style={{ width: `${(d.units / maxUnits) * 100}%` }}
              />
            </div>
            <p className="text-right font-mono text-[12px] font-bold text-cy-ink">
              ${d.revenueK}K
            </p>
            <p
              className={cn(
                'text-right font-mono text-[10px] font-bold',
                isPositive ? 'text-cy-red' : 'text-cy-muted',
              )}
            >
              {d.trend}
            </p>
          </div>
        )
      })}
    </div>
  )
}

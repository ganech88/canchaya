import { cn } from '@canchaya/ui'

export interface DrinkRow {
  rank: number
  name: string
  units: number
  revenue: string // '$340K'
}

interface Props {
  rows: DrinkRow[]
  maxUnits: number
}

export function DrinksRanking({ rows, maxUnits }: Props) {
  return (
    <div>
      {rows.map((d) => (
        <div
          key={d.rank}
          className="grid items-baseline gap-2.5 border-b border-cy-line py-2.5"
          style={{ gridTemplateColumns: '40px 1fr 120px 80px' }}
        >
          <span
            className={cn(
              'font-display text-[26px] leading-[22px] tracking-tight',
              d.rank === 1 ? 'text-cy-red' : 'text-cy-ink',
            )}
          >
            {String(d.rank).padStart(2, '0')}
          </span>
          <span className="text-[14px] font-semibold text-cy-ink">{d.name}</span>
          <div className="flex items-center gap-2">
            <div className="relative h-1 flex-1 bg-cy-sand">
              <div
                className="absolute inset-y-0 left-0 bg-cy-ink"
                style={{ width: `${(d.units / maxUnits) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-cy-ink">{d.units}</span>
          </div>
          <span className="text-right font-mono text-[12px] font-bold text-cy-ink">
            {d.revenue}
          </span>
        </div>
      ))}
    </div>
  )
}

// Heatmap día × hora. Intensidad 0-1 → color bucket (sand/accent/ink/red).

import { cn } from '@canchaya/ui'

interface HeatmapProps {
  days: string[] // ["LUN","MAR",...]
  hours: string[] // ["14","15",...,"3"]
  getIntensity: (dayIdx: number, hourIdx: number) => number
}

function bucket(v: number): string {
  if (v > 0.8) return 'bg-cy-red'
  if (v > 0.6) return 'bg-cy-ink'
  if (v > 0.35) return 'bg-cy-accent'
  return 'bg-cy-sand'
}

export function ConsumptionHeatmap({ days, hours, getIntensity }: HeatmapProps) {
  return (
    <div
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: `60px repeat(${hours.length}, 1fr)` }}
    >
      <div />
      {hours.map((h) => (
        <div key={h} className="text-center font-mono text-[9px] font-bold text-cy-ink">
          {h}h
        </div>
      ))}
      {days.map((d, di) => (
        <div key={d} style={{ display: 'contents' }}>
          <div className="flex items-center font-mono text-[9px] font-bold text-cy-ink">{d}</div>
          {hours.map((_, hi) => {
            const v = getIntensity(di, hi)
            return (
              <div
                key={hi}
                className={cn('aspect-square border border-cy-line', bucket(v))}
                title={`${d} ${hours[hi]}h · ${Math.round(v * 100)}%`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

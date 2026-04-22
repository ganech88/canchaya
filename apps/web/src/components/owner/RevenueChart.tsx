// Bar chart simple CSS-only — útil para la vista general del dashboard. Sin tooltip ni deps.
// Cuando conectemos datos reales intercambiamos por una lib (recharts, visx) con hovers.

import { cn } from '@canchaya/ui'

interface Props {
  values: number[] // 0..max
  highlightLastN?: number
  max?: number
  height?: number
}

export function RevenueChart({
  values,
  highlightLastN = 8,
  max,
  height = 160,
}: Props) {
  const normalizedMax = max ?? Math.max(...values, 1)
  const lastIdx = values.length - 1
  const cutoff = values.length - highlightLastN

  return (
    <div
      className="flex items-end gap-[4px] border-b-chip border-cy-line py-2.5"
      style={{ height }}
    >
      {values.map((v, i) => {
        const isLast = i === lastIdx
        const isRecent = i >= cutoff
        return (
          <div
            key={i}
            className={cn(
              'flex-1 border border-cy-line',
              isLast ? 'bg-cy-red' : isRecent ? 'bg-cy-ink' : 'bg-cy-muted',
            )}
            style={{ height: `${(v / normalizedMax) * 100}%` }}
          />
        )
      })}
    </div>
  )
}

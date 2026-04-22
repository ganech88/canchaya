import { cn } from '@canchaya/ui'

export interface LiveCourt {
  label: string
  status: 'EN JUEGO' | 'LIBRE' | 'MANTENIMIENTO'
  who: string
  time: string
  pct: number // 0-100
}

interface Props {
  courts: LiveCourt[]
}

export function LiveCourts({ courts }: Props) {
  return (
    <div>
      {courts.map((c) => {
        const isPlaying = c.status === 'EN JUEGO'
        return (
          <div key={c.label} className="border-b border-cy-line py-2.5">
            <div className="flex items-baseline justify-between">
              <span className="font-condensed text-[16px] uppercase text-cy-ink">{c.label}</span>
              <span
                className={cn(
                  'font-mono text-[10px] font-bold',
                  isPlaying ? 'text-cy-red' : 'text-cy-muted',
                )}
              >
                ● {c.status}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-cy-muted">
              {c.who} · {c.time}
            </p>
            {c.pct > 0 && (
              <div className="relative mt-1.5 h-1 bg-cy-sand">
                <div
                  className="absolute inset-y-0 left-0 bg-cy-red"
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

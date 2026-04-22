import { cn } from '@canchaya/ui'

export type TimelineStatus =
  | 'CONFIRMADA'
  | 'PAGADA'
  | 'FALTAN 2'
  | 'RECURRENTE'
  | 'SEÑADO'
  | 'CANCELADA'

export interface TimelineRow {
  time: string
  duration: string
  court: string
  who: string
  people: string
  status: TimelineStatus
}

interface Props {
  rows: TimelineRow[]
}

const statusClass: Record<TimelineStatus, string> = {
  CONFIRMADA: 'bg-cy-ink text-cy-paper',
  PAGADA: 'bg-cy-accent text-cy-ink',
  'FALTAN 2': 'bg-cy-red text-cy-paper',
  RECURRENTE: 'bg-cy-ink text-cy-paper',
  SEÑADO: 'bg-cy-ink text-cy-paper',
  CANCELADA: 'bg-cy-sand text-cy-muted',
}

export function TodayTimeline({ rows }: Props) {
  return (
    <div>
      {rows.map((r, i) => (
        <div
          key={i}
          className="grid items-center gap-2.5 border-b border-cy-line py-2.5"
          style={{ gridTemplateColumns: '80px 90px 1fr 100px 110px' }}
        >
          <div>
            <div className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
              {r.time}
            </div>
            <div className="font-mono text-[9px] text-cy-muted">{r.duration}</div>
          </div>
          <div className="font-mono text-[10px] font-bold uppercase text-cy-ink">{r.court}</div>
          <div>
            <div className="text-[13px] font-semibold text-cy-ink">{r.who}</div>
          </div>
          <div className="font-mono text-[10px] text-cy-muted">{r.people}</div>
          <div className="text-right">
            <span
              className={cn(
                'inline-block border-chip border-cy-line px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider',
                statusClass[r.status],
              )}
            >
              {r.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

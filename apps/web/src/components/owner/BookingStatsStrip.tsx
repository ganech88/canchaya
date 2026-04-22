import { Chip } from '@canchaya/ui/web'

export interface BookingStat {
  key: string
  value: string
}

interface Props {
  section: string
  status: string
  stats: BookingStat[]
}

export function BookingStatsStrip({ section, status, stats }: Props) {
  return (
    <div className="border-card border-cy-line bg-cy-paper">
      <div className="flex items-center justify-between border-b-card border-cy-line bg-cy-ink px-4 py-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
          § {section}
        </span>
        <Chip variant="accent">{status}</Chip>
      </div>
      <div className="grid grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.key}
            className={
              'p-4 ' + (i < stats.length - 1 ? 'border-r-chip border-cy-line' : '')
            }
          >
            <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">{s.key}</p>
            <p className="mt-0.5 font-display text-[26px] leading-[22px] tracking-tight text-cy-ink">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

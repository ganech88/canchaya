import { cn } from '@canchaya/ui'

export interface MixSegment {
  label: string
  pct: number // 0-100
  tone: 'ink' | 'accent' | 'red' | 'sand' | 'paper'
}

interface Props {
  segments: MixSegment[]
  height?: number
}

const toneClass: Record<MixSegment['tone'], string> = {
  ink: 'bg-cy-ink text-cy-accent',
  accent: 'bg-cy-accent text-cy-ink',
  red: 'bg-cy-red text-cy-paper',
  sand: 'bg-cy-sand text-cy-ink',
  paper: 'bg-cy-paper text-cy-ink',
}

export function MixSegmentedBar({ segments, height = 56 }: Props) {
  return (
    <div className="flex border-chip border-cy-line" style={{ height }}>
      {segments.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            'flex flex-col justify-between p-2',
            i > 0 && 'border-l-chip border-cy-line',
            toneClass[s.tone],
          )}
          style={{ width: `${s.pct}%` }}
        >
          <span className="font-mono text-[9px] font-bold uppercase">{s.label}</span>
          <span className="font-display text-[16px] leading-[14px] tracking-tight">
            {s.pct}%
          </span>
        </div>
      ))}
    </div>
  )
}

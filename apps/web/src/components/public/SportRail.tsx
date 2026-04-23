import Link from 'next/link'
import { SPORTS_CATALOG } from '@/data/mock'

const SPORT_ICONS: Record<string, string> = {
  futbol: '⚽',
  padel: '🎾',
  tenis: '🎾',
  basquet: '🏀',
  voley: '🏐',
}

export function SportRail() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {SPORTS_CATALOG.map((s) => (
        <Link
          key={s.code}
          href={`/results?sport=${s.code}` as never}
          className="group flex flex-col items-start gap-2 border-card border-cy-line bg-cy-paper p-5 transition-colors hover:bg-cy-accent"
        >
          <span className="text-[36px] leading-none">{SPORT_ICONS[s.code] ?? '⚽'}</span>
          <div>
            <p className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
              {s.label.toUpperCase()}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-cy-muted group-hover:text-cy-ink">
              Ver canchas →
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

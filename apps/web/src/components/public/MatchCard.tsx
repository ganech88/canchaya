import { Chip, Placeholder } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'
import { formatPriceFromCents, type MockVenueCard } from '@/data/mock'
import type { MockMatch } from '@/data/matches'

interface Props {
  match: MockMatch
}

const LEVEL_LABELS: Record<MockMatch['level'], string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  profesional: 'Profesional',
}

const GENDER_LABELS: Record<MockMatch['genderFilter'], string> = {
  any: 'Mixto',
  m: 'Masculino',
  f: 'Femenino',
}

export function MatchCard({ match }: Props) {
  const spotsLeft = match.spotsTotal - match.spotsFilled
  const isUrgent = spotsLeft <= 2

  return (
    <article className="border-card border-cy-line bg-cy-paper">
      {/* Top strip */}
      <div className="flex items-center justify-between border-b border-cy-line bg-cy-ink px-4 py-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
          § {match.sportLabel.toUpperCase()} · {match.dateLabel}
        </span>
        <Chip variant={isUrgent ? 'accent' : 'fill'}>
          {spotsLeft === 0 ? 'COMPLETO' : `FALTAN ${spotsLeft}`}
        </Chip>
      </div>

      <div className="p-5">
        {/* Venue + distance */}
        <p className="font-mono text-[10px] uppercase tracking-wider text-cy-muted">
          {match.venueCity} · {match.distanceKm}km
        </p>
        <h3 className="mt-0.5 font-display text-[26px] leading-[22px] tracking-tight text-cy-ink">
          {match.venueName}
        </h3>

        {match.description && (
          <p className="mt-2.5 font-ui text-[13px] text-cy-ink">{match.description}</p>
        )}

        {/* Filters chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip>NIV · {LEVEL_LABELS[match.level].toUpperCase()}</Chip>
          <Chip>{GENDER_LABELS[match.genderFilter].toUpperCase()}</Chip>
          {match.ageMin && match.ageMax && (
            <Chip>
              {match.ageMin}-{match.ageMax} AÑOS
            </Chip>
          )}
          {match.ageMin && !match.ageMax && <Chip>+{match.ageMin}</Chip>}
        </div>

        <div className="my-4 h-[2px] bg-cy-line" />

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-0">
          <div className="border-r border-cy-line pr-3">
            <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">Aporte</p>
            <p className="font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
              {formatPriceFromCents(match.pricePerPlayerCents, match.currency)}
            </p>
          </div>
          <div className="border-r border-cy-line px-3">
            <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">Spots</p>
            <p className="font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
              {match.spotsFilled}/{match.spotsTotal}
            </p>
          </div>
          <div className="pl-3">
            <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">Host</p>
            <p className="font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
              {match.host.initials}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 border-card border-cy-line bg-cy-paper px-3 py-2.5 font-ui text-[12px] font-bold uppercase tracking-wide text-cy-ink hover:bg-cy-bg"
          >
            Ver detalle
          </button>
          <button
            type="button"
            disabled={spotsLeft === 0}
            className="flex items-center justify-center gap-1.5 flex-[2] border-card border-cy-line bg-cy-accent px-3 py-2.5 font-ui text-[12px] font-bold uppercase tracking-wide text-cy-ink disabled:bg-cy-sand disabled:text-cy-muted hover:opacity-90"
          >
            {spotsLeft === 0 ? 'Completo' : 'Me sumo'}
            {spotsLeft > 0 && <Icon name="arrow" size={12} />}
          </button>
        </div>
      </div>
    </article>
  )
}

import { Icon } from '../icons'

interface CourtTypeProps {
  type: string
  className?: string
}

export function CourtType({ type, className }: CourtTypeProps) {
  const isPadel = /pádel|padel/i.test(type)
  return (
    <span
      className={`inline-flex items-center gap-1.5 border-chip border-cy-line px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${className ?? ''}`}
    >
      <Icon name={isPadel ? 'padel' : 'ball'} size={14} />
      {type}
    </span>
  )
}

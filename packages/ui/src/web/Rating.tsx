import { Icon } from '../icons'

interface RatingProps {
  value: number
  count?: number
  className?: string
}

export function Rating({ value, count, className }: RatingProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className ?? ''}`}>
      <Icon name="star" size={12} className="text-cy-ink" />
      <span className="font-mono text-[11px] font-bold">{value.toFixed(1)}</span>
      {typeof count === 'number' && (
        <span className="font-mono text-[10px] text-cy-muted">({count})</span>
      )}
    </span>
  )
}

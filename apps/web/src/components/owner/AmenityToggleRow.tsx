'use client'

import { cn } from '@canchaya/ui'

interface Props {
  label: string
  on: boolean
  onToggle?: () => void
}

export function AmenityToggleRow({ label, on, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between border-chip border-cy-line px-3 py-2 text-left"
    >
      <span className="text-[12px] text-cy-ink">{label}</span>
      <div
        className={cn(
          'relative h-[18px] w-9 border-chip border-cy-line',
          on ? 'bg-cy-accent' : 'bg-cy-sand',
        )}
      >
        <div
          className={cn('absolute -top-px h-[18px] w-[16px] bg-cy-ink', on ? '-right-px' : '-left-px')}
        />
      </div>
    </button>
  )
}

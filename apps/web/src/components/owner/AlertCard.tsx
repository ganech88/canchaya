import type { ReactNode } from 'react'
import { cn } from '@canchaya/ui'

interface Props {
  tag: string // '⚡ STOCK BAJO'
  children: ReactNode
  variant?: 'accent' | 'paper'
  className?: string
}

export function AlertCard({ tag, children, variant = 'paper', className }: Props) {
  return (
    <div
      className={cn(
        'border-card border-cy-line p-3',
        variant === 'accent' ? 'bg-cy-accent' : 'bg-cy-paper',
        className,
      )}
    >
      <p className="font-mono text-[10px] font-bold uppercase text-cy-ink">{tag}</p>
      <p className="mt-0.5 text-[12px] text-cy-ink">{children}</p>
    </div>
  )
}

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../cn'

export type ChipVariant = 'outline' | 'fill' | 'accent'

interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  variant?: ChipVariant
  children: ReactNode
}

const variantClass: Record<ChipVariant, string> = {
  outline: 'bg-transparent text-cy-ink',
  fill: 'bg-cy-ink text-cy-bg',
  accent: 'bg-cy-accent text-cy-ink border-cy-ink',
}

export function Chip({ variant = 'outline', className, children, ...rest }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border-chip border-cy-line',
        'px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider',
        variantClass[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

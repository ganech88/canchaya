// Placeholder con patrón rayado diagonal — se usa en lugar de fotos reales durante el desarrollo.
// Variantes: default (arena), `accent` (lima), `field` (verde cancha con grid), `dark` (negro).

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../cn'

export type PlaceholderVariant = 'default' | 'accent' | 'field' | 'dark'

interface PlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PlaceholderVariant
  label?: ReactNode
  children?: ReactNode
}

const base =
  'relative flex items-center justify-center overflow-hidden border-chip border-cy-line ' +
  'font-mono text-[10px] uppercase tracking-wider text-cy-muted'

const variantStyles: Record<PlaceholderVariant, string> = {
  default: 'bg-cy-sand',
  accent: 'bg-cy-accent text-cy-ink border-cy-ink',
  field: 'bg-cy-field text-cy-accent border-cy-field-2',
  dark: 'bg-cy-dark text-cy-accent border-cy-dark',
}

const diagonalStripe: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(45deg, transparent 0 14px, rgba(13,13,13,0.06) 14px 15px)',
}

const fieldGrid: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 1px, transparent 1px 40px), ' +
    'repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, transparent 1px 40px)',
}

export function Placeholder({
  variant = 'default',
  label,
  children,
  className,
  style,
  ...rest
}: PlaceholderProps) {
  const overlay =
    variant === 'field' ? fieldGrid : variant === 'default' ? diagonalStripe : undefined
  return (
    <div
      className={cn(base, variantStyles[variant], className)}
      style={{ ...overlay, ...style }}
      {...rest}
    >
      {label && <span>{label}</span>}
      {children}
    </div>
  )
}

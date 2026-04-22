import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../cn'

interface StampProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export function Stamp({ children, className, ...rest }: StampProps) {
  return (
    <span
      className={cn(
        'inline-block border border-dashed border-cy-line px-1.5 py-0.5',
        'font-mono text-[10px] uppercase tracking-[0.14em]',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

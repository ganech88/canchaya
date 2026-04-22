import type { ReactNode } from 'react'
import { cn } from '../cn'

interface EyebrowProps {
  children: ReactNode
  className?: string
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cy-red',
        className,
      )}
    >
      § {children}
    </span>
  )
}

import type { ReactNode } from 'react'
import { cn } from '@canchaya/ui'

interface SectionTitleProps {
  eyebrow: string
  title: ReactNode
  right?: ReactNode
  className?: string
}

export function SectionTitle({ eyebrow, title, right, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-3.5', className)}>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § {eyebrow}
          </p>
          <h2 className="font-condensed text-[26px] uppercase leading-tight text-cy-ink">
            {title}
          </h2>
        </div>
        {right}
      </div>
      <div className="mt-2 h-1 bg-cy-line" />
    </div>
  )
}

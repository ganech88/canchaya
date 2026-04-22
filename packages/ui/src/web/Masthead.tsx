// Masthead editorial tipo portada de revista deportiva.
// Variantes: `mobile` (app) — topline con fecha/issue + section + title + sub.
//            `web` (dashboard) — la misma banda superior adaptada al ancho de la vista.

import type { ReactNode } from 'react'
import { cn } from '../cn'

interface MastheadProps {
  dateStr?: string
  issue?: string
  section?: string
  title?: ReactNode
  sub?: ReactNode
  className?: string
}

export function Masthead({ dateStr, issue, section, title, sub, className }: MastheadProps) {
  return (
    <div className={cn('border-b-card border-cy-line bg-cy-paper', className)}>
      {(dateStr || issue) && (
        <div className="flex items-center justify-between border-b border-cy-line px-4 py-2 font-mono text-[10px] uppercase tracking-wider">
          {dateStr && <span>{dateStr}</span>}
          {issue && <span>{issue}</span>}
        </div>
      )}
      {section && (
        <div className="flex items-baseline gap-2.5 px-4 pb-1 pt-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cy-red">
            § {section}
          </span>
          <span className="ml-1.5 h-[1.5px] flex-1 bg-cy-line" />
        </div>
      )}
      {title && (
        <div className="px-4 pb-0.5 pt-1 font-display text-[40px] leading-[0.9] tracking-tight text-cy-ink">
          {title}
        </div>
      )}
      {sub && <div className="px-4 pb-3 pt-0 text-[13px] text-cy-muted">{sub}</div>}
    </div>
  )
}

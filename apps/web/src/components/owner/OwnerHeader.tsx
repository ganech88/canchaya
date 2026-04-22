import type { ReactNode } from 'react'

interface OwnerHeaderProps {
  eyebrow: string
  title: ReactNode
  right?: ReactNode
}

export function OwnerHeader({ eyebrow, title, right }: OwnerHeaderProps) {
  return (
    <header className="flex items-end justify-between border-b-card border-cy-line bg-cy-paper px-7 pb-5 pt-[22px]">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
          § {eyebrow}
        </p>
        <h1 className="mt-1.5 font-display text-[48px] leading-[0.9] tracking-tight text-cy-ink">
          {title}
        </h1>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  )
}

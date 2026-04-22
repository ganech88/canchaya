export interface EconomicLine {
  label: string
  amount: string // puede venir con signo y formato (ej "-$4.600")
}

interface Props {
  lines: EconomicLine[]
  totalLabel?: string
  totalAmount: string
}

export function EconomicBreakdown({ lines, totalLabel = 'TOTAL', totalAmount }: Props) {
  return (
    <div className="border-card border-cy-line bg-cy-paper">
      <p className="border-b-chip border-cy-line px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
        § DETALLE ECONÓMICO
      </p>
      {lines.map((r, i) => (
        <div
          key={r.label}
          className={
            'flex items-center justify-between px-4 py-2.5 ' +
            (i < lines.length - 1 ? 'border-b border-cy-line' : '')
          }
        >
          <span className="text-[13px] text-cy-ink">{r.label}</span>
          <span className="font-mono text-[12px] font-bold text-cy-ink">{r.amount}</span>
        </div>
      ))}
      <div className="flex items-center justify-between bg-cy-accent px-4 py-3.5">
        <span className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
          {totalLabel}
        </span>
        <span className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
          {totalAmount}
        </span>
      </div>
    </div>
  )
}

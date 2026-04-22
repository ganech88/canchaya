import { cn } from '@canchaya/ui'

interface Props {
  label: string
  value: string
  mono?: boolean
  span?: 1 | 2
  textarea?: boolean
}

export function SettingsField({ label, value, mono, span = 1, textarea }: Props) {
  return (
    <div style={{ gridColumn: span === 2 ? 'span 2' : undefined }}>
      <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
        {label}
      </p>
      <div
        className={cn(
          'border-chip border-cy-line bg-cy-bg px-2.5 py-2',
          textarea && 'min-h-[60px] p-2.5',
          mono ? 'font-mono text-[12px]' : 'font-ui text-[13px]',
          'text-cy-ink',
        )}
      >
        {value}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'
import { cn } from '@canchaya/ui'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import { CalendarGrid, type CalendarBooking } from '@/components/owner/CalendarGrid'

const HOURS = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23']

const LEGEND: { color: string; label: string }[] = [
  { color: 'bg-cy-ink', label: 'Reservado' },
  { color: 'bg-cy-accent', label: 'Pagado' },
  { color: 'bg-cy-red', label: 'Evento / Recurrente' },
  { color: 'bg-cy-sand', label: 'Bloqueado' },
]

type ViewKey = 'day' | 'week' | 'month'

interface Footer {
  bookings: number
  revenueLabel: string
  occupancyPct: number
  freeHours: number
}

interface Props {
  weekLabel: string
  days: string[]
  bookings: CalendarBooking[]
  todayIndex: number
  footer: Footer
}

export function CalendarView({ weekLabel, days, bookings, todayIndex, footer }: Props) {
  const [view, setView] = useState<ViewKey>('week')

  return (
    <>
      <OwnerHeader
        eyebrow={weekLabel}
        title="CALENDARIO."
        right={
          <div className="flex items-center gap-2">
            <div className="flex border-card border-cy-line">
              {(['day', 'week', 'month'] as const).map((v, i) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    'px-3 py-2 font-ui text-[11px] font-bold uppercase tracking-wide',
                    i < 2 && 'border-r-chip border-cy-line',
                    view === v ? 'bg-cy-accent text-cy-ink' : 'bg-cy-paper text-cy-ink',
                  )}
                >
                  {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
            <Button
              variant="accent"
              leftIcon={<Icon name="plus" size={12} />}
              className="!px-3.5 !py-2.5 !text-[12px]"
            >
              Reserva
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-5 border-b-chip border-cy-line bg-cy-paper px-7 py-3.5">
        <span className="font-mono text-[10px] font-bold text-cy-ink">LEYENDA:</span>
        {LEGEND.map((x) => (
          <span key={x.label} className="flex items-center gap-1.5 text-[11px] text-cy-ink">
            <span className={cn('h-[14px] w-[14px] border-chip border-cy-line', x.color)} />
            {x.label}
          </span>
        ))}
      </div>

      <div className="p-7">
        <CalendarGrid days={days} hours={HOURS} bookings={bookings} todayIndex={todayIndex} />

        <div className="mt-4 grid grid-cols-4 border-card border-cy-line">
          {[
            { k: 'Reservas', v: String(footer.bookings), accent: false },
            { k: 'Ingresos', v: footer.revenueLabel, accent: true },
            { k: 'Ocupación', v: `${footer.occupancyPct}%`, accent: false },
            { k: 'Huecos libres', v: `${footer.freeHours}h`, accent: false },
          ].map((s, i) => (
            <div
              key={s.k}
              className={cn(
                'p-4',
                i < 3 && 'border-r-chip border-cy-line',
                s.accent ? 'bg-cy-accent' : 'bg-cy-paper',
              )}
            >
              <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">{s.k}</p>
              <p className="mt-1 font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

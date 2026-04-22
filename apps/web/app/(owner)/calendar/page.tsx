'use client'

import { useState } from 'react'
import { Button } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'
import { cn } from '@canchaya/ui'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import { CalendarGrid, type CalendarBooking } from '@/components/owner/CalendarGrid'

const DAYS = ['LUN 22', 'MAR 23', 'MIÉ 24', 'JUE 25', 'VIE 26', 'SÁB 27', 'DOM 28']
const HOURS = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23']

const BOOKINGS: CalendarBooking[] = [
  { day: 0, startHour: 19, endHour: 20, court: 'C1', who: 'Martín B.', color: 'ink' },
  { day: 0, startHour: 19, endHour: 20, court: 'C2', who: 'Emp. XYZ', color: 'accent' },
  { day: 0, startHour: 20, endHour: 21.5, court: 'P1', who: 'Laura/Nico', color: 'ink' },
  { day: 0, startHour: 21, endHour: 22, court: 'C4', who: 'Veteranos', color: 'red' },
  { day: 1, startHour: 18, endHour: 19, court: 'C1', who: 'Pablo', color: 'ink' },
  { day: 1, startHour: 20, endHour: 21, court: 'C2', who: 'Abierto', color: 'accent' },
  { day: 2, startHour: 17, endHour: 18, court: 'P1', who: 'Ana', color: 'ink' },
  { day: 2, startHour: 20, endHour: 21, court: 'C1', who: 'Juan', color: 'ink' },
  { day: 3, startHour: 19, endHour: 20, court: 'C3', who: 'Abierto', color: 'accent' },
  { day: 3, startHour: 21, endHour: 22, court: 'C4', who: 'Veteranos', color: 'red' },
  { day: 4, startHour: 18, endHour: 20, court: 'C1', who: 'Torneo', color: 'red' },
  { day: 4, startHour: 20, endHour: 21, court: 'P1', who: 'Nico', color: 'ink' },
  { day: 4, startHour: 21, endHour: 22, court: 'C2', who: 'Privada', color: 'ink' },
  { day: 5, startHour: 15, endHour: 17, court: 'C1', who: 'Cumpleaños', color: 'accent' },
  { day: 5, startHour: 17, endHour: 18, court: 'P1', who: 'Clases', color: 'ink' },
  { day: 5, startHour: 20, endHour: 22, court: 'C3', who: 'Torneo F5', color: 'red' },
  { day: 6, startHour: 16, endHour: 17, court: 'C2', who: 'Familiar', color: 'ink' },
  { day: 6, startHour: 19, endHour: 20, court: 'P1', who: 'Recurrente', color: 'ink' },
]

const LEGEND: { color: string; label: string }[] = [
  { color: 'bg-cy-ink', label: 'Reservado' },
  { color: 'bg-cy-accent', label: 'Pagado' },
  { color: 'bg-cy-red', label: 'Evento / Recurrente' },
  { color: 'bg-cy-sand', label: 'Bloqueado' },
]

type ViewKey = 'day' | 'week' | 'month'

export default function CalendarPage() {
  const [view, setView] = useState<ViewKey>('week')

  return (
    <>
      <OwnerHeader
        eyebrow="SEMANA · 22—28 MAR 2026"
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

      {/* Legend */}
      <div className="flex items-center gap-5 border-b-chip border-cy-line bg-cy-paper px-7 py-3.5">
        <span className="font-mono text-[10px] font-bold text-cy-ink">LEYENDA:</span>
        {LEGEND.map((x) => (
          <span key={x.label} className="flex items-center gap-1.5 text-[11px] text-cy-ink">
            <span className={cn('h-[14px] w-[14px] border-chip border-cy-line', x.color)} />
            {x.label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="p-7">
        <CalendarGrid days={DAYS} hours={HOURS} bookings={BOOKINGS} todayIndex={0} />

        {/* Footer stats */}
        <div className="mt-4 grid grid-cols-4 border-card border-cy-line">
          {[
            { k: 'Reservas', v: '148', accent: false },
            { k: 'Ingresos', v: '$2.4M', accent: true },
            { k: 'Ocupación', v: '78%', accent: false },
            { k: 'Huecos libres', v: '22h', accent: false },
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

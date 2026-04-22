// Grid semanal 7 días × N horas. Cada booking se posiciona absoluto dentro de la celda
// de su hora-inicio con `top = (start - floor(start)) * 60px` y `height = (end-start) * 60px`.

import { cn } from '@canchaya/ui'

export type BookingColor = 'ink' | 'accent' | 'red' | 'sand'

export interface CalendarBooking {
  day: number // 0..6 (index del array days)
  startHour: number // 19 | 19.5
  endHour: number
  court: string
  who: string
  color: BookingColor
}

interface Props {
  days: string[] // ["LUN 22","MAR 23",...]
  hours: string[] // ["14","15",...]
  bookings: CalendarBooking[]
  todayIndex?: number
  cellHeight?: number
}

const colorBg: Record<BookingColor, string> = {
  ink: 'bg-cy-ink text-cy-paper',
  accent: 'bg-cy-accent text-cy-ink',
  red: 'bg-cy-red text-cy-paper',
  sand: 'bg-cy-sand text-cy-muted',
}

export function CalendarGrid({
  days,
  hours,
  bookings,
  todayIndex = 0,
  cellHeight = 60,
}: Props) {
  return (
    <div
      className="grid border-card border-cy-line bg-cy-paper"
      style={{ gridTemplateColumns: `60px repeat(${days.length}, 1fr)` }}
    >
      {/* Header: "HORA" */}
      <div className="bg-cy-ink px-1.5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-wider text-cy-accent">
        HORA
      </div>
      {days.map((d, i) => {
        const [letters, number] = d.split(' ')
        return (
          <div
            key={d}
            className={cn(
              'border-l-chip border-cy-line px-2 py-2.5',
              i === todayIndex ? 'bg-cy-accent text-cy-ink' : 'bg-cy-ink text-cy-accent',
            )}
          >
            <div className="font-mono text-[9px] tracking-wider">{letters}</div>
            <div className="font-display text-[20px] leading-[18px] tracking-tight">{number}</div>
          </div>
        )
      })}

      {/* Rows */}
      {hours.map((h) => {
        const hourInt = Number.parseInt(h, 10)
        return (
          <div key={h} style={{ display: 'contents' }}>
            {/* hour label */}
            <div
              className="relative border-t-chip border-cy-line px-1.5 py-1 font-mono text-[10px] font-bold text-cy-muted"
              style={{ minHeight: cellHeight }}
            >
              <span className="absolute right-1.5 top-1">{h}h</span>
            </div>
            {/* 7 day cells */}
            {days.map((_, di) => {
              const cellBookings = bookings.filter(
                (b) => b.day === di && Math.floor(b.startHour) === hourInt,
              )
              return (
                <div
                  key={di}
                  className="relative border-l-chip border-t-chip border-cy-line p-0.5"
                  style={{ minHeight: cellHeight }}
                >
                  {cellBookings.map((b, bi) => {
                    const height = (b.endHour - b.startHour) * cellHeight
                    const offset = (b.startHour - hourInt) * cellHeight
                    return (
                      <div
                        key={bi}
                        className={cn(
                          'absolute border-chip border-cy-line px-1.5 py-1',
                          colorBg[b.color],
                        )}
                        style={{
                          left: 2 + bi * 2,
                          right: 2,
                          top: 2 + offset,
                          height: height - 4,
                          zIndex: bi + 1,
                          overflow: 'hidden',
                        }}
                      >
                        <div className="font-mono text-[8px] font-bold uppercase tracking-wider opacity-80">
                          {b.court}
                        </div>
                        <div className="font-condensed text-[13px] uppercase">{b.who}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

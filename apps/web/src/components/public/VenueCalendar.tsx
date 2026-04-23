'use client'

import { useState } from 'react'
import { cn } from '@canchaya/ui'

export type SlotState = 'available' | 'busy' | 'picked'

export interface VenueSlot {
  day: number // 0..6 index de DAYS
  hour: string // '19:00'
  state: SlotState
}

const HOURS = ['16', '17', '18', '19', '20', '21', '22', '23']
const DAYS = [
  { letter: 'L', number: 20 },
  { letter: 'M', number: 21 },
  { letter: 'X', number: 22 },
  { letter: 'J', number: 23 },
  { letter: 'V', number: 24 },
  { letter: 'S', number: 25 },
  { letter: 'D', number: 26 },
]

const BUSY = new Set(['0-17', '0-20', '1-19', '2-18', '3-21', '4-22', '5-16', '6-20'])

export function VenueCalendar() {
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <div className="border-card border-cy-line bg-cy-paper p-5">
      {/* Days */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((d, i) => (
          <div
            key={i}
            className={cn(
              'border-chip border-cy-line px-2 py-2 text-center',
              i === 0 ? 'bg-cy-accent' : 'bg-cy-bg',
            )}
          >
            <p className="font-mono text-[9px] text-cy-muted">{d.letter}</p>
            <p className="font-display text-[18px] leading-[16px] tracking-tight text-cy-ink">
              {d.number}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1 bg-cy-line" />

      {/* Hours grid */}
      <p className="my-3 font-mono text-[10px] font-bold uppercase text-cy-muted">
        Disponibilidad · semana
      </p>
      <div className="grid grid-cols-8 gap-1">
        <div />
        {DAYS.map((d, i) => (
          <div key={i} className="text-center font-mono text-[9px] text-cy-muted">
            {d.letter}
          </div>
        ))}
        {HOURS.map((h) => (
          <div key={h} style={{ display: 'contents' }}>
            <div className="flex items-center justify-end pr-1 font-mono text-[10px] text-cy-muted">
              {h}h
            </div>
            {DAYS.map((_, di) => {
              const key = `${di}-${h}`
              const isBusy = BUSY.has(key)
              const isPicked = picked === key
              return (
                <button
                  key={di}
                  type="button"
                  disabled={isBusy}
                  onClick={() => !isBusy && setPicked(key)}
                  className={cn(
                    'aspect-square border-chip border-cy-line transition-opacity',
                    isPicked
                      ? 'bg-cy-ink'
                      : isBusy
                        ? 'bg-cy-sand opacity-50'
                        : 'bg-cy-bg hover:bg-cy-accent',
                  )}
                />
              )
            })}
          </div>
        ))}
      </div>

      {picked && (
        <div className="mt-5 flex items-center justify-between border-card border-cy-line bg-cy-accent px-4 py-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-ink">
              Turno seleccionado
            </p>
            <p className="mt-0.5 font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
              {DAYS[Number(picked.split('-')[0])]?.letter}{' '}
              {DAYS[Number(picked.split('-')[0])]?.number} · {picked.split('-')[1]}:00
            </p>
          </div>
          <button
            type="button"
            className="border-card border-cy-line bg-cy-ink px-4 py-2.5 font-ui text-[13px] font-bold uppercase tracking-wide text-cy-accent hover:opacity-90"
          >
            Reservar
          </button>
        </div>
      )}
    </div>
  )
}

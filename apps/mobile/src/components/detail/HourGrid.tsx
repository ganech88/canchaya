// Grid de 4 columnas con turnos horarios y estados: disponible, ocupado, elegido.

import { View, Text, Pressable } from 'react-native'
import { cn } from '@canchaya/ui'

export type HourState = 'available' | 'busy' | 'picked'

export interface HourSlot {
  hour: string // '18' (0-padded o no, irrelevante — lo renderizamos como `${hour}:00`)
  state: HourState
}

interface Props {
  slots: HourSlot[]
  onPickHour?: (hour: string) => void
}

const bg: Record<HourState, string> = {
  available: 'bg-cy-paper',
  busy: 'bg-cy-sand',
  picked: 'bg-cy-ink',
}

const fg: Record<HourState, string> = {
  available: 'text-cy-ink',
  busy: 'text-cy-muted line-through',
  picked: 'text-cy-accent',
}

export function HourGrid({ slots, onPickHour }: Props) {
  return (
    <View className="flex-row flex-wrap" style={{ gap: 6 }}>
      {slots.map((s) => {
        // 4 columnas → cada celda ocupa ~calc(25% - gap). Para evitar math con %, usamos flex-basis.
        return (
          <Pressable
            key={s.hour}
            onPress={() => s.state !== 'busy' && onPickHour?.(s.hour)}
            disabled={s.state === 'busy'}
            className={cn(
              'relative items-center border-chip border-cy-line py-2.5',
              bg[s.state],
            )}
            style={{ width: '23.5%' }}
          >
            <Text
              className={cn(
                'font-display text-[18px] leading-[16px] tracking-tight',
                fg[s.state],
              )}
            >
              {s.hour}:00
            </Text>
            {s.state === 'picked' && (
              <View
                className="absolute border-chip border-cy-line bg-cy-accent px-1 py-0.5"
                style={{ top: -6, right: -6 }}
              >
                <Text className="font-mono text-[9px] text-cy-ink">OK</Text>
              </View>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

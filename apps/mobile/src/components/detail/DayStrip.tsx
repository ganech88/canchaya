import { View, Text, Pressable } from 'react-native'
import { cn } from '@canchaya/ui'

export interface Day {
  letter: string // L/M/X/J/V/S/D
  number: number
}

interface Props {
  days: Day[]
  activeIndex: number
  onChange?: (index: number) => void
}

export function DayStrip({ days, activeIndex, onChange }: Props) {
  return (
    <View className="flex-row gap-1">
      {days.map((d, i) => {
        const isActive = i === activeIndex
        return (
          <Pressable
            key={`${d.letter}-${d.number}`}
            onPress={() => onChange?.(i)}
            className={cn(
              'flex-1 items-center border-chip border-cy-line py-1.5',
              isActive ? 'bg-cy-accent' : 'bg-cy-paper',
            )}
          >
            <Text className="font-mono text-[9px] text-cy-muted">{d.letter}</Text>
            <Text className="font-display text-[16px] leading-[14px] tracking-tight text-cy-ink">
              {d.number}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

import { View, Text } from 'react-native'
import { cn } from '@canchaya/ui'

export interface HistoryEntry {
  id: string | number
  dayLabel: string // 'SAB'
  dayNumber: string // '20'
  title: string // 'La Bombonerita · F5'
  result: string // 'GANADO · 7-4'
  won: boolean
}

interface Props {
  entries: HistoryEntry[]
}

export function HistoryList({ entries }: Props) {
  return (
    <View>
      {entries.map((h, i) => (
        <View
          key={h.id}
          className={cn(
            'flex-row gap-3 py-2.5',
            i < entries.length - 1 && 'border-b border-cy-line',
          )}
        >
          <View className="w-[44px] shrink-0">
            <Text className="font-display text-[16px] leading-[14px] tracking-tight text-cy-ink">
              {h.dayNumber}
            </Text>
            <Text className="font-mono text-[9px] uppercase tracking-widest text-cy-muted">
              {h.dayLabel}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-condensed text-[15px] uppercase text-cy-ink">{h.title}</Text>
            <Text
              className={cn(
                'font-mono text-[10px] uppercase',
                h.won ? 'text-cy-ink' : 'text-cy-muted',
              )}
            >
              {h.result}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

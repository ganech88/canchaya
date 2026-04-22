// Strip de 3 columnas con números grandes; el del medio va en accent para romper el ritmo.

import { View, Text } from 'react-native'
import { cn } from '@canchaya/ui'

export interface HeadlineStat {
  key: string
  value: string
}

interface Props {
  stats: HeadlineStat[]
  accentIndex?: number
}

export function HeadlineStats({ stats, accentIndex = 1 }: Props) {
  return (
    <View className="flex-row border-b-card border-cy-line">
      {stats.map((s, i) => {
        const isAccent = i === accentIndex
        return (
          <View
            key={s.key}
            className={cn(
              'flex-1 px-3 py-3.5',
              i < stats.length - 1 && 'border-r-chip border-cy-line',
              isAccent ? 'bg-cy-accent' : 'bg-cy-paper',
            )}
          >
            <Text className="font-display text-[34px] leading-[30px] tracking-tight text-cy-ink">
              {s.value}
            </Text>
            <Text className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-cy-muted">
              {s.key}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

import { View, Text } from 'react-native'

export interface Stat {
  key: string
  value: string
}

interface Props {
  stats: Stat[]
}

export function StatsStrip({ stats }: Props) {
  return (
    <View className="flex-row border-b-card border-cy-line bg-cy-paper">
      {stats.map((s, i) => (
        <View
          key={s.key}
          className={
            'flex-1 px-3 py-2.5 ' +
            (i < stats.length - 1 ? 'border-r-chip border-cy-line' : '')
          }
        >
          <Text className="font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
            {s.value}
          </Text>
          <Text className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-cy-muted">
            {s.key}
          </Text>
        </View>
      ))}
    </View>
  )
}

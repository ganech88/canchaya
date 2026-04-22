import { View, Text } from 'react-native'

export interface SportRow {
  sport: string
  matches: number
  pct: number // 0-100
}

interface Props {
  rows: SportRow[]
}

export function SportBreakdown({ rows }: Props) {
  return (
    <View>
      {rows.map((r, i) => (
        <View
          key={r.sport}
          className={i < rows.length - 1 ? 'border-b border-cy-line' : undefined}
        >
          <View className="flex-row items-end justify-between py-2">
            <Text className="font-condensed text-[18px] uppercase text-cy-ink">{r.sport}</Text>
            <Text className="font-mono text-[11px] text-cy-ink">
              {r.matches} partidos · {r.pct}%
            </Text>
          </View>
          <View className="mb-2 h-[6px] border-chip border-cy-line bg-cy-sand">
            <View className="h-full bg-cy-ink" style={{ width: `${r.pct}%` }} />
          </View>
        </View>
      ))}
    </View>
  )
}

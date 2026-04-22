import { View, Text } from 'react-native'
import { Chip } from '@canchaya/ui/native'

interface Props {
  venue: string
  sport: string
  dateLabel: string
  durationLabel: string
}

export function BookingBanner({ venue, sport, dateLabel, durationLabel }: Props) {
  return (
    <View className="flex-row items-center justify-between border-card border-cy-line bg-cy-paper px-3 py-2.5">
      <View className="shrink">
        <Text className="font-display text-[16px] leading-[14px] tracking-tight text-cy-ink">
          {venue} · {sport}
        </Text>
        <Text className="mt-0.5 font-mono text-[10px] uppercase text-cy-muted">
          {dateLabel} · {durationLabel}
        </Text>
      </View>
      <Chip variant="accent">OK</Chip>
    </View>
  )
}

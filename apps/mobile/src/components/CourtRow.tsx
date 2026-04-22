import { View, Text, Pressable } from 'react-native'
import { CourtType, Placeholder, Rating } from '@canchaya/ui/native'
import { formatPriceK, type MockCourt } from '@/data/courts'

interface Props {
  court: MockCourt
  onPress?: () => void
  showBorder?: boolean
}

export function CourtRow({ court, onPress, showBorder = true }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={showBorder ? 'border-b border-cy-line' : undefined}
    >
      <View className="flex-row gap-3 py-2.5">
        <Placeholder variant={court.color} className="h-[68px] w-[68px]" label="IMG" />

        <View className="min-w-0 flex-1">
          <View className="flex-row items-baseline justify-between gap-1.5">
            <Text
              className="shrink font-display text-[15px] leading-[14px] tracking-tight text-cy-ink"
              numberOfLines={1}
            >
              {court.name}
            </Text>
            <Rating value={court.rating} count={court.reviews} />
          </View>

          <Text className="mt-0.5 font-mono text-[10px] text-cy-muted">{court.zone}</Text>

          <View className="mt-1.5 flex-row items-center justify-between">
            <CourtType type={court.type} />
            <View className="flex-row items-baseline">
              <Text className="font-display text-[14px] leading-[12px] tracking-tight text-cy-ink">
                {formatPriceK(court.price)}
              </Text>
              <Text className="ml-0.5 font-mono text-[9px] text-cy-muted">/HR</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

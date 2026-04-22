import { View, Text, Pressable } from 'react-native'
import { Chip, CourtType, Placeholder, Rating } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'
import { formatPriceK, type MockCourt } from '@/data/courts'

interface Props {
  court: MockCourt
  onPress?: () => void
}

export function FeaturedCard({ court, onPress }: Props) {
  return (
    <View className="border-card border-cy-line bg-cy-paper">
      {/* Hero image */}
      <View className="relative">
        <Placeholder variant={court.color} className="h-[160px] w-full" label="CANCHA · PHOTO" />

        {/* Badges top-left */}
        <View className="absolute left-2 top-2 flex-row gap-1.5">
          <Chip variant="accent">★ DESTACADA</Chip>
          {court.tag && <Chip variant="fill">{court.tag}</Chip>}
        </View>

        {/* Status bottom-right */}
        <View className="absolute bottom-2 right-2">
          <Chip variant="fill">DISPONIBLE · 20:30</Chip>
        </View>
      </View>

      <View className="px-3.5 py-3">
        <View className="flex-row items-end justify-between gap-2">
          <Text
            className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink"
            numberOfLines={1}
          >
            {court.name}
          </Text>
          <Rating value={court.rating} count={court.reviews} />
        </View>

        <View className="mt-2 flex-row flex-wrap items-center gap-2">
          <CourtType type={court.type} />
          <Text className="font-mono text-[10px] text-cy-muted">· {court.zone}</Text>
        </View>

        <View className="my-2.5 h-[2px] bg-cy-line" />

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-mono text-[9px] text-cy-muted">DESDE / HORA</Text>
            <Text className="font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
              {formatPriceK(court.price)}
            </Text>
          </View>
          <Pressable
            onPress={onPress}
            className="flex-row items-center gap-1.5 border-card border-cy-line bg-cy-accent px-3.5 py-2.5 active:opacity-80"
          >
            <Text className="font-ui text-[12px] font-bold uppercase tracking-wide text-cy-ink">
              Reservar
            </Text>
            <Icon name="arrow" size={14} color="#0d0d0d" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

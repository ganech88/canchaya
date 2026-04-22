// Preview de cancha seleccionada, pegado al fondo del mapa.
// Diseño del handoff: drag handle + thumbnail + info + rating + precio + CTA.

import { View, Text } from 'react-native'
import { Chip, Placeholder, Rating, Button } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'
import { formatPriceK, type MockCourt } from '@/data/courts'

interface Props {
  court: MockCourt
  hour?: string
  onPressDetail?: () => void
}

export function MapBottomSheet({ court, hour = '20:30', onPressDetail }: Props) {
  return (
    <View className="border-t-card border-cy-line bg-cy-paper">
      {/* Drag handle */}
      <View className="items-center py-1.5">
        <View className="h-[3px] w-10 bg-cy-line" />
      </View>

      <View className="px-4 pb-3.5">
        <View className="flex-row gap-3">
          <Placeholder variant={court.color} className="h-[84px] w-[84px]" label="IMG" />

          <View className="flex-1">
            <View className="flex-row items-end justify-between">
              <Text
                className="shrink font-display text-[18px] leading-[16px] tracking-tight text-cy-ink"
                numberOfLines={1}
              >
                {court.name}
              </Text>
              <Chip variant="fill">{hour}</Chip>
            </View>

            <Text className="mt-0.5 font-mono text-[10px] text-cy-muted">
              {court.zone} · {court.type}
              {court.type.toLowerCase().includes('fútbol') ? ' techada' : ''}
            </Text>

            <View className="mt-1.5 flex-row items-center">
              <Rating value={court.rating} count={court.reviews} />
              <View className="flex-1" />
              <Text className="font-display text-[16px] leading-[14px] tracking-tight text-cy-ink">
                {formatPriceK(court.price)}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-2.5">
          <Button
            variant="accent"
            onPress={onPressDetail}
            className="w-full"
            rightIcon={<Icon name="arrow" size={14} color="#0d0d0d" />}
          >
            Ver detalle
          </Button>
        </View>
      </View>
    </View>
  )
}

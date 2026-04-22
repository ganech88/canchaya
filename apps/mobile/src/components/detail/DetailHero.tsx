import { View, Pressable } from 'react-native'
import { Chip, Placeholder } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'

interface Props {
  photoIndex?: number
  photosTotal?: number
  sportLabel?: string
  onBack?: () => void
  onToggleFavorite?: () => void
  favorited?: boolean
}

export function DetailHero({
  photoIndex = 1,
  photosTotal = 6,
  sportLabel = 'F5 · TECHADA',
  onBack,
  onToggleFavorite,
  favorited = false,
}: Props) {
  return (
    <View className="relative">
      <Placeholder variant="field" className="h-[200px] w-full" label="CANCHA · PHOTO" />

      {/* Back chip top-left */}
      <View className="absolute left-3 top-3">
        <Pressable
          onPress={onBack}
          className="border-card border-cy-line bg-cy-paper p-1.5 active:opacity-70"
          hitSlop={6}
        >
          <Icon name="back" size={16} color="#0d0d0d" />
        </Pressable>
      </View>

      {/* Heart top-right */}
      <View className="absolute right-3 top-3 flex-row gap-1.5">
        <Pressable
          onPress={onToggleFavorite}
          className="border-card border-cy-line bg-cy-paper p-1.5 active:opacity-70"
          hitSlop={6}
        >
          <Icon
            name="heart"
            size={16}
            color={favorited ? '#ff3b1f' : '#0d0d0d'}
          />
        </Pressable>
      </View>

      {/* Bottom chips */}
      <View className="absolute bottom-2.5 left-3 flex-row gap-1.5">
        <Chip variant="fill">
          {photoIndex} / {photosTotal}
        </Chip>
        <Chip variant="accent">{sportLabel}</Chip>
      </View>
    </View>
  )
}

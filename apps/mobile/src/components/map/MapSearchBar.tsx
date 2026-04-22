import { View, Text, Pressable } from 'react-native'
import { Icon } from '@/lib/icon'

interface Props {
  location: string
  onBack?: () => void
  onFilterPress?: () => void
}

export function MapSearchBar({ location, onBack, onFilterPress }: Props) {
  return (
    <View className="flex-row border-card border-cy-line bg-cy-paper">
      <Pressable
        onPress={onBack}
        className="border-r-chip border-cy-line p-2.5 active:opacity-70"
        hitSlop={6}
      >
        <Icon name="back" size={18} color="#0d0d0d" />
      </Pressable>

      <View className="flex-1 flex-row items-center gap-2 px-3 py-2.5">
        <Icon name="mapPin" size={16} color="#0d0d0d" />
        <Text className="font-ui text-[12px] text-cy-ink">{location}</Text>
      </View>

      <Pressable
        onPress={onFilterPress}
        className="items-center justify-center bg-cy-ink px-3 active:opacity-80"
      >
        <Icon name="filter" size={14} color="#c6ff1a" />
      </Pressable>
    </View>
  )
}

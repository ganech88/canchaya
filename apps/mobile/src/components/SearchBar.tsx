import { View, Text, Pressable } from 'react-native'
import { Icon } from '@/lib/icon'

interface Props {
  placeholder?: string
  onPress?: () => void
  onFilterPress?: () => void
}

export function SearchBar({
  placeholder = 'Buscar cancha, zona, club…',
  onPress,
  onFilterPress,
}: Props) {
  return (
    <Pressable onPress={onPress} className="flex-row border-card border-cy-line bg-cy-paper">
      <View className="border-r-chip border-cy-line p-3">
        <Icon name="search" size={16} color="#0d0d0d" />
      </View>
      <View className="flex-1 justify-center py-3 pl-2.5 pr-3">
        <Text className="font-ui text-[13px] text-cy-muted">{placeholder}</Text>
      </View>
      <Pressable
        onPress={onFilterPress}
        className="items-center justify-center bg-cy-ink px-3 active:opacity-80"
      >
        <Icon name="filter" size={14} color="#c6ff1a" />
      </Pressable>
    </Pressable>
  )
}

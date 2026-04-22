import { View, Text, Pressable, TextInput } from 'react-native'
import { Icon } from '@/lib/icon'

interface Props {
  value: string
  onChangeText?: (v: string) => void
  onBack?: () => void
  onClear?: () => void
  autoFocus?: boolean
}

export function SearchHeader({ value, onChangeText, onBack, onClear, autoFocus = false }: Props) {
  return (
    <View className="flex-row items-center gap-2.5 border-b-card border-cy-line bg-cy-paper px-4 pb-2.5 pt-3.5">
      <Pressable onPress={onBack} hitSlop={8}>
        <Icon name="back" size={18} color="#0d0d0d" />
      </Pressable>

      <View className="flex-1 flex-row items-center gap-2 border-chip border-cy-line px-3 py-2">
        <Icon name="search" size={16} color="#0d0d0d" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          placeholder="Buscar cancha, zona, club…"
          placeholderTextColor="#6b6557"
          className="flex-1 font-ui text-[13px] text-cy-ink"
          style={{ padding: 0 }}
        />
        {value.length > 0 && (
          <Pressable onPress={onClear} hitSlop={8}>
            <Icon name="close" size={14} color="#0d0d0d" />
          </Pressable>
        )}
      </View>
    </View>
  )
}

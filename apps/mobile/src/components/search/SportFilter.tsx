import { View, Pressable } from 'react-native'
import { Chip } from '@canchaya/ui/native'

const SPORTS = ['F5', 'F7/8', 'F11', 'PÁDEL', 'TENIS'] as const
export type SportKey = (typeof SPORTS)[number]

interface Props {
  active: SportKey | null
  onChange?: (s: SportKey) => void
}

export function SportFilter({ active, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {SPORTS.map((s) => (
        <Pressable key={s} onPress={() => onChange?.(s)}>
          <Chip variant={s === active ? 'accent' : 'outline'}>{s}</Chip>
        </Pressable>
      ))}
    </View>
  )
}

export const SPORT_LIST = SPORTS

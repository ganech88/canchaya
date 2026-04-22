import { View, Pressable } from 'react-native'
import { Chip } from '@canchaya/ui/native'

export const MATCH_LEVELS = ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'] as const
export type MatchLevelKey = (typeof MATCH_LEVELS)[number]

interface Props {
  active: MatchLevelKey
  onChange?: (l: MatchLevelKey) => void
}

export function LevelFilter({ active, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {MATCH_LEVELS.map((l) => (
        <Pressable key={l} onPress={() => onChange?.(l)}>
          <Chip variant={l === active ? 'accent' : 'outline'}>{l}</Chip>
        </Pressable>
      ))}
    </View>
  )
}

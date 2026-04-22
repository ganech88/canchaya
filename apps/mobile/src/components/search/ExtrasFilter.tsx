import { View, Pressable } from 'react-native'
import { Chip } from '@canchaya/ui/native'

export const EXTRAS = ['TECHADA', 'VESTUARIO', 'BAR', 'ESTAC.', 'PROFE'] as const
export type ExtraKey = (typeof EXTRAS)[number]

interface Props {
  active: ExtraKey[]
  onToggle?: (k: ExtraKey) => void
}

export function ExtrasFilter({ active, onToggle }: Props) {
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {EXTRAS.map((e) => {
        const isOn = active.includes(e)
        return (
          <Pressable key={e} onPress={() => onToggle?.(e)}>
            <Chip variant={isOn ? 'fill' : 'outline'}>{e}</Chip>
          </Pressable>
        )
      })}
    </View>
  )
}

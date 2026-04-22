// Card accent lima que muestra el alcance estimado de la convocatoria.

import { View, Text } from 'react-native'

interface Props {
  count: number
  radiusKm?: number
}

export function ReachCard({ count, radiusKm = 3 }: Props) {
  return (
    <View className="border-card border-cy-line bg-cy-accent px-3 py-2.5">
      <Text className="font-mono text-[10px] font-bold uppercase text-cy-ink">
        Alcance estimado
      </Text>
      <View className="mt-1 flex-row items-end gap-2.5">
        <Text className="font-display text-[34px] leading-[30px] tracking-tight text-cy-ink">
          {count}
        </Text>
        <Text className="shrink font-mono text-[10px] text-cy-ink">
          jugadores a &lt;{radiusKm}km verán tu convocatoria
        </Text>
      </View>
    </View>
  )
}

// Slider de rango visual-only por ahora — refleja el mock con dos thumbs y un track lima entre ellos.
// La interactividad con gestos se implementa más adelante con react-native-gesture-handler.
// Para que los valores se muestren bien, el componente acepta min/max y los posiciona en %.

import { View, Text } from 'react-native'

interface Props {
  min: number
  max: number
  lowK: number // low value in thousands (ej. 4)
  highK: number // high value in thousands (ej. 12)
  absoluteMinK: number
  absoluteMaxK: number
}

function formatK(v: number): string {
  return v % 1 === 0 ? `$${v}K` : `$${v.toFixed(1)}K`
}

export function PriceRangeSlider({ min, max, lowK, highK, absoluteMinK, absoluteMaxK }: Props) {
  const range = absoluteMaxK - absoluteMinK
  const lowPct = ((lowK - absoluteMinK) / range) * 100
  const highPct = ((highK - absoluteMinK) / range) * 100

  return (
    <View>
      <View className="mb-1.5 flex-row justify-between">
        <Text className="font-mono text-[10px] font-bold text-cy-ink">PRECIO · HORA</Text>
        <Text className="font-mono text-[10px] text-cy-ink">
          {formatK(lowK)} — {formatK(highK)}
        </Text>
      </View>

      {/* Track */}
      <View className="relative h-2 border-chip border-cy-line bg-cy-paper">
        {/* Selected range (accent lime) */}
        <View
          className="absolute top-[-1.5px] bottom-[-1.5px] border-l-chip border-r-chip border-cy-line bg-cy-accent"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        {/* Low thumb */}
        <View
          className="absolute h-4 w-2.5 bg-cy-ink"
          style={{ left: `${lowPct}%`, top: -5, marginLeft: -5 }}
        />
        {/* High thumb */}
        <View
          className="absolute h-4 w-2.5 bg-cy-ink"
          style={{ left: `${highPct}%`, top: -5, marginLeft: -5 }}
        />
      </View>

      <View className="mt-1.5 flex-row justify-between">
        <Text className="font-mono text-[9px] text-cy-muted">{formatK(absoluteMinK)}</Text>
        <Text className="font-mono text-[9px] text-cy-muted">{formatK(absoluteMaxK)}</Text>
      </View>

      {/* Hint de min/max vienen del range total — los declaramos como unused-friendly */}
      <View style={{ width: 0, height: 0 }} accessibilityElementsHidden>
        <Text>{min}</Text>
        <Text>{max}</Text>
      </View>
    </View>
  )
}

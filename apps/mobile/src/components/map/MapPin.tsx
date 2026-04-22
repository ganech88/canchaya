// Pin editorial con punta triangular — ocupa posición absoluta en el mapa.
// Variantes: default (paper), active (accent lima), hot (rojo).

import { View, Text } from 'react-native'
import { cn } from '@canchaya/ui'

export type PinVariant = 'default' | 'active' | 'hot'

interface Props {
  /** Posición horizontal dentro del contenedor, en porcentaje (0-100). */
  left: number
  /** Posición vertical dentro del contenedor, en porcentaje (0-100). */
  top: number
  priceK: number
  variant?: PinVariant
}

const variantClass: Record<PinVariant, string> = {
  default: 'bg-cy-paper',
  active: 'bg-cy-accent',
  hot: 'bg-cy-red',
}

function formatK(v: number): string {
  return v % 1 === 0 ? `$${v}K` : `$${v.toFixed(1)}K`
}

export function MapPin({ left, top, priceK, variant = 'default' }: Props) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        // Ancla: centro-horizontal, borde inferior coincide con la punta del pin.
        transform: [{ translateX: -24 }, { translateY: -32 }],
      }}
    >
      <View className={cn('border-card border-cy-line px-2 py-1', variantClass[variant])}>
        <Text className="font-display text-[14px] leading-[12px] tracking-tight text-cy-ink">
          {formatK(priceK)}
        </Text>
      </View>
      {/* Punta triangular negra */}
      <View
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -8,
          marginLeft: -6,
          width: 0,
          height: 0,
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderTopWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#0d0d0d',
        }}
      />
    </View>
  )
}

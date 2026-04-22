import { View, Text, Pressable } from 'react-native'
import { Icon } from '@/lib/icon'

interface Props {
  missing?: number
  venue?: string
  timeLabel?: string
  onPress?: () => void
}

export function OpenMatchPromo({
  missing = 2,
  venue = 'El Potrero',
  timeLabel = 'Hoy 21:00',
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress} className="border-card border-cy-line flex-row bg-cy-accent active:opacity-90">
      <View className="flex-1 px-3.5 py-3">
        <Text className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-ink">
          § PARTIDO ABIERTO
        </Text>
        <Text className="mt-1 font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
          FALTAN{'\n'}
          {missing} JUGADORES
        </Text>
        <Text className="mt-1.5 font-ui text-[11px] text-cy-ink">
          F5 · {venue} · {timeLabel}
        </Text>
      </View>
      <View className="w-[72px] items-center justify-center bg-cy-ink">
        <Icon name="arrow" size={28} color="#c6ff1a" />
      </View>
    </Pressable>
  )
}

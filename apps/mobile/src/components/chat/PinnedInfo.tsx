import { View, Text, Pressable } from 'react-native'

interface Props {
  address: string
  perPlayer: string // '$2.6K p/u'
  onPress?: () => void
}

export function PinnedInfo({ address, perPlayer, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between border-b-card border-cy-line bg-cy-accent px-3.5 py-2.5 active:opacity-90"
    >
      <View>
        <Text className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-ink">
          📍 UBICACIÓN · APORTE
        </Text>
        <Text className="mt-0.5 font-mono text-[11px] text-cy-ink">
          {address} · {perPlayer}
        </Text>
      </View>
      <Text className="font-mono text-[10px] font-bold uppercase text-cy-ink">Ver ▸</Text>
    </Pressable>
  )
}

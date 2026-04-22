import { View, Text, Pressable } from 'react-native'
import { Chip } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'

interface Props {
  matchDateLabel: string // 'HOY 21:00'
  venueTitle: string // 'EL POTRERO · F5'
  spotsFilled: number
  spotsTotal: number
  onBack?: () => void
}

export function ChatHeader({
  matchDateLabel,
  venueTitle,
  spotsFilled,
  spotsTotal,
  onBack,
}: Props) {
  return (
    <View className="flex-row items-center gap-2.5 border-b-card border-cy-line bg-cy-ink px-3.5 py-3">
      <Pressable onPress={onBack} hitSlop={8}>
        <Icon name="back" size={18} color="#c6ff1a" />
      </Pressable>
      <View className="flex-1">
        <Text className="font-mono text-[9px] uppercase tracking-widest text-cy-accent opacity-70">
          § PARTIDO · {matchDateLabel}
        </Text>
        <Text className="font-display text-[16px] leading-[14px] tracking-tight text-cy-accent">
          {venueTitle}
        </Text>
      </View>
      <Chip variant="accent">
        {spotsFilled}/{spotsTotal}
      </Chip>
    </View>
  )
}

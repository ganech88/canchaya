import { View, Text } from 'react-native'

interface Props {
  label: string
}

export function DayDivider({ label }: Props) {
  return (
    <View className="my-0.5 flex-row items-center gap-2">
      <View className="h-[1.5px] flex-1 bg-cy-line" />
      <Text className="font-mono text-[9px] uppercase tracking-widest text-cy-muted">{label}</Text>
      <View className="h-[1.5px] flex-1 bg-cy-line" />
    </View>
  )
}

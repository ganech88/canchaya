import type { ReactNode } from 'react'
import { View, Text } from 'react-native'

interface Props {
  label: string
  right?: ReactNode
  children: ReactNode
  className?: string
}

export function FilterSection({ label, right, children, className }: Props) {
  return (
    <View className={className}>
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className="font-mono text-[10px] font-bold uppercase text-cy-ink">{label}</Text>
        {right}
      </View>
      {children}
    </View>
  )
}

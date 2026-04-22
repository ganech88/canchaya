import type { ReactNode } from 'react'
import { View, Text, type ViewStyle } from 'react-native'
import { cn } from '../cn'

export type ChipVariant = 'outline' | 'fill' | 'accent'

interface ChipProps {
  variant?: ChipVariant
  children: ReactNode
  className?: string
  style?: ViewStyle
}

const variantClass: Record<ChipVariant, { container: string; text: string }> = {
  outline: { container: 'bg-transparent border-cy-line', text: 'text-cy-ink' },
  fill: { container: 'bg-cy-ink border-cy-line', text: 'text-cy-bg' },
  accent: { container: 'bg-cy-accent border-cy-ink', text: 'text-cy-ink' },
}

export function Chip({ variant = 'outline', children, className, style }: ChipProps) {
  const v = variantClass[variant]
  return (
    <View
      className={cn('flex-row items-center border-chip px-2.5 py-1', v.container, className)}
      style={style}
    >
      <Text className={cn('font-mono text-[10px] font-bold uppercase tracking-wider', v.text)}>
        {children}
      </Text>
    </View>
  )
}

import { View, Text, Pressable } from 'react-native'
import { cn } from '@canchaya/ui'

export const DEFAULT_HOURS = ['18', '19', '20', '21', '22'] as const
export type Hour = (typeof DEFAULT_HOURS)[number] | string

interface Props {
  hours?: readonly string[]
  active: string | null
  onChange?: (h: string) => void
}

export function TimeSlotGrid({ hours = DEFAULT_HOURS, active, onChange }: Props) {
  return (
    <View className="flex-row gap-1">
      {hours.map((h) => {
        const isActive = h === active
        return (
          <Pressable
            key={h}
            onPress={() => onChange?.(h)}
            className={cn(
              'flex-1 items-center justify-center border-chip border-cy-line py-2',
              isActive ? 'bg-cy-ink' : 'bg-cy-paper',
            )}
          >
            <Text
              className={cn(
                'font-display text-[16px] leading-[14px] tracking-tight',
                isActive ? 'text-cy-accent' : 'text-cy-ink',
              )}
            >
              {h}h
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

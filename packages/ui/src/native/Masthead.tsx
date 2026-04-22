import type { ReactNode } from 'react'
import { View, Text } from 'react-native'
import { cn } from '../cn'

interface MastheadProps {
  dateStr?: string
  issue?: string
  section?: string
  title?: ReactNode
  sub?: ReactNode
  className?: string
}

export function Masthead({ dateStr, issue, section, title, sub, className }: MastheadProps) {
  return (
    <View className={cn('border-b-card border-cy-line bg-cy-paper', className)}>
      {(dateStr || issue) && (
        <View className="flex-row items-center justify-between border-b border-cy-line px-4 py-2">
          {dateStr && (
            <Text className="font-mono text-[10px] uppercase tracking-wider text-cy-ink">
              {dateStr}
            </Text>
          )}
          {issue && (
            <Text className="font-mono text-[10px] uppercase tracking-wider text-cy-ink">
              {issue}
            </Text>
          )}
        </View>
      )}
      {section && (
        <View className="flex-row items-baseline gap-2 px-4 pb-1 pt-2.5">
          <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § {section}
          </Text>
          <View className="ml-1.5 h-[1.5px] flex-1 bg-cy-line" />
        </View>
      )}
      {typeof title === 'string' ? (
        <Text className="px-4 pb-0.5 pt-1 font-display text-[40px] leading-[36px] tracking-tight text-cy-ink">
          {title}
        </Text>
      ) : (
        <View className="px-4 pb-0.5 pt-1">{title}</View>
      )}
      {typeof sub === 'string' ? (
        <Text className="px-4 pb-3 text-[13px] text-cy-muted">{sub}</Text>
      ) : (
        sub && <View className="px-4 pb-3">{sub}</View>
      )}
    </View>
  )
}

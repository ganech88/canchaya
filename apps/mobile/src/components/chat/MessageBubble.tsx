import { View, Text } from 'react-native'
import { cn } from '@canchaya/ui'

interface Props {
  text: string
  side: 'me' | 'other'
  from?: string // nombre para cabecera (solo si side='other')
  nameColor?: 'ink' | 'red' | 'field'
}

const nameColorClass: Record<NonNullable<Props['nameColor']>, string> = {
  ink: 'text-cy-ink',
  red: 'text-cy-red',
  field: 'text-cy-field',
}

export function MessageBubble({ text, side, from, nameColor = 'ink' }: Props) {
  const isMe = side === 'me'
  return (
    <View className={cn('max-w-[78%]', isMe ? 'self-end' : 'self-start')}>
      {!isMe && from && (
        <Text
          className={cn(
            'mb-0.5 font-mono text-[9px] font-bold uppercase tracking-widest',
            nameColorClass[nameColor],
          )}
        >
          {from}
        </Text>
      )}
      <View
        className={cn(
          'border-chip border-cy-line px-2.5 py-2',
          isMe ? 'bg-cy-ink' : 'bg-cy-paper',
        )}
      >
        <Text className={cn('font-ui text-[13px]', isMe ? 'text-cy-accent' : 'text-cy-ink')}>
          {text}
        </Text>
      </View>
    </View>
  )
}

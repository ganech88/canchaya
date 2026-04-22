import { useState } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { Icon } from '@/lib/icon'

interface Props {
  onSend?: (text: string) => void
}

export function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend?.(trimmed)
    setValue('')
  }

  return (
    <View className="flex-row gap-2 border-t-card border-cy-line bg-cy-paper p-2.5">
      <View className="flex-1 border-chip border-cy-line px-3 py-2.5">
        <TextInput
          value={value}
          onChangeText={setValue}
          onSubmitEditing={handleSend}
          placeholder="Escribí algo…"
          placeholderTextColor="#6b6557"
          className="font-ui text-[13px] text-cy-ink"
          style={{ padding: 0 }}
          returnKeyType="send"
        />
      </View>
      <Pressable
        onPress={handleSend}
        className="items-center justify-center border-chip border-cy-line bg-cy-ink px-3.5 active:opacity-80"
      >
        <Icon name="arrow" size={16} color="#c6ff1a" />
      </Pressable>
    </View>
  )
}

import { View, Text } from 'react-native'

interface Props {
  children: string
}

export function SystemMessage({ children }: Props) {
  return (
    <View
      className="self-center border border-dashed border-cy-line px-2.5 py-1"
    >
      <Text className="font-mono text-[10px] uppercase tracking-wider text-cy-muted">
        {children}
      </Text>
    </View>
  )
}

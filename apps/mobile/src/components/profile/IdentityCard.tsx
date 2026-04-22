import { View, Text } from 'react-native'
import { Chip, Placeholder } from '@canchaya/ui/native'

interface Props {
  memberNumber: string
  memberSince: number
  name: string
  tags: string[]
}

export function IdentityCard({ memberNumber, memberSince, name, tags }: Props) {
  return (
    <View className="flex-row items-center gap-3.5 border-b-card border-cy-line bg-cy-paper px-4 pb-2.5 pt-3.5">
      <Placeholder variant="accent" className="h-[80px] w-[80px]" label="AVA" />

      <View className="shrink">
        <Text className="font-mono text-[9px] uppercase tracking-widest text-cy-muted">
          N°{memberNumber} · Desde {memberSince}
        </Text>
        <Text className="mt-0.5 font-display text-[26px] leading-[22px] tracking-tight text-cy-ink">
          {name}
        </Text>
        <View className="mt-1 flex-row flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <Chip key={t} variant={i === 0 ? 'fill' : 'outline'}>
              {t}
            </Chip>
          ))}
        </View>
      </View>
    </View>
  )
}

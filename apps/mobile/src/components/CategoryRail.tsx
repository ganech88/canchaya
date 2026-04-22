import { Pressable, ScrollView } from 'react-native'
import { Chip } from '@canchaya/ui/native'

const CATEGORIES = ['TODO', 'FÚTBOL 5', 'FÚTBOL 8', 'FÚTBOL 11', 'PÁDEL', 'TENIS'] as const
export type Category = (typeof CATEGORIES)[number]

interface Props {
  active: Category
  onChange?: (c: Category) => void
}

export function CategoryRail({ active, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingRight: 16 }}
    >
      {CATEGORIES.map((c) => (
        <Pressable key={c} onPress={() => onChange?.(c)}>
          <Chip variant={c === active ? 'fill' : 'outline'}>{c}</Chip>
        </Pressable>
      ))}
    </ScrollView>
  )
}

export const CATEGORY_LIST = CATEGORIES

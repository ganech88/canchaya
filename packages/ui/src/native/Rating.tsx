import { View, Text } from 'react-native'
import { cn } from '../cn'

interface RatingProps {
  value: number
  count?: number
  className?: string
}

export function Rating({ value, count, className }: RatingProps) {
  return (
    <View className={cn('flex-row items-center gap-1', className)}>
      {/* Estrella simplificada como carácter — el Icon requiere pasar SVG desde el app */}
      <Text className="font-mono text-[11px] font-bold text-cy-ink">★</Text>
      <Text className="font-mono text-[11px] font-bold text-cy-ink">{value.toFixed(1)}</Text>
      {typeof count === 'number' && (
        <Text className="font-mono text-[10px] text-cy-muted">({count})</Text>
      )}
    </View>
  )
}

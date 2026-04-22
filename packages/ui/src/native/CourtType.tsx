import { View, Text } from 'react-native'
import { cn } from '../cn'

interface CourtTypeProps {
  type: string
  className?: string
}

export function CourtType({ type, className }: CourtTypeProps) {
  const isPadel = /pádel|padel/i.test(type)
  return (
    <View
      className={cn(
        'flex-row items-center gap-1.5 border-chip border-cy-line px-2 py-0.5',
        className,
      )}
    >
      {/* El icon real lo inyecta el app consumidor; acá dejamos el bullet de tipo como fallback */}
      <Text className="font-mono text-[10px] text-cy-ink">{isPadel ? '▢' : '●'}</Text>
      <Text className="font-mono text-[10px] font-bold uppercase tracking-wide text-cy-ink">
        {type}
      </Text>
    </View>
  )
}

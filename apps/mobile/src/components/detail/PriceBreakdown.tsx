import { View, Text } from 'react-native'

export interface PriceLine {
  label: string
  amount: string // preformateado: "$18.000"
}

interface Props {
  lines: PriceLine[]
  totalLabel?: string
  totalAmount: string
}

export function PriceBreakdown({ lines, totalLabel = 'TOTAL', totalAmount }: Props) {
  return (
    <View className="border-card border-cy-line bg-cy-paper">
      {lines.map((line, i) => (
        <View
          key={line.label}
          className={
            'flex-row items-center justify-between px-3 py-2.5 ' +
            (i < lines.length - 1 ? 'border-b-chip border-cy-line' : 'border-b-chip border-cy-line')
          }
        >
          <Text className="font-mono text-[11px] text-cy-ink">{line.label}</Text>
          <Text className="font-mono text-[11px] text-cy-ink">{line.amount}</Text>
        </View>
      ))}
      <View className="flex-row items-center justify-between bg-cy-ink px-3 py-3">
        <Text className="font-display text-[18px] leading-[16px] tracking-tight text-cy-accent">
          {totalLabel}
        </Text>
        <Text className="font-display text-[24px] leading-[20px] tracking-tight text-cy-accent">
          {totalAmount}
        </Text>
      </View>
    </View>
  )
}

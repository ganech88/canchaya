// Grid 5x2 de jugadores. Cada celda puede ser:
//   - "me"     → fondo ink, texto accent, label "YO"
//   - "filled" → fondo sand, número 02..08
//   - "empty"  → fondo paper, signo "+", footer "FALTA" en rojo

import { View, Text } from 'react-native'
import { cn } from '@canchaya/ui'

export type PlayerCellState = 'me' | 'filled' | 'empty'

export interface PlayerCell {
  number: number // 1..n
  state: PlayerCellState
}

interface Props {
  cells: PlayerCell[]
  columns?: number
}

export function PlayersGrid({ cells, columns = 5 }: Props) {
  const widthPct = `${Math.floor(100 / columns) - 1.5}%`

  return (
    <View className="flex-row flex-wrap" style={{ gap: 6 }}>
      {cells.map((cell) => {
        const bg =
          cell.state === 'me'
            ? 'bg-cy-ink'
            : cell.state === 'filled'
              ? 'bg-cy-sand'
              : 'bg-cy-paper'
        const fg = cell.state === 'me' ? 'text-cy-accent' : 'text-cy-ink'
        const label =
          cell.state === 'me'
            ? 'YO'
            : cell.state === 'filled'
              ? String(cell.number).padStart(2, '0')
              : '+'
        return (
          <View
            key={cell.number}
            className={cn('relative aspect-square items-center justify-center border-chip border-cy-line', bg)}
            style={{ width: widthPct as `${number}%` }}
          >
            <Text
              className={cn(
                'font-display text-[18px] leading-[16px] tracking-tight',
                fg,
              )}
            >
              {label}
            </Text>
            {cell.state === 'empty' && (
              <Text
                className="absolute font-mono text-[7px] font-bold text-cy-red"
                style={{ bottom: 2 }}
              >
                FALTA
              </Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

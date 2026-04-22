// RN version — no soporta background-image con repeating-linear-gradient sin una librería extra.
// Para el handoff inicial usamos un color plano + label. Cuando integremos fotos reales, este
// placeholder desaparece. Si quisiéramos el patrón rayado exacto en RN, tocaría react-native-svg.

import type { ReactNode } from 'react'
import { View, Text, type ViewStyle } from 'react-native'
import { cn } from '../cn'

export type PlaceholderVariant = 'default' | 'accent' | 'field' | 'dark'

interface PlaceholderProps {
  variant?: PlaceholderVariant
  label?: string
  children?: ReactNode
  className?: string
  style?: ViewStyle
}

const variantClass: Record<PlaceholderVariant, { bg: string; text: string; border: string }> = {
  default: { bg: 'bg-cy-sand', text: 'text-cy-muted', border: 'border-cy-line' },
  accent: { bg: 'bg-cy-accent', text: 'text-cy-ink', border: 'border-cy-ink' },
  field: { bg: 'bg-cy-field', text: 'text-cy-accent', border: 'border-cy-field-2' },
  dark: { bg: 'bg-cy-dark', text: 'text-cy-accent', border: 'border-cy-dark' },
}

export function Placeholder({
  variant = 'default',
  label,
  children,
  className,
  style,
}: PlaceholderProps) {
  const v = variantClass[variant]
  return (
    <View
      className={cn(
        'items-center justify-center overflow-hidden border-chip',
        v.bg,
        v.border,
        className,
      )}
      style={style}
    >
      {label && (
        <Text
          className={cn('font-mono text-[10px] uppercase tracking-wider', v.text)}
        >
          {label}
        </Text>
      )}
      {children}
    </View>
  )
}

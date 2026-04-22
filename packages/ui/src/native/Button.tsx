import type { ReactNode } from 'react'
import { Pressable, Text, type ViewStyle } from 'react-native'
import { cn } from '../cn'

export type ButtonVariant = 'ink' | 'accent' | 'ghost'

interface ButtonProps {
  variant?: ButtonVariant
  children: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onPress?: () => void
  disabled?: boolean
  className?: string
  style?: ViewStyle
}

const variantClass: Record<ButtonVariant, { container: string; text: string }> = {
  ink: { container: 'bg-cy-ink border-cy-line', text: 'text-cy-bg' },
  accent: { container: 'bg-cy-accent border-cy-line', text: 'text-cy-ink' },
  ghost: { container: 'bg-transparent border-cy-line', text: 'text-cy-ink' },
}

export function Button({
  variant = 'ink',
  children,
  leftIcon,
  rightIcon,
  onPress,
  disabled,
  className,
  style,
}: ButtonProps) {
  const v = variantClass[variant]
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'flex-row items-center justify-center gap-2 border-card px-[18px] py-[14px]',
        v.container,
        className,
      )}
      style={({ pressed }) => [
        { opacity: disabled ? 0.4 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
        style,
      ]}
    >
      {leftIcon}
      <Text className={cn('font-ui text-sm font-bold uppercase tracking-wide', v.text)}>
        {children}
      </Text>
      {rightIcon}
    </Pressable>
  )
}

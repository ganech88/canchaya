import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../cn'

export type ButtonVariant = 'ink' | 'accent' | 'ghost'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant
  children: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  ink: 'bg-cy-ink text-cy-bg',
  accent: 'bg-cy-accent text-cy-ink',
  ghost: 'bg-transparent text-cy-ink',
}

export function Button({
  variant = 'ink',
  children,
  leftIcon,
  rightIcon,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 border-card border-cy-line',
        'px-[18px] py-[14px] font-ui text-sm font-bold uppercase tracking-wide',
        'transition-transform active:scale-[0.97]',
        'disabled:opacity-40 disabled:pointer-events-none',
        variantClass[variant],
        className,
      )}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}

// BottomNav RN — requiere que el app pase un componente `IconComponent` que sepa renderizar
// iconos (típicamente el factory `createNativeIcon(svg)`). Así el package ui no depende de
// react-native-svg directamente.

import type { ComponentType } from 'react'
import { Pressable, View, Text } from 'react-native'
import { cn } from '../cn'
import type { IconName } from '../icons'

export type BottomNavKey = 'home' | 'map' | 'match' | 'chat' | 'me'

interface NavItem {
  id: BottomNavKey
  label: string
  icon: IconName
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'map', label: 'Mapa', icon: 'map' },
  { id: 'match', label: 'Partidos', icon: 'bolt' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'me', label: 'Yo', icon: 'user' },
]

interface BottomNavProps {
  active: BottomNavKey
  onPress?: (key: BottomNavKey) => void
  IconComponent: ComponentType<{ name: IconName; size?: number; color?: string }>
}

export function BottomNav({ active, onPress, IconComponent }: BottomNavProps) {
  return (
    <View className="flex-row border-t-card border-cy-line bg-cy-paper">
      {NAV_ITEMS.map((item, i) => {
        const isActive = item.id === active
        return (
          <Pressable
            key={item.id}
            onPress={() => onPress?.(item.id)}
            className={cn(
              'flex-1 items-center gap-[3px] px-0 pb-2 pt-2.5',
              i < NAV_ITEMS.length - 1 && 'border-r-chip border-cy-line',
              isActive ? 'bg-cy-ink' : 'bg-transparent',
            )}
          >
            <IconComponent
              name={item.icon}
              size={18}
              color={isActive ? '#c6ff1a' : '#0d0d0d'}
            />
            <Text
              className={cn(
                'font-mono text-[9px] font-bold uppercase tracking-wider',
                isActive ? 'text-cy-accent' : 'text-cy-ink',
              )}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

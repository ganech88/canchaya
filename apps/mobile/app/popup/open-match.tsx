// ScreenPopup (/popup/open-match) — modal transparente sobre el screen anterior.
// Layout: overlay oscuro + notification bar en accent arriba + dialog pegado al fondo.

import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { Button, Chip, Placeholder } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'
import { cn } from '@canchaya/ui'

export default function OpenMatchPopup() {
  const close = () => router.back()

  const stats = [
    { key: 'Aporte', value: '$2.6K' },
    { key: 'Distancia', value: '0.8K' },
    { key: 'Jugadores', value: '8/10' },
  ]

  return (
    <View className="flex-1">
      {/* Overlay oscuro: tap para cerrar */}
      <Pressable
        onPress={close}
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(13,13,13,0.55)' }}
      />

      {/* Notification bar top */}
      <View style={{ position: 'absolute', left: 12, right: 12, top: 46 }}>
        <View className="border-card border-cy-line bg-cy-accent px-3 py-2.5">
          <View className="flex-row items-center gap-2">
            <Icon name="bolt" size={12} color="#0d0d0d" />
            <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-ink">
              PARTIDO CERCA · 0.8 KM
            </Text>
          </View>
          <Text className="mt-1 font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
            ¿TE SUMÁS?
          </Text>
        </View>
      </View>

      {/* Dialog bottom */}
      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
        <View className="border-card border-cy-line bg-cy-paper">
          {/* Header ink */}
          <View className="flex-row items-center justify-between bg-cy-ink px-3 py-2">
            <Text className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-accent">
              § CONVOCATORIA · URGENTE
            </Text>
            <Pressable onPress={close} hitSlop={8}>
              <Icon name="close" size={14} color="#c6ff1a" />
            </Pressable>
          </View>

          {/* Hero */}
          <View>
            <Placeholder
              variant="field"
              className="h-[90px] w-full border-0 border-b-chip border-cy-line"
              label="EL POTRERO · F5"
            />
          </View>

          {/* Content */}
          <View className="px-3 py-2.5">
            <Text className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
              FALTAN{'\n'}DOS.
            </Text>
            <View className="mt-1.5 flex-row flex-wrap items-center">
              <Text className="font-mono text-[11px] text-cy-muted">
                Partido armado por{' '}
              </Text>
              <Text className="font-mono text-[11px] font-bold text-cy-ink">Martín</Text>
              <Text className="font-mono text-[11px] text-cy-muted">
                {' · Hoy 21:00 · Nivel intermedio'}
              </Text>
            </View>

            {/* Tags */}
            <View className="mt-2 flex-row gap-1.5">
              <Chip variant="outline">NIV · INTERMEDIO</Chip>
              <Chip variant="fill">F5</Chip>
            </View>

            {/* 3-col stats */}
            <View className="mt-2.5 flex-row border-chip border-cy-line">
              {stats.map((s, i) => (
                <View
                  key={s.key}
                  className={cn(
                    'flex-1 p-2',
                    i < stats.length - 1 && 'border-r-chip border-cy-line',
                  )}
                >
                  <Text className="font-mono text-[9px] uppercase text-cy-muted">{s.key}</Text>
                  <Text className="mt-0.5 font-display text-[18px] leading-[16px] tracking-tight text-cy-ink">
                    {s.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* CTAs */}
            <View className="mt-3 flex-row gap-2">
              <Button variant="ghost" onPress={close} className="flex-1">
                Ahora no
              </Button>
              <Button
                variant="accent"
                onPress={close}
                className="flex-[2]"
                rightIcon={<Icon name="arrow" size={14} color="#0d0d0d" />}
              >
                Me sumo
              </Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

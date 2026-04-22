// ScreenOpenMatch (/match/new) — crear convocatoria para un turno ya reservado.

import { useMemo, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Masthead, Button } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'
import { BookingBanner } from '@/components/match/BookingBanner'
import { PlayersGrid, type PlayerCell } from '@/components/match/PlayersGrid'
import { LevelFilter, type MatchLevelKey } from '@/components/match/LevelFilter'
import { ReachCard } from '@/components/match/ReachCard'

const TOTAL_SPOTS = 10
const FILLED = 8 // 8 confirmados del mock (1 = YO, 2-8 = filled, 9-10 = empty)

function buildCells(): PlayerCell[] {
  const cells: PlayerCell[] = []
  for (let i = 1; i <= TOTAL_SPOTS; i++) {
    if (i === 1) cells.push({ number: i, state: 'me' })
    else if (i <= FILLED) cells.push({ number: i, state: 'filled' })
    else cells.push({ number: i, state: 'empty' })
  }
  return cells
}

export default function OpenMatchNew() {
  const [level, setLevel] = useState<MatchLevelKey>('INTERMEDIO')
  const cells = useMemo(buildCells, [])

  const totalCourt = 26000
  const contribution = Math.round(totalCourt / TOTAL_SPOTS) // $2.600

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <Masthead
        section="PARTIDO ABIERTO"
        title="FALTAN."
        sub="Publicá tu convocatoria. Los que estén cerca la verán."
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cancha reservada */}
        <View className="px-4 pb-2.5 pt-3.5">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cy-ink">
            Cancha reservada
          </Text>
          <BookingBanner
            venue="EL POTRERO"
            sport="F5"
            dateLabel="Hoy · 21:00"
            durationLabel="1 h"
          />
        </View>

        {/* Jugadores */}
        <View className="px-4 pb-2.5 pt-2">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cy-ink">
            Jugadores
          </Text>
          <PlayersGrid cells={cells} />
          <Text className="mt-2 font-mono text-[10px] text-cy-muted">
            {FILLED} / {TOTAL_SPOTS} confirmados —{' '}
            <Text className="font-bold text-cy-red">FALTAN {TOTAL_SPOTS - FILLED}</Text>
          </Text>
        </View>

        {/* Nivel */}
        <View className="px-4 pb-2.5 pt-1">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cy-ink">
            Nivel · Abierto a
          </Text>
          <LevelFilter active={level} onChange={setLevel} />
        </View>

        {/* Aporte por jugador */}
        <View className="px-4 pb-2.5 pt-1">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cy-ink">
            Aporte / jugador
          </Text>
          <View className="flex-row items-end justify-between border-card border-cy-line bg-cy-paper px-3 py-2.5">
            <Text className="font-display text-[26px] leading-[22px] tracking-tight text-cy-ink">
              ${contribution.toLocaleString('es-AR')}
            </Text>
            <Text className="font-mono text-[10px] text-cy-muted">
              ${(totalCourt / 1000).toFixed(0)}K ÷ {TOTAL_SPOTS}
            </Text>
          </View>
        </View>

        {/* Alcance */}
        <View className="px-4 pb-2.5 pt-2">
          <ReachCard count={340} radiusKm={3} />
        </View>
      </ScrollView>

      {/* CTA sticky */}
      <View className="border-t-card border-cy-line bg-cy-paper p-3">
        <Button
          variant="accent"
          onPress={() => router.back()}
          className="w-full"
          rightIcon={<Icon name="arrow" size={14} color="#0d0d0d" />}
        >
          Publicar convocatoria
        </Button>
      </View>
    </SafeAreaView>
  )
}

// ScreenDetail (/court/[id]) — ficha de cancha con calendario de turnos.
// Flujo: elegir día → elegir hora → revisar precio → "Reservar y pagar".

import { useMemo, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Button, Rating } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'
import { MOCK_COURTS } from '@/data/courts'
import { DetailHero } from '@/components/detail/DetailHero'
import { StatsStrip } from '@/components/detail/StatsStrip'
import { DayStrip, type Day } from '@/components/detail/DayStrip'
import { HourGrid, type HourSlot } from '@/components/detail/HourGrid'
import { PriceBreakdown } from '@/components/detail/PriceBreakdown'

// Week strip: las letras L–D con números 20..26 — mock del handoff.
const DAYS: Day[] = [
  { letter: 'L', number: 20 },
  { letter: 'M', number: 21 },
  { letter: 'X', number: 22 },
  { letter: 'J', number: 23 },
  { letter: 'V', number: 24 },
  { letter: 'S', number: 25 },
  { letter: 'D', number: 26 },
]

const ALL_HOURS = ['16', '17', '18', '19', '20', '21', '22', '23']
const BUSY_HOURS = new Set(['17', '19', '22'])

function formatARS(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

export default function CourtDetail() {
  const params = useLocalSearchParams<{ id: string }>()
  const courtId = Number(params.id)
  const court = MOCK_COURTS.find((c) => c.id === courtId) ?? MOCK_COURTS[0]!

  const [favorited, setFavorited] = useState(false)
  const [dayIndex, setDayIndex] = useState(2) // miércoles · Mar 22 activo en el mock
  const [pickedHour, setPickedHour] = useState<string | null>('20')

  const slots: HourSlot[] = useMemo(
    () =>
      ALL_HOURS.map((h) => ({
        hour: h,
        state: h === pickedHour ? 'picked' : BUSY_HOURS.has(h) ? 'busy' : 'available',
      })),
    [pickedHour],
  )

  const courtPrice = court.price
  const ballRent = 800
  const total = courtPrice + ballRent

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <DetailHero
          onBack={() => router.back()}
          onToggleFavorite={() => setFavorited((v) => !v)}
          favorited={favorited}
          sportLabel={`${court.type.toUpperCase().replace('FÚTBOL', 'F').replace(' ', '')}${court.type.toLowerCase().includes('fútbol') ? ' · TECHADA' : ''}`}
        />

        {/* Title block */}
        <View className="border-b-card border-cy-line bg-cy-paper px-4 pb-2 pt-4">
          <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § FICHA · N°{String(court.id).padStart(3, '0')}
          </Text>
          <Text className="mt-1 font-display text-[40px] leading-[36px] tracking-tight text-cy-ink">
            {court.name}
          </Text>
          <View className="mt-2 flex-row items-center gap-3">
            <Rating value={court.rating} count={court.reviews} />
            <Text className="font-mono text-[10px] text-cy-muted">·</Text>
            <Text className="font-mono text-[10px] uppercase text-cy-ink">{court.zone}</Text>
          </View>
        </View>

        <StatsStrip
          stats={[
            { key: 'Canchas', value: '04' },
            { key: 'Abierto', value: '24/7' },
            { key: 'Piso', value: 'Sint.' },
          ]}
        />

        {/* Calendar */}
        <View className="px-4 pt-3.5">
          <View className="mb-2.5 flex-row items-end justify-between">
            <Text className="font-condensed text-[22px] leading-[21px] uppercase text-cy-ink">
              Turnos · Mié {DAYS[dayIndex]?.number}
            </Text>
            <Text className="font-mono text-[10px] uppercase text-cy-ink">◀ HOY ▶</Text>
          </View>
          <View className="h-1 bg-cy-line" />
          <View className="mt-2.5">
            <DayStrip days={DAYS} activeIndex={dayIndex} onChange={setDayIndex} />
          </View>

          <Text className="mb-1.5 mt-3.5 font-mono text-[10px] uppercase text-cy-muted">
            Disponibilidad
          </Text>
          <HourGrid slots={slots} onPickHour={setPickedHour} />
        </View>

        {/* Price break */}
        <View className="px-4 pb-3.5 pt-3.5">
          <PriceBreakdown
            lines={[
              {
                label: `Cancha · 1 h · ${pickedHour ?? '--'}:00`,
                amount: formatARS(courtPrice),
              },
              { label: 'Alquiler pelota', amount: formatARS(ballRent) },
            ]}
            totalAmount={formatARS(total)}
          />
        </View>

        {/* CTA */}
        <View className="px-4 pb-4">
          <Button
            variant="accent"
            disabled={!pickedHour}
            onPress={() => {
              // TODO: intercalar flujo de pago (Mercado Pago) — por ahora asumimos éxito y abrimos el chat del partido.
              router.push(`/chat/${court.id}` as never)
            }}
            className="w-full"
            rightIcon={<Icon name="arrow" size={14} color="#0d0d0d" />}
          >
            Reservar y pagar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// ScreenSearch — búsqueda activa + panel de filtros + lista de resultados + CTA sticky.

import { useState } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Button } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'
import { MOCK_COURTS } from '@/data/courts'
import { CourtRow } from '@/components/CourtRow'
import { SearchHeader } from '@/components/search/SearchHeader'
import { FilterSection } from '@/components/search/FilterSection'
import { SportFilter, type SportKey } from '@/components/search/SportFilter'
import { PriceRangeSlider } from '@/components/search/PriceRangeSlider'
import { TimeSlotGrid } from '@/components/search/TimeSlotGrid'
import { ExtrasFilter, type ExtraKey } from '@/components/search/ExtrasFilter'

export default function Search() {
  const params = useLocalSearchParams<{ q?: string }>()
  const [query, setQuery] = useState(params.q ?? 'pádel palermo')
  const [sport, setSport] = useState<SportKey | null>('PÁDEL')
  const [hour, setHour] = useState<string | null>('19')
  const [extras, setExtras] = useState<ExtraKey[]>(['TECHADA', 'BAR'])

  const toggleExtra = (k: ExtraKey) => {
    setExtras((curr) => (curr.includes(k) ? curr.filter((x) => x !== k) : [...curr, k]))
  }

  // Mock de cantidad de resultados — cuando conectemos Supabase filtramos la query real.
  const results = MOCK_COURTS.slice(1)
  const resultsCount = 7

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <SearchHeader
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
        onBack={() => router.back()}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 12 }}>
        {/* Filtros */}
        <View className="border-b-chip border-cy-line px-4 py-3">
          <Text className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § FILTROS
          </Text>

          <FilterSection label="DEPORTE" className="mb-3.5">
            <SportFilter active={sport} onChange={setSport} />
          </FilterSection>

          <View className="mb-3.5">
            <PriceRangeSlider
              min={0}
              max={100}
              lowK={4}
              highK={12}
              absoluteMinK={0}
              absoluteMaxK={30}
            />
          </View>

          <FilterSection label="HORARIO · HOY" className="mb-3.5">
            <TimeSlotGrid active={hour} onChange={setHour} />
          </FilterSection>

          <FilterSection label="EXTRAS">
            <ExtrasFilter active={extras} onToggle={toggleExtra} />
          </FilterSection>
        </View>

        {/* Results header */}
        <View className="flex-row items-baseline justify-between px-4 pb-2 pt-3">
          <View className="flex-row items-baseline gap-2">
            <Text className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
              {String(resultsCount).padStart(2, '0')}
            </Text>
            <Text className="font-condensed text-[16px] uppercase text-cy-ink">Canchas</Text>
          </View>
          <Pressable className="flex-row items-center gap-1">
            <Text className="font-mono text-[10px] uppercase text-cy-ink">Orden · Cercanía</Text>
            <Icon name="chev" size={10} color="#0d0d0d" />
          </Pressable>
        </View>

        {/* List */}
        <View className="px-4">
          {results.map((court, i) => (
            <CourtRow
              key={court.id}
              court={court}
              showBorder={i < results.length - 1}
              onPress={() => router.push(`/court/${court.id}` as never)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="border-t-card border-cy-line bg-cy-paper p-3">
        <Button
          variant="accent"
          onPress={() => router.push('/map' as never)}
          className="w-full"
          rightIcon={<Icon name="arrow" size={14} color="#0d0d0d" />}
        >
          Ver en mapa
        </Button>
      </View>
    </SafeAreaView>
  )
}

// ScreenHome — portada estilo revista deportiva.
// Orden vertical: Masthead → Hero → Search → CategoryRail → FeaturedCard →
// OpenMatchPromo → Nearby list → BottomNav.

import { useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Masthead, BottomNav } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'
import { navigateBottomNav } from '@/lib/nav'
import { MOCK_COURTS } from '@/data/courts'
import { FeaturedCard } from '@/components/FeaturedCard'
import { CourtRow } from '@/components/CourtRow'
import { SearchBar } from '@/components/SearchBar'
import { CategoryRail, CATEGORY_LIST, type Category } from '@/components/CategoryRail'
import { OpenMatchPromo } from '@/components/OpenMatchPromo'

export default function Home() {
  const [category, setCategory] = useState<Category>(CATEGORY_LIST[0])

  const featured = MOCK_COURTS[0]
  const nearby = MOCK_COURTS.slice(1)

  if (!featured) return null

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <Masthead dateStr="ABR·22·2026" issue="ED. MATUTINA" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero title */}
        <View className="px-4 pb-2.5 pt-4">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § HOY · PALERMO
          </Text>
          <Text className="font-display text-[54px] leading-[47px] tracking-tight text-cy-ink">
            JUGÁ{'\n'}CERCA.
          </Text>
          <Text className="mt-1.5 max-w-[280px] font-ui text-[13px] text-cy-muted">
            12 canchas disponibles en los próximos 90 minutos a menos de 3 km.
          </Text>
        </View>

        {/* Search */}
        <View className="px-4 pb-3.5 pt-1.5">
          <SearchBar
            onPress={() => router.push('/search')}
            onFilterPress={() => router.push('/search')}
          />
        </View>

        {/* Category rail */}
        <View className="pb-3 pl-4">
          <CategoryRail active={category} onChange={setCategory} />
        </View>

        {/* Featured card */}
        <View className="px-4 pb-3.5">
          <FeaturedCard
            court={featured}
            onPress={() => router.push(`/court/${featured.id}` as never)}
          />
        </View>

        {/* Open match promo */}
        <View className="px-4 pb-3.5">
          <OpenMatchPromo onPress={() => router.push('/popup/open-match')} />
        </View>

        {/* Nearby list */}
        <View className="px-4">
          <View className="mb-2.5 flex-row items-baseline justify-between">
            <Text className="font-condensed text-[22px] leading-[21px] uppercase text-cy-ink">
              Cerca tuyo
            </Text>
            <Pressable
              className="flex-row items-center gap-1"
              onPress={() => router.push('/map')}
            >
              <Text className="font-mono text-[10px] uppercase text-cy-muted">Ver mapa</Text>
              <Icon name="arrow" size={12} color="#6b6557" />
            </Pressable>
          </View>
          <View className="h-1 bg-cy-line" />
          <View>
            {nearby.map((court, i) => (
              <CourtRow
                key={court.id}
                court={court}
                showBorder={i < nearby.length - 1}
                onPress={() => router.push(`/court/${court.id}` as never)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNav active="home" onPress={navigateBottomNav} IconComponent={Icon} />
    </SafeAreaView>
  )
}

// ScreenProfile (/profile) — identity + stats + breakdown por deporte + historial.

import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Masthead, BottomNav } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'
import { navigateBottomNav } from '@/lib/nav'
import { IdentityCard } from '@/components/profile/IdentityCard'
import { HeadlineStats } from '@/components/profile/HeadlineStats'
import { SportBreakdown } from '@/components/profile/SportBreakdown'
import { HistoryList } from '@/components/profile/HistoryList'

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <Masthead section="PERFIL · JUGADOR" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <IdentityCard
          memberNumber="0284"
          memberSince={2023}
          name="MARTÍN B."
          tags={['MVP · MAR', 'NIV. 7']}
        />

        <HeadlineStats
          stats={[
            { key: 'Partidos', value: '48' },
            { key: 'Goles', value: '37' },
            { key: 'Rating', value: '4.8' },
          ]}
          accentIndex={1}
        />

        {/* Por deporte */}
        <View className="px-4 pt-3.5">
          <Text className="mb-2 font-condensed text-[22px] leading-[21px] uppercase text-cy-ink">
            Por deporte
          </Text>
          <View className="h-1 bg-cy-line" />
          <SportBreakdown
            rows={[
              { sport: 'Fútbol 5', matches: 34, pct: 72 },
              { sport: 'Pádel', matches: 11, pct: 23 },
              { sport: 'Fútbol 8', matches: 3, pct: 5 },
            ]}
          />
        </View>

        {/* Historial */}
        <View className="px-4 pt-3.5">
          <Text className="mb-2 font-condensed text-[22px] leading-[21px] uppercase text-cy-ink">
            Historial
          </Text>
          <View className="h-1 bg-cy-line" />
          <HistoryList
            entries={[
              {
                id: 1,
                dayLabel: 'SAB',
                dayNumber: '20',
                title: 'La Bombonerita · F5',
                result: 'GANADO · 7-4',
                won: true,
              },
              {
                id: 2,
                dayLabel: 'MIE',
                dayNumber: '17',
                title: 'Pádel Club Sur',
                result: 'PERDIDO · 4-6 / 3-6',
                won: false,
              },
              {
                id: 3,
                dayLabel: 'DOM',
                dayNumber: '14',
                title: 'El Potrero · F8',
                result: 'GANADO · 9-6',
                won: true,
              },
            ]}
          />
        </View>
      </ScrollView>

      <BottomNav active="me" onPress={navigateBottomNav} IconComponent={Icon} />
    </SafeAreaView>
  )
}

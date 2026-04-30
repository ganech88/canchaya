// ScreenMap — mapa con pins (placeholder visual hasta integrar Mapbox).
// Layout: top search bar flotante + mapa (fondo verde con "calles" svg + pins + user dot + FAB) +
// bottom sheet con preview + BottomNav.

import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { BottomNav } from '@canchaya/ui/native'
import { fetchVenueList } from '@canchaya/db'
import { Icon } from '@/lib/icon'
import { navigateBottomNav } from '@/lib/nav'
import { MOCK_COURTS } from '@/data/courts'
import { venuesToMobileCourts } from '@/lib/adapters'
import { useNhostQuery } from '@/lib/useQuery'
import { MapPin, type PinVariant } from '@/components/map/MapPin'
import { MapSearchBar } from '@/components/map/MapSearchBar'
import { MapBottomSheet } from '@/components/map/MapBottomSheet'

// TODO: integrar Mapbox real (requiere @rnmapbox/maps + dev build con
// EAS — no funciona en Expo Go). Por ahora es un placeholder visual con
// pins posicionados manualmente. Cuando se integre, las coordenadas reales
// vienen de venues.latitude/longitude (ya están en el schema).

interface PinData {
  id: number
  left: number
  top: number
  priceK: number
  variant: PinVariant
}

const PINS: PinData[] = [
  { id: 1, left: 28, top: 24, priceK: 18, variant: 'active' },
  { id: 2, left: 62, top: 36, priceK: 9.5, variant: 'default' },
  { id: 3, left: 44, top: 54, priceK: 26, variant: 'hot' },
  { id: 4, left: 74, top: 58, priceK: 11, variant: 'default' },
  { id: 5, left: 22, top: 68, priceK: 14, variant: 'default' },
]

export default function Map() {
  const venuesQuery = useNhostQuery((nhost) => fetchVenueList(nhost, { limit: 6 }), [])
  const courts = venuesQuery.data ? venuesToMobileCourts(venuesQuery.data) : MOCK_COURTS
  const selected = courts[0] ?? MOCK_COURTS[0]!

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      {/* Map canvas */}
      <View className="relative flex-1 bg-cy-field">
        {/* Grid lines sobre el verde */}
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.18 }}
        >
          {/* "Calles" */}
          <Path d="M-20 180 Q 180 140 450 260" stroke="#fff" strokeWidth="6" fill="none" />
          <Path d="M80 -20 Q 120 240 200 620" stroke="#fff" strokeWidth="5" fill="none" />
          <Path d="M-20 430 Q 220 380 450 450" stroke="#fff" strokeWidth="4" fill="none" />
          <Path d="M280 -20 Q 260 300 340 620" stroke="#fff" strokeWidth="3" fill="none" />
        </Svg>

        {/* Top search bar flotante */}
        <View style={{ position: 'absolute', top: 12, left: 12, right: 12 }}>
          <MapSearchBar
            location="Palermo, CABA"
            onBack={() => router.back()}
            onFilterPress={() => router.push('/search')}
          />
        </View>

        {/* Pins */}
        {PINS.map((p) => (
          <MapPin
            key={p.id}
            left={p.left}
            top={p.top}
            priceK={p.priceK}
            variant={p.variant}
          />
        ))}

        {/* User dot con glow */}
        <View
          style={{
            position: 'absolute',
            left: '50%',
            top: '48%',
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: '#c6ff1a',
            borderWidth: 3,
            borderColor: '#0d0d0d',
            transform: [{ translateX: -9 }, { translateY: -9 }],
            shadowColor: '#c6ff1a',
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 0 },
            // Android: aproximación del glow
            elevation: 8,
          }}
        />

        {/* Recenter FAB */}
        <View
          style={{
            position: 'absolute',
            right: 14,
            bottom: 14,
          }}
        >
          <View className="h-[42px] w-[42px] items-center justify-center border-card border-cy-line bg-cy-paper">
            <Icon name="mapPin" size={18} color="#0d0d0d" />
          </View>
        </View>
      </View>

      {/* Bottom sheet */}
      <MapBottomSheet
        court={selected}
        onPressDetail={() => router.push(`/court/${selected.id}` as never)}
      />

      <BottomNav active="map" onPress={navigateBottomNav} IconComponent={Icon} />
    </SafeAreaView>
  )
}

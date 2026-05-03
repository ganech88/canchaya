// ScreenMap — mapa con pins. Si `@rnmapbox/maps` está disponible (dev build con
// EAS) y EXPO_PUBLIC_MAPBOX_TOKEN está configurado, renderiza el mapa real con
// las coordenadas de los venues. En caso contrario (Expo Go o sin token), cae
// al placeholder SVG con pins posicionados manualmente — útil para iterar el
// layout sin requerir dev build.

import { useState } from 'react'
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
import { MapboxMap, type VenuePin } from '@/components/map/MapboxMap'

interface PinData {
  id: number
  left: number
  top: number
  priceK: number
  variant: PinVariant
}

const FALLBACK_PINS: PinData[] = [
  { id: 1, left: 28, top: 24, priceK: 18, variant: 'active' },
  { id: 2, left: 62, top: 36, priceK: 9.5, variant: 'default' },
  { id: 3, left: 44, top: 54, priceK: 26, variant: 'hot' },
  { id: 4, left: 74, top: 58, priceK: 11, variant: 'default' },
  { id: 5, left: 22, top: 68, priceK: 14, variant: 'default' },
]

// Buenos Aires por default — re-centrar cuando tengamos geolocation del user.
const DEFAULT_CENTER = { lat: -34.5836, lng: -58.4222 }

export default function Map() {
  const venuesQuery = useNhostQuery((nhost) => fetchVenueList(nhost, { limit: 12 }), [])
  const venues = venuesQuery.data ?? []
  const courts = venues.length > 0 ? venuesToMobileCourts(venues) : MOCK_COURTS
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected =
    courts.find((c) => c.slug === selectedId) ?? courts[0] ?? MOCK_COURTS[0]!

  const realPins: VenuePin[] = venues
    .filter((v) => v.latitude !== null && v.longitude !== null)
    .map((v) => ({
      id: v.id,
      name: v.name,
      latitude: v.latitude!,
      longitude: v.longitude!,
      priceK: Math.round((v.courts[0]?.base_price_cents ?? 0) / 100_000),
      active: v.id === selected.slug,
    }))

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      {/* Map canvas */}
      <View className="relative flex-1 bg-cy-field">
        {/* Mapbox real, si el módulo nativo está disponible. Si no, fallback al placeholder SVG. */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <MapboxMap
            pins={realPins}
            centerLat={realPins[0]?.latitude ?? DEFAULT_CENTER.lat}
            centerLng={realPins[0]?.longitude ?? DEFAULT_CENTER.lng}
            onSelectPin={(id) => {
              const v = venues.find((x) => x.id === id)
              if (v) setSelectedId(v.slug)
            }}
          />
        </View>

        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.18 }}
          pointerEvents="none"
        >
          {/* "Calles" — visibles solo cuando Mapbox no está montado */}
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

        {/* Pins fallback (visibles solo si MapboxMap no renderizó) */}
        {realPins.length === 0 &&
          FALLBACK_PINS.map((p) => (
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
        onPressDetail={() => router.push(`/court/${selected.slug}` as never)}
      />

      <BottomNav active="map" onPress={navigateBottomNav} IconComponent={Icon} />
    </SafeAreaView>
  )
}

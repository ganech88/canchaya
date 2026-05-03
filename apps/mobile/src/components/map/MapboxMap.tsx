// Wrapper de @rnmapbox/maps con import dinámico — el módulo nativo no existe
// en Expo Go (requiere dev build). Si la importación falla, este componente
// devuelve null y el caller renderiza el placeholder SVG.

import { useEffect, useState, type ReactElement } from 'react'
import { View, Text } from 'react-native'

interface VenuePin {
  id: string
  name: string
  latitude: number
  longitude: number
  priceK: number
  active: boolean
}

interface Props {
  pins: VenuePin[]
  centerLat: number
  centerLng: number
  onSelectPin?: (id: string) => void
}

interface MapboxBundle {
  // Subset of @rnmapbox/maps types — typed como any para evitar el peer
  // dependency en environments sin native build.
  Mapbox: any
  MapView: any
  Camera: any
  PointAnnotation: any
}

let cachedBundle: MapboxBundle | null | 'unavailable' = null

async function loadMapbox(token: string): Promise<MapboxBundle | null> {
  if (cachedBundle === 'unavailable') return null
  if (cachedBundle) return cachedBundle
  try {
    // Dynamic import via string para evitar que el typechecker resuelva el
    // peer dependency (`@rnmapbox/maps` solo existe en dev builds, no en
    // Expo Go).
    const moduleName = '@rnmapbox/maps'
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const mod: any = await (new Function('m', 'return import(m)') as any)(moduleName)
    const Mapbox = mod.default ?? mod
    Mapbox.setAccessToken(token)
    cachedBundle = {
      Mapbox,
      MapView: mod.MapView,
      Camera: mod.Camera,
      PointAnnotation: mod.PointAnnotation,
    }
    return cachedBundle
  } catch {
    cachedBundle = 'unavailable'
    return null
  }
}

export function MapboxMap({ pins, centerLat, centerLng, onSelectPin }: Props): ReactElement | null {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? ''
  const [bundle, setBundle] = useState<MapboxBundle | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!token) {
      setReady(true)
      return
    }
    let cancelled = false
    void loadMapbox(token).then((b) => {
      if (cancelled) return
      setBundle(b)
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [token])

  if (!ready) return null
  if (!token || !bundle) return null

  const { MapView, Camera, PointAnnotation } = bundle

  return (
    <MapView
      style={{ flex: 1 }}
      styleURL="mapbox://styles/mapbox/streets-v12"
      logoEnabled={false}
      attributionEnabled={false}
    >
      <Camera centerCoordinate={[centerLng, centerLat]} zoomLevel={12} animationMode="none" />
      {pins.map((p) => (
        <PointAnnotation
          key={p.id}
          id={p.id}
          coordinate={[p.longitude, p.latitude]}
          onSelected={() => onSelectPin?.(p.id)}
        >
          <View
            className="border-chip border-cy-line bg-cy-paper px-1.5 py-1"
            style={{ minWidth: 48 }}
          >
            <Text className="font-mono text-[9px] uppercase text-cy-ink">${p.priceK}K</Text>
          </View>
        </PointAnnotation>
      ))}
    </MapView>
  )
}

export type { VenuePin }

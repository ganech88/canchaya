// ScreenPopup (/popup/open-match) — modal transparente sobre el screen anterior.
// Muestra el primer open_match abierto del back. Si el caller pasa `?id=...`,
// se ancla a ese match específico.

import { useMemo } from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Button, Chip, Placeholder } from '@canchaya/ui/native'
import {
  fetchOpenMatches,
  fetchOpenMatchById,
  type OpenMatchListItem,
  type OpenMatchDetail,
} from '@canchaya/db'
import { Icon } from '@/lib/icon'
import { cn } from '@canchaya/ui'
import { useNhostQuery } from '@/lib/useQuery'

const SPORT_LABELS: Record<string, string> = {
  futbol_5: 'F5',
  futbol_7: 'F7',
  futbol_8: 'F8',
  futbol_11: 'F11',
  padel: 'PÁDEL',
  tenis: 'TENIS',
  basquet: 'BÁSQUET',
  voley: 'VÓLEY',
}

const LEVEL_LABELS: Record<string, string> = {
  principiante: 'PRINCIPIANTE',
  intermedio: 'INTERMEDIO',
  avanzado: 'AVANZADO',
  profesional: 'PROFESIONAL',
}

interface MatchView {
  id: string
  venueLabel: string
  sportLabel: string
  hostName: string
  whenLabel: string
  level: string
  priceLabel: string
  spotsLabel: string
  remaining: number
}

function formatPrice(cents: number): string {
  const ars = Math.round(cents / 100)
  if (ars >= 1000) return `$${(ars / 1000).toFixed(1)}K`
  return `$${ars}`
}

function formatWhen(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  return sameDay ? `Hoy ${time}` : `${d.getDate()}/${d.getMonth() + 1} ${time}`
}

function toView(m: OpenMatchListItem | OpenMatchDetail): MatchView {
  const sportCode = m.booking.court.sport.code
  return {
    id: m.id,
    venueLabel: `${m.booking.court.venue.name.toUpperCase()} · ${SPORT_LABELS[sportCode] ?? sportCode.toUpperCase()}`,
    sportLabel: SPORT_LABELS[sportCode] ?? sportCode.toUpperCase(),
    hostName: m.booking.host.name.split(' ')[0] ?? m.booking.host.name,
    whenLabel: `${formatWhen(m.booking.starts_at)} · Nivel ${LEVEL_LABELS[m.level]?.toLowerCase() ?? m.level}`,
    level: LEVEL_LABELS[m.level] ?? m.level.toUpperCase(),
    priceLabel: formatPrice(m.price_per_player_cents),
    spotsLabel: `${m.spots_filled}/${m.spots_total}`,
    remaining: m.spots_total - m.spots_filled,
  }
}

const FALLBACK: MatchView = {
  id: 'fallback',
  venueLabel: 'EL POTRERO · F5',
  sportLabel: 'F5',
  hostName: 'Martín',
  whenLabel: 'Hoy 21:00 · Nivel intermedio',
  level: 'INTERMEDIO',
  priceLabel: '$2.6K',
  spotsLabel: '8/10',
  remaining: 2,
}

export default function OpenMatchPopup() {
  const params = useLocalSearchParams<{ id?: string }>()
  const matchId = params.id

  const byIdQuery = useNhostQuery(
    async (nhost) => (matchId ? fetchOpenMatchById(nhost, matchId) : null),
    [matchId],
  )
  const listQuery = useNhostQuery(
    async (nhost) => (matchId ? null : fetchOpenMatches(nhost, 1)),
    [matchId],
  )

  const view: MatchView = useMemo(() => {
    if (byIdQuery.data) return toView(byIdQuery.data)
    if (listQuery.data && listQuery.data.length > 0) return toView(listQuery.data[0]!)
    return FALLBACK
  }, [byIdQuery.data, listQuery.data])

  const close = () => router.back()
  const loading = (matchId ? byIdQuery.loading : listQuery.loading) && !byIdQuery.data && !listQuery.data

  const stats = [
    { key: 'Aporte', value: view.priceLabel },
    { key: 'Distancia', value: '—' },
    { key: 'Jugadores', value: view.spotsLabel },
  ]

  return (
    <View className="flex-1">
      <Pressable
        onPress={close}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(13,13,13,0.55)',
        }}
      />

      <View style={{ position: 'absolute', left: 12, right: 12, top: 46 }}>
        <View className="border-card border-cy-line bg-cy-accent px-3 py-2.5">
          <View className="flex-row items-center gap-2">
            <Icon name="bolt" size={12} color="#0d0d0d" />
            <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-ink">
              PARTIDO ABIERTO · CERCA TUYO
            </Text>
          </View>
          <Text className="mt-1 font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
            ¿TE SUMÁS?
          </Text>
        </View>
      </View>

      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
        <View className="border-card border-cy-line bg-cy-paper">
          <View className="flex-row items-center justify-between bg-cy-ink px-3 py-2">
            <Text className="font-mono text-[10px] font-bold uppercase tracking-wider text-cy-accent">
              § CONVOCATORIA · {view.remaining > 2 ? 'ABIERTA' : 'URGENTE'}
            </Text>
            <Pressable onPress={close} hitSlop={8}>
              <Icon name="close" size={14} color="#c6ff1a" />
            </Pressable>
          </View>

          <View>
            <Placeholder
              variant="field"
              className="h-[90px] w-full border-0 border-b-chip border-cy-line"
              label={view.venueLabel}
            />
          </View>

          <View className="px-3 py-2.5">
            {loading ? (
              <ActivityIndicator color="#0d0d0d" />
            ) : (
              <>
                <Text className="font-display text-[28px] leading-[24px] tracking-tight text-cy-ink">
                  FALTAN{'\n'}
                  {view.remaining === 1 ? 'UNO.' : view.remaining === 2 ? 'DOS.' : `${view.remaining}.`}
                </Text>
                <View className="mt-1.5 flex-row flex-wrap items-center">
                  <Text className="font-mono text-[11px] text-cy-muted">Partido armado por </Text>
                  <Text className="font-mono text-[11px] font-bold text-cy-ink">{view.hostName}</Text>
                  <Text className="font-mono text-[11px] text-cy-muted"> · {view.whenLabel}</Text>
                </View>

                <View className="mt-2 flex-row gap-1.5">
                  <Chip variant="outline">NIV · {view.level}</Chip>
                  <Chip variant="fill">{view.sportLabel}</Chip>
                </View>

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
              </>
            )}

            <View className="mt-3 flex-row gap-2">
              <Button variant="ghost" onPress={close} className="flex-1">
                Ahora no
              </Button>
              <Button
                variant="accent"
                onPress={() => {
                  // TODO: insertar booking_participant + decrementar open_match.spots_filled
                  // (ideal: vía Function `joinOpenMatch` que valide spots disponibles).
                  router.replace(`/chat/${view.id}` as never)
                }}
                style={{ flex: 2 }}
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

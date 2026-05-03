// ScreenOpenMatch (/match/new) — crear convocatoria para un turno ya reservado.
// Acepta `?bookingId=<uuid>` en la query. Si no se pasa o no resuelve, cae a
// mostrar la primera booking próxima del usuario logueado; si tampoco existe,
// usa el banner mock.

import { useMemo, useState } from 'react'
import { Alert, View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Masthead, Button } from '@canchaya/ui/native'
import {
  fetchUserUpcomingBookings,
  createOpenMatch,
  type UserBookingRow,
} from '@canchaya/db'
import { Icon } from '@/lib/icon'
import { getNhost } from '@/lib/nhost'
import { useNhostQuery } from '@/lib/useQuery'
import { BookingBanner } from '@/components/match/BookingBanner'
import { PlayersGrid, type PlayerCell } from '@/components/match/PlayersGrid'
import { LevelFilter, type MatchLevelKey } from '@/components/match/LevelFilter'
import { ReachCard } from '@/components/match/ReachCard'

const SPORT_SHORT: Record<string, string> = {
  futbol_5: 'F5',
  futbol_7: 'F7',
  futbol_8: 'F8',
  futbol_11: 'F11',
  padel: 'PÁDEL',
  tenis: 'TENIS',
}

const LEVEL_TO_DB: Record<MatchLevelKey, 'principiante' | 'intermedio' | 'avanzado'> = {
  PRINCIPIANTE: 'principiante',
  INTERMEDIO: 'intermedio',
  AVANZADO: 'avanzado',
}

interface BookingView {
  id: string | null
  venue: string
  sport: string
  dateLabel: string
  durationLabel: string
  totalCents: number
  partySize: number
  startsAtIso: string
}

const FALLBACK_BOOKING: BookingView = {
  id: null,
  venue: 'EL POTRERO',
  sport: 'F5',
  dateLabel: 'Hoy · 21:00',
  durationLabel: '1 h',
  totalCents: 2600000,
  partySize: 10,
  startsAtIso: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function bookingRowToView(b: UserBookingRow): BookingView {
  const sportCode = b.court.sport.code
  const ms = new Date(b.ends_at).getTime() - new Date(b.starts_at).getTime()
  const hours = ms / 3_600_000
  return {
    id: b.id,
    venue: b.court.venue.name.toUpperCase(),
    sport: SPORT_SHORT[sportCode] ?? sportCode.toUpperCase(),
    dateLabel: `${isToday(b.starts_at) ? 'Hoy' : new Date(b.starts_at).toLocaleDateString('es-AR')} · ${formatTime(b.starts_at)}`,
    durationLabel: `${hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1)} h`,
    totalCents: b.total_cents,
    partySize: b.party_size || 10,
    startsAtIso: b.starts_at,
  }
}

function buildCells(filled: number, total: number): PlayerCell[] {
  const cells: PlayerCell[] = []
  for (let i = 1; i <= total; i++) {
    if (i === 1) cells.push({ number: i, state: 'me' })
    else if (i <= filled) cells.push({ number: i, state: 'filled' })
    else cells.push({ number: i, state: 'empty' })
  }
  return cells
}

export default function OpenMatchNew() {
  const params = useLocalSearchParams<{ bookingId?: string }>()
  const targetId = params.bookingId

  const bookingsQuery = useNhostQuery(async (nhost) => {
    const session = nhost.getUserSession()
    if (!session?.user?.id) return []
    return fetchUserUpcomingBookings(nhost, session.user.id, 5)
  }, [])

  const booking: BookingView = useMemo(() => {
    const list = bookingsQuery.data ?? []
    if (targetId) {
      const found = list.find((b) => b.id === targetId)
      if (found) return bookingRowToView(found)
    }
    if (list.length > 0) return bookingRowToView(list[0]!)
    return FALLBACK_BOOKING
  }, [bookingsQuery.data, targetId])

  const [level, setLevel] = useState<MatchLevelKey>('INTERMEDIO')
  const [submitting, setSubmitting] = useState(false)

  const totalSpots = booking.partySize
  const filled = Math.max(1, Math.floor(totalSpots * 0.8))
  const cells = useMemo(() => buildCells(filled, totalSpots), [filled, totalSpots])
  const contributionCents = Math.round(booking.totalCents / Math.max(totalSpots, 1))

  const onPublish = async () => {
    if (!booking.id) {
      Alert.alert(
        'Sin reserva',
        'Reservá un turno primero — la convocatoria se vincula a un turno existente.',
      )
      return
    }
    setSubmitting(true)
    try {
      // expires_at = 30 minutos antes del comienzo
      const expiresAt = new Date(new Date(booking.startsAtIso).getTime() - 30 * 60 * 1000).toISOString()
      await createOpenMatch(getNhost(), {
        bookingId: booking.id,
        spotsTotal: totalSpots,
        level: LEVEL_TO_DB[level],
        pricePerPlayerCents: contributionCents,
        expiresAt,
      })
      Alert.alert('Listo', 'Convocatoria publicada.', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      Alert.alert('No se pudo publicar', msg)
    } finally {
      setSubmitting(false)
    }
  }

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
        <View className="px-4 pb-2.5 pt-3.5">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cy-ink">
            Cancha reservada
          </Text>
          {bookingsQuery.loading && !bookingsQuery.data ? (
            <ActivityIndicator color="#0d0d0d" />
          ) : (
            <BookingBanner
              venue={booking.venue}
              sport={booking.sport}
              dateLabel={booking.dateLabel}
              durationLabel={booking.durationLabel}
            />
          )}
        </View>

        <View className="px-4 pb-2.5 pt-2">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cy-ink">
            Jugadores
          </Text>
          <PlayersGrid cells={cells} />
          <Text className="mt-2 font-mono text-[10px] text-cy-muted">
            {filled} / {totalSpots} confirmados —{' '}
            <Text className="font-bold text-cy-red">FALTAN {totalSpots - filled}</Text>
          </Text>
        </View>

        <View className="px-4 pb-2.5 pt-1">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cy-ink">
            Nivel · Abierto a
          </Text>
          <LevelFilter active={level} onChange={setLevel} />
        </View>

        <View className="px-4 pb-2.5 pt-1">
          <Text className="mb-1.5 font-mono text-[10px] font-bold uppercase text-cy-ink">
            Aporte / jugador
          </Text>
          <View className="flex-row items-end justify-between border-card border-cy-line bg-cy-paper px-3 py-2.5">
            <Text className="font-display text-[26px] leading-[22px] tracking-tight text-cy-ink">
              ${Math.round(contributionCents / 100).toLocaleString('es-AR')}
            </Text>
            <Text className="font-mono text-[10px] text-cy-muted">
              ${(booking.totalCents / 100 / 1000).toFixed(0)}K ÷ {totalSpots}
            </Text>
          </View>
        </View>

        <View className="px-4 pb-2.5 pt-2">
          <ReachCard count={340} radiusKm={3} />
        </View>
      </ScrollView>

      <View className="border-t-card border-cy-line bg-cy-paper p-3">
        <Button
          variant="accent"
          onPress={onPublish}
          disabled={submitting}
          className="w-full"
          rightIcon={<Icon name="arrow" size={14} color="#0d0d0d" />}
        >
          {submitting ? 'Publicando…' : 'Publicar convocatoria'}
        </Button>
      </View>
    </SafeAreaView>
  )
}

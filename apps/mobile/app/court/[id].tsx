// ScreenDetail (/court/[slug]) — ficha de cancha con calendario de turnos.
// El param de ruta se llama `id` por compatibilidad histórica, pero recibe
// el slug del venue (e.g. "la-bombonerita"). Si Nhost no responde o no existe
// el venue, cae a los MOCK_COURTS por slug.

import { useMemo, useState } from 'react'
import { Alert, Linking, View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Button, Rating } from '@canchaya/ui/native'
import {
  fetchVenueBySlug,
  createBooking,
  createCheckoutForBooking,
  type VenueDetail,
} from '@canchaya/db'
import { Icon } from '@/lib/icon'
import { MOCK_COURTS, type MockCourt } from '@/data/courts'
import { getNhost } from '@/lib/nhost'
import { useNhostQuery } from '@/lib/useQuery'
import { DetailHero } from '@/components/detail/DetailHero'
import { StatsStrip } from '@/components/detail/StatsStrip'
import { DayStrip, type Day } from '@/components/detail/DayStrip'
import { HourGrid, type HourSlot } from '@/components/detail/HourGrid'
import { PriceBreakdown } from '@/components/detail/PriceBreakdown'

const ALL_HOURS = ['16', '17', '18', '19', '20', '21', '22', '23']

const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

function buildWeekStrip(): Day[] {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      letter: DAY_LETTERS[d.getDay()] ?? '?',
      number: d.getDate(),
    }
  })
}

function formatARS(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

interface CourtView {
  slug: string
  name: string
  zone: string
  type: string
  price: number
  rating: number
  reviews: number
  isReal: boolean
}

function mockToCourtView(m: MockCourt): CourtView {
  return {
    slug: m.slug,
    name: m.name,
    zone: m.zone,
    type: m.type,
    price: m.price,
    rating: m.rating,
    reviews: m.reviews,
    isReal: false,
  }
}

function venueToCourtView(v: VenueDetail): CourtView {
  const cheapest = v.courts[0]
  return {
    slug: v.slug,
    name: v.name.toUpperCase(),
    zone: v.city ? `${v.city} · 0km` : 'Sin ubicación',
    type: cheapest?.sport.name ?? '—',
    price: Math.round((cheapest?.base_price_cents ?? 0) / 100),
    rating: Number(v.rating_stars) || 0,
    reviews: v.rating_count,
    isReal: true,
  }
}

export default function CourtDetail() {
  const params = useLocalSearchParams<{ id: string }>()
  const slug = String(params.id ?? '')

  const venueQuery = useNhostQuery((nhost) => fetchVenueBySlug(nhost, slug), [slug])

  const view: CourtView = useMemo(() => {
    if (venueQuery.data) return venueToCourtView(venueQuery.data)
    const fromMock = MOCK_COURTS.find((c) => c.slug === slug) ?? MOCK_COURTS[0]
    if (!fromMock) {
      return {
        slug,
        name: '—',
        zone: '—',
        type: '—',
        price: 0,
        rating: 0,
        reviews: 0,
        isReal: false,
      }
    }
    return mockToCourtView(fromMock)
  }, [venueQuery.data, slug])

  const days = useMemo(buildWeekStrip, [])
  const [favorited, setFavorited] = useState(false)
  const [dayIndex, setDayIndex] = useState(0)
  const [pickedHour, setPickedHour] = useState<string | null>('20')

  // TODO: cuando agreguemos `fetchAvailableSlots(venueId, court_id, date)`,
  // estos slots se computan vs bookings reales. Por ahora simulamos algunos
  // ocupados de forma determinística.
  const busy = useMemo(() => {
    const seed = (slug.charCodeAt(0) || 1) + dayIndex
    const occupied = new Set<string>()
    for (let i = 0; i < ALL_HOURS.length; i++) {
      if ((i * seed) % 3 === 0) occupied.add(ALL_HOURS[i]!)
    }
    return occupied
  }, [slug, dayIndex])

  const slots: HourSlot[] = useMemo(
    () =>
      ALL_HOURS.map((h) => ({
        hour: h,
        state: h === pickedHour ? 'picked' : busy.has(h) ? 'busy' : 'available',
      })),
    [pickedHour, busy],
  )

  const ballRent = 800
  const total = view.price + ballRent
  const [paying, setPaying] = useState(false)
  const showLoading = venueQuery.loading && !venueQuery.data && !MOCK_COURTS.find((c) => c.slug === slug)

  const onReserveAndPay = async () => {
    if (!pickedHour) return
    const venue = venueQuery.data
    const court = venue?.courts[0]
    const nhost = (() => {
      try {
        return getNhost()
      } catch {
        return null
      }
    })()
    const session = nhost?.getUserSession()
    const hostId = session?.user?.id

    // Si no hay venue real / sesión / cancha, demo: ir directo al chat con UUID falso
    if (!venue || !court || !nhost || !hostId) {
      router.push(`/chat/${view.slug}` as never)
      return
    }

    setPaying(true)
    try {
      const startsAt = new Date()
      const day = days[dayIndex]?.number ?? startsAt.getDate()
      startsAt.setDate(day)
      startsAt.setHours(Number.parseInt(pickedHour, 10), 0, 0, 0)
      const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000)

      const totalCents = court.base_price_cents
      const depositCents = Math.round(totalCents * (venue.deposit_percent / 100))

      const booking = await createBooking(nhost, {
        courtId: court.id,
        hostId,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        totalCents,
        depositCents,
        partySize: 1,
      })

      const pref = await createCheckoutForBooking(nhost, booking.id)
      await Linking.openURL(pref.init_point)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      Alert.alert('No se pudo iniciar el pago', msg)
    } finally {
      setPaying(false)
    }
  }

  if (showLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-cy-bg">
        <ActivityIndicator color="#0d0d0d" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <DetailHero
          onBack={() => router.back()}
          onToggleFavorite={() => setFavorited((v) => !v)}
          favorited={favorited}
          sportLabel={view.type.toUpperCase()}
        />

        <View className="border-b-card border-cy-line bg-cy-paper px-4 pb-2 pt-4">
          <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § FICHA · {view.slug.toUpperCase()}
          </Text>
          <Text className="mt-1 font-display text-[40px] leading-[36px] tracking-tight text-cy-ink">
            {view.name}
          </Text>
          <View className="mt-2 flex-row items-center gap-3">
            <Rating value={view.rating} count={view.reviews} />
            <Text className="font-mono text-[10px] text-cy-muted">·</Text>
            <Text className="font-mono text-[10px] uppercase text-cy-ink">{view.zone}</Text>
          </View>
        </View>

        <StatsStrip
          stats={[
            { key: 'Canchas', value: String(venueQuery.data?.courts.length ?? '04') },
            { key: 'Abierto', value: '24/7' },
            { key: 'Piso', value: 'Sint.' },
          ]}
        />

        <View className="px-4 pt-3.5">
          <View className="mb-2.5 flex-row items-end justify-between">
            <Text className="font-condensed text-[22px] leading-[21px] uppercase text-cy-ink">
              Turnos · {DAY_LETTERS[(new Date().getDay() + dayIndex) % 7]} {days[dayIndex]?.number}
            </Text>
            <Text className="font-mono text-[10px] uppercase text-cy-ink">◀ HOY ▶</Text>
          </View>
          <View className="h-1 bg-cy-line" />
          <View className="mt-2.5">
            <DayStrip days={days} activeIndex={dayIndex} onChange={setDayIndex} />
          </View>

          <Text className="mb-1.5 mt-3.5 font-mono text-[10px] uppercase text-cy-muted">
            Disponibilidad
          </Text>
          <HourGrid slots={slots} onPickHour={setPickedHour} />
        </View>

        <View className="px-4 pb-3.5 pt-3.5">
          <PriceBreakdown
            lines={[
              {
                label: `Cancha · 1 h · ${pickedHour ?? '--'}:00`,
                amount: formatARS(view.price),
              },
              { label: 'Alquiler pelota', amount: formatARS(ballRent) },
            ]}
            totalAmount={formatARS(total)}
          />
        </View>

        <View className="px-4 pb-4">
          <Button
            variant="accent"
            disabled={!pickedHour || paying}
            onPress={onReserveAndPay}
            className="w-full"
            rightIcon={<Icon name="arrow" size={14} color="#0d0d0d" />}
          >
            {paying ? 'Iniciando pago…' : 'Reservar y pagar'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

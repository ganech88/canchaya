// ScreenChat (/chat/[id]) — chat del partido. El param es el booking_id.
//
// Para el dato real: poll cada 4s contra `chat_messages` filtrado por bookingId,
// y un insert directo al enviar. Si no hay sesión o falla la query, usa un
// feed mock y permite "chatear localmente" (no persiste).
//
// TODO: cuando agreguemos GraphQL subscriptions sobre WS, reemplazar el poll.

import { useEffect, useMemo, useRef, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import {
  fetchChatMessages,
  fetchChatBookingHeader,
  sendChatMessage,
  type ChatMessageRow,
  type ChatBookingHeader,
} from '@canchaya/db'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { PinnedInfo } from '@/components/chat/PinnedInfo'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { SystemMessage } from '@/components/chat/SystemMessage'
import { DayDivider } from '@/components/chat/DayDivider'
import { ChatInput } from '@/components/chat/ChatInput'
import { getNhost, isNhostConfigured } from '@/lib/nhost'

const SPORT_SHORT: Record<string, string> = {
  futbol_5: 'F5',
  futbol_7: 'F7',
  futbol_8: 'F8',
  futbol_11: 'F11',
  padel: 'PÁDEL',
  tenis: 'TENIS',
}

interface ChatItem {
  id: string
  type: 'msg' | 'system' | 'divider'
  text: string
  from?: string
  side?: 'me' | 'other'
  nameColor?: 'ink' | 'red' | 'field'
}

const FALLBACK_FEED: ChatItem[] = [
  { id: 'd1', type: 'divider', text: 'HOY · 14:22' },
  { id: 'm1', type: 'msg', side: 'other', from: 'MARTÍN', nameColor: 'ink', text: 'Gente, ¿llevo alguna pelota de repuesto?' },
  { id: 'm2', type: 'msg', side: 'other', from: 'LUCAS', nameColor: 'red', text: 'Dale, yo llevo la otra. Nos vemos 20:45 en la entrada.' },
  { id: 'm3', type: 'msg', side: 'me', from: 'TÚ', text: 'Perfecto. Alguien pasa por Palermo a las 20:15?' },
  { id: 'd2', type: 'divider', text: '17:40' },
  { id: 's1', type: 'system', text: 'JUAN se unió al partido · FALTA 1' },
  { id: 'm4', type: 'msg', side: 'other', from: 'JUAN', nameColor: 'field', text: 'Ya estoy! Vengo de Caballito, llego a horario.' },
  { id: 'm5', type: 'msg', side: 'me', from: 'TÚ', text: 'Bárbaro. ¿Alguien trae algo para tomar?' },
  { id: 's2', type: 'system', text: '💸 5 pagos recibidos · $13.000 / $26.000' },
]

const NAME_COLORS: Array<'ink' | 'red' | 'field'> = ['ink', 'red', 'field']

function colorForUser(userId: string | null): 'ink' | 'red' | 'field' {
  if (!userId) return 'ink'
  let h = 0
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) | 0
  return NAME_COLORS[Math.abs(h) % NAME_COLORS.length]!
}

function formatHour(iso: string): string {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function dateKey(iso: string): string {
  return iso.slice(0, 10) // YYYY-MM-DD
}

function dayLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  if (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
    return `HOY · ${formatHour(iso)}`
  return `${d.getDate()}/${d.getMonth() + 1} · ${formatHour(iso)}`
}

function rowsToFeed(rows: ChatMessageRow[], myUserId: string | null): ChatItem[] {
  if (rows.length === 0) return []
  const items: ChatItem[] = []
  let lastDay: string | null = null
  for (const r of rows) {
    const dk = dateKey(r.created_at)
    if (dk !== lastDay) {
      items.push({ id: `d-${dk}`, type: 'divider', text: dayLabel(r.created_at) })
      lastDay = dk
    }
    if (r.kind === 'system') {
      items.push({ id: r.id, type: 'system', text: r.text ?? '' })
      continue
    }
    items.push({
      id: r.id,
      type: 'msg',
      side: myUserId && r.user_id === myUserId ? 'me' : 'other',
      from: r.user?.name?.split(' ')[0]?.toUpperCase() ?? 'USER',
      nameColor: colorForUser(r.user_id),
      text: r.text ?? '',
    })
  }
  return items
}

interface HeaderView {
  matchDateLabel: string
  venueTitle: string
  spotsFilled: number
  spotsTotal: number
  address: string | null
  perPlayer: string
}

const FALLBACK_HEADER: HeaderView = {
  matchDateLabel: 'HOY 21:00',
  venueTitle: 'EL POTRERO · F5',
  spotsFilled: 8,
  spotsTotal: 10,
  address: 'Sarmiento 4320',
  perPlayer: '$2.6K p/u',
}

function headerToView(h: ChatBookingHeader): HeaderView {
  const sportShort = SPORT_SHORT[h.court.sport.code] ?? h.court.sport.code.toUpperCase()
  return {
    matchDateLabel: `${formatHour(h.starts_at)}`,
    venueTitle: `${h.court.venue.name.toUpperCase()} · ${sportShort}`,
    spotsFilled: h.open_match?.spots_filled ?? h.party_size,
    spotsTotal: h.open_match?.spots_total ?? h.party_size,
    address: h.court.venue.address,
    perPlayer: '—',
  }
}

const POLL_INTERVAL_MS = 4000

export default function ChatRoom() {
  const params = useLocalSearchParams<{ id: string }>()
  const bookingId = String(params.id ?? '')

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId)
  const canConnect = isUuid && isNhostConfigured()

  const [feed, setFeed] = useState<ChatItem[]>(canConnect ? [] : FALLBACK_FEED)
  const [header, setHeader] = useState<HeaderView>(FALLBACK_HEADER)
  const [myUserId, setMyUserId] = useState<string | null>(null)
  const lastSinceRef = useRef<string | undefined>(undefined)
  const allRowsRef = useRef<ChatMessageRow[]>([])

  // Boot: header + sesión
  useEffect(() => {
    if (!canConnect) return
    let cancelled = false
    void (async () => {
      try {
        const nhost = getNhost()
        const session = nhost.getUserSession()
        if (!cancelled && session?.user?.id) setMyUserId(session.user.id)
        const h = await fetchChatBookingHeader(nhost, bookingId)
        if (!cancelled && h) setHeader(headerToView(h))
      } catch {
        /* fallback header */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [bookingId, canConnect])

  // Polling de mensajes
  useEffect(() => {
    if (!canConnect) return
    let cancelled = false

    const tick = async () => {
      try {
        const nhost = getNhost()
        const since = lastSinceRef.current ? new Date(lastSinceRef.current) : undefined
        const newRows = await fetchChatMessages(nhost, bookingId, since)
        if (cancelled || newRows.length === 0) return
        allRowsRef.current = [...allRowsRef.current, ...newRows]
        lastSinceRef.current = newRows[newRows.length - 1]!.created_at
        setFeed(rowsToFeed(allRowsRef.current, myUserId))
      } catch {
        /* swallow — siguiente tick reintenta */
      }
    }

    void tick()
    const handle = setInterval(tick, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(handle)
    }
  }, [bookingId, canConnect, myUserId])

  const onSend = async (text: string) => {
    if (!canConnect || !myUserId) {
      // Modo demo (sin auth): añadir local
      setFeed((prev) => [
        ...prev,
        { id: `m-${Date.now()}`, type: 'msg', side: 'me', from: 'TÚ', text },
      ])
      return
    }
    try {
      await sendChatMessage(getNhost(), bookingId, myUserId, text)
      // Optimistic: el siguiente tick traerá el row real
      setFeed((prev) => [
        ...prev,
        { id: `m-${Date.now()}`, type: 'msg', side: 'me', from: 'TÚ', text },
      ])
    } catch {
      setFeed((prev) => [
        ...prev,
        { id: `m-err-${Date.now()}`, type: 'system', text: '⚠ Error al enviar' },
      ])
    }
  }

  const renderedFeed = useMemo(() => (feed.length > 0 ? feed : FALLBACK_FEED), [feed])

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <ChatHeader
        onBack={() => router.back()}
        matchDateLabel={header.matchDateLabel}
        venueTitle={header.venueTitle}
        spotsFilled={header.spotsFilled}
        spotsTotal={header.spotsTotal}
      />
      <PinnedInfo address={header.address ?? '—'} perPlayer={header.perPlayer} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 14, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {renderedFeed.map((item) => {
          if (item.type === 'divider') return <DayDivider key={item.id} label={item.text} />
          if (item.type === 'system') return <SystemMessage key={item.id}>{item.text}</SystemMessage>
          return (
            <MessageBubble
              key={item.id}
              text={item.text}
              side={item.side ?? 'other'}
              from={item.from}
              nameColor={item.nameColor}
            />
          )
        })}
      </ScrollView>

      <ChatInput onSend={onSend} />
    </SafeAreaView>
  )
}

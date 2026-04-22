// ScreenChat (/chat/[id]) — chat del partido.
// Datos mock hardcoded por ahora; cuando conectemos Supabase Realtime reemplazamos el feed.

import { useState } from 'react'
import { View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { PinnedInfo } from '@/components/chat/PinnedInfo'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { SystemMessage } from '@/components/chat/SystemMessage'
import { DayDivider } from '@/components/chat/DayDivider'
import { ChatInput } from '@/components/chat/ChatInput'

interface ChatItem {
  id: string
  type: 'msg' | 'system' | 'divider'
  text: string
  from?: string
  side?: 'me' | 'other'
  nameColor?: 'ink' | 'red' | 'field'
}

const INITIAL_FEED: ChatItem[] = [
  { id: 'd1', type: 'divider', text: 'HOY · 14:22' },
  {
    id: 'm1',
    type: 'msg',
    side: 'other',
    from: 'MARTÍN',
    nameColor: 'ink',
    text: 'Gente, ¿llevo alguna pelota de repuesto?',
  },
  {
    id: 'm2',
    type: 'msg',
    side: 'other',
    from: 'LUCAS',
    nameColor: 'red',
    text: 'Dale, yo llevo la otra. Nos vemos 20:45 en la entrada.',
  },
  {
    id: 'm3',
    type: 'msg',
    side: 'me',
    from: 'TÚ',
    text: 'Perfecto. Alguien pasa por Palermo a las 20:15?',
  },
  { id: 'd2', type: 'divider', text: '17:40' },
  { id: 's1', type: 'system', text: 'JUAN se unió al partido · FALTA 1' },
  {
    id: 'm4',
    type: 'msg',
    side: 'other',
    from: 'JUAN',
    nameColor: 'field',
    text: 'Ya estoy! Vengo de Caballito, llego a horario.',
  },
  {
    id: 'm5',
    type: 'msg',
    side: 'me',
    from: 'TÚ',
    text: 'Bárbaro. ¿Alguien trae algo para tomar?',
  },
  { id: 's2', type: 'system', text: '💸 5 pagos recibidos · $13.000 / $26.000' },
]

export default function ChatRoom() {
  const [feed, setFeed] = useState<ChatItem[]>(INITIAL_FEED)

  const onSend = (text: string) => {
    setFeed((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, type: 'msg', side: 'me', from: 'TÚ', text },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top', 'bottom']}>
      <ChatHeader
        onBack={() => router.back()}
        matchDateLabel="HOY 21:00"
        venueTitle="EL POTRERO · F5"
        spotsFilled={8}
        spotsTotal={10}
      />
      <PinnedInfo address="Sarmiento 4320" perPlayer="$2.6K p/u" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 14, gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {feed.map((item) => {
          if (item.type === 'divider')
            return <DayDivider key={item.id} label={item.text} />
          if (item.type === 'system')
            return <SystemMessage key={item.id}>{item.text}</SystemMessage>
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

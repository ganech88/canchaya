// Placeholder de Home — lo reemplazamos por ScreenHome del handoff cuando arranquemos pantalla por pantalla.

import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, ScrollView } from 'react-native'
import { Masthead, Chip, Button, Placeholder } from '@canchaya/ui/native'
import { Icon } from '@/lib/icon'

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-cy-bg" edges={['top']}>
      <Masthead
        dateStr="ABR·22·2026"
        issue="ED. MATUTINA"
        section="HOY · PALERMO"
        title="JUGÁ CERCA."
        sub="12 canchas disponibles en los próximos 90 minutos a menos de 3 km."
      />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="flex-row flex-wrap gap-2">
          {['TODO', 'FÚTBOL 5', 'FÚTBOL 8', 'PÁDEL', 'TENIS'].map((label, i) => (
            <Chip key={label} variant={i === 0 ? 'fill' : 'outline'}>
              {label}
            </Chip>
          ))}
        </View>

        <Placeholder variant="field" style={{ height: 160 }} label="CANCHA · PHOTO" />

        <View className="border-card border-cy-line bg-cy-paper p-4">
          <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
            § SETUP OK
          </Text>
          <Text className="mt-2 font-display text-[28px] leading-[26px] text-cy-ink">
            MONOREPO LISTO.
          </Text>
          <Text className="mt-2 text-[13px] text-cy-muted">
            Tokens, primitives y Supabase client ya configurados. Vamos screen por screen desde el handoff.
          </Text>
          <View className="mt-4 flex-row gap-2">
            <Button variant="accent">
              <Icon name="bolt" size={14} color="#0d0d0d" />
              {'  '}EMPEZAR
            </Button>
            <Button variant="ghost">VER DOCS</Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

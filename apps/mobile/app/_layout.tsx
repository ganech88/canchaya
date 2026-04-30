import '../global.css'
import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black'
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue'
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono'
import { useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { preloadNhostSession } from '@/lib/nhost'

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ArchivoBlack: ArchivoBlack_400Regular,
    BebasNeue: BebasNeue_400Regular,
    SpaceGrotesk: SpaceGrotesk_400Regular,
    SpaceGroteskBold: SpaceGrotesk_700Bold,
    JetBrainsMono: JetBrainsMono_400Regular,
    JetBrainsMonoBold: JetBrainsMono_700Bold,
  })
  const [sessionHydrated, setSessionHydrated] = useState(false)

  useEffect(() => {
    preloadNhostSession()
      .catch(() => {})
      .finally(() => setSessionHydrated(true))
  }, [])

  useEffect(() => {
    if ((loaded || error) && sessionHydrated) {
      SplashScreen.hideAsync().catch(() => {})
    }
  }, [loaded, error, sessionHydrated])

  if ((!loaded && !error) || !sessionHydrated) return null

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 240,
          contentStyle: { backgroundColor: '#f2ede1' },
        }}
      >
        {/* Popup modal: transparente sobre el screen anterior (típicamente Home). */}
        <Stack.Screen
          name="popup/open-match"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            animationDuration: 180,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  )
}

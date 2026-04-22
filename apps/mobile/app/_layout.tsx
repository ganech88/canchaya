import '../global.css'
import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [loaded] = useFonts({
    // TODO: bajar los .ttf oficiales a assets/fonts/ y referenciarlos acá.
    // Por ahora NativeWind resuelve vía font-family del sistema + fallbacks.
  })

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {})
  }, [loaded])

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
      />
    </SafeAreaProvider>
  )
}

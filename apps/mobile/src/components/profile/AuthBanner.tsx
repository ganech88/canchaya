import { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { getNhost, isNhostConfigured } from '@/lib/nhost'

interface SessionUser {
  id: string
  email: string
  displayName: string
}

/**
 * Banner que aparece al tope del Profile screen. Si hay sesión, muestra el
 * email del user y un botón de cerrar sesión. Si no, un CTA "Entrar".
 * Si Nhost no está configurado, no se renderiza.
 */
export function AuthBanner() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [tick, setTick] = useState(0) // forzar re-read tras logout/login

  useEffect(() => {
    if (!isNhostConfigured()) {
      setUser(null)
      return
    }
    try {
      const session = getNhost().getUserSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          displayName: session.user.displayName ?? session.user.email ?? '',
        })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [tick])

  if (!isNhostConfigured()) return null

  if (!user) {
    return (
      <Pressable
        onPress={() => router.push('/login' as never)}
        className="flex-row items-center justify-between border-b-card border-cy-line bg-cy-ink px-4 py-3"
      >
        <View>
          <Text className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-accent">
            § ACCESO
          </Text>
          <Text className="mt-0.5 font-condensed text-[18px] leading-[18px] uppercase text-cy-paper">
            Iniciar sesión
          </Text>
        </View>
        <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
          ENTRAR →
        </Text>
      </Pressable>
    )
  }

  const onLogout = async () => {
    try {
      const nhost = getNhost()
      const refresh = nhost.getUserSession()?.refreshTokenId
      if (refresh) {
        await nhost.auth.signOut({ refreshToken: refresh })
      }
      nhost.clearSession()
    } catch {
      /* ignore */
    } finally {
      setTick((t) => t + 1)
    }
  }

  return (
    <View className="flex-row items-center justify-between border-b-card border-cy-line bg-cy-paper px-4 py-3">
      <View className="shrink">
        <Text className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
          § SESIÓN ACTIVA
        </Text>
        <Text
          numberOfLines={1}
          className="mt-0.5 font-condensed text-[16px] leading-[16px] uppercase text-cy-ink"
        >
          {user.displayName || user.email}
        </Text>
      </View>
      <Pressable onPress={onLogout}>
        <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
          SALIR
        </Text>
      </Pressable>
    </View>
  )
}

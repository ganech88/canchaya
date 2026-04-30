import { useState } from 'react'
import { View, Text, TextInput, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { Button } from '@canchaya/ui/native'
import { FetchError } from '@nhost/nhost-js/fetch'
import { getNhost, isNhostConfigured } from '@/lib/nhost'
import { ensureProfileMobile } from '@/lib/profile'

type Mode = 'signin' | 'signup'

interface AuthErrorBody {
  error?: string
  message?: string
}

function getErrorMessage(err: unknown): string {
  if (err instanceof FetchError) {
    const body = err.body as AuthErrorBody | undefined
    return body?.message ?? body?.error ?? err.message
  }
  if (err instanceof Error) return err.message
  return 'Error desconocido'
}

export function AuthForm({ initialMode = 'signin' }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const nhostReady = isNhostConfigured()

  const onSubmit = async () => {
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      const nhost = getNhost()
      if (mode === 'signup') {
        const res = await nhost.auth.signUpEmailPassword({
          email,
          password,
          options: { displayName: name, metadata: { name } },
        })
        if (!res.body.session) {
          setInfo('Te mandamos un email para verificar la cuenta. Confirmalo y volvé a entrar.')
          return
        }
        await ensureProfileMobile(nhost, name)
        router.replace('/')
      } else {
        await nhost.auth.signInEmailPassword({ email, password })
        await ensureProfileMobile(nhost)
        router.replace('/')
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="border-card border-cy-line bg-cy-paper">
        <View className="border-b-card border-cy-line bg-cy-ink px-4 py-3">
          <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
            § {mode === 'signin' ? 'ACCESO' : 'REGISTRO'}
          </Text>
          <Text className="mt-1 font-display text-[28px] leading-[24px] tracking-tight text-cy-paper">
            {mode === 'signin' ? 'ENTRAR.' : 'CREAR CUENTA.'}
          </Text>
        </View>

        {!nhostReady && (
          <View className="border-b-chip border-cy-red bg-cy-red/10 px-4 py-3">
            <Text className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
              ⚠ Demo — Nhost no configurado
            </Text>
            <Text className="mt-1 font-mono text-[11px] text-cy-ink">
              Setear EXPO_PUBLIC_NHOST_SUBDOMAIN y EXPO_PUBLIC_NHOST_REGION en .env
            </Text>
          </View>
        )}

        <View className="p-4">
          {mode === 'signup' && (
            <View className="pb-3">
              <Text className="pb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
                Nombre
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                autoComplete="name"
                autoCapitalize="words"
                className="border-chip border-cy-line bg-cy-bg px-3 py-2 font-ui text-[14px] text-cy-ink"
              />
            </View>
          )}

          <View className="pb-3">
            <Text className="pb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoComplete="email"
              autoCapitalize="none"
              keyboardType="email-address"
              className="border-chip border-cy-line bg-cy-bg px-3 py-2 font-mono text-[13px] text-cy-ink"
            />
          </View>

          <View className="pb-3">
            <Text className="pb-1 font-mono text-[9px] font-bold uppercase tracking-widest text-cy-muted">
              Contraseña
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              className="border-chip border-cy-line bg-cy-bg px-3 py-2 font-mono text-[13px] text-cy-ink"
            />
          </View>

          {error && (
            <View className="mb-3 border-chip border-cy-red bg-cy-red/10 px-3 py-2">
              <Text className="font-mono text-[11px] text-cy-red">{error}</Text>
            </View>
          )}

          {info && (
            <View className="mb-3 border-chip border-cy-line bg-cy-accent/20 px-3 py-2">
              <Text className="font-mono text-[11px] text-cy-ink">{info}</Text>
            </View>
          )}

          <Button
            variant="accent"
            onPress={onSubmit}
            disabled={loading || !nhostReady || !email || !password || (mode === 'signup' && !name)}
          >
            {loading
              ? '...'
              : !nhostReady
                ? 'Demo — no disponible'
                : mode === 'signin'
                  ? 'Entrar'
                  : 'Crear cuenta'}
          </Button>

          <View className="mt-4 border-t border-cy-line pt-4">
            <Text className="text-center font-mono text-[11px] text-cy-muted">
              {mode === 'signin' ? '¿Aún no tenés cuenta? ' : '¿Ya tenés cuenta? '}
              <Text
                onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-bold uppercase tracking-wider text-cy-ink"
              >
                {mode === 'signin' ? 'Crear una' : 'Entrar'}
              </Text>
            </Text>
            <Text
              onPress={() => router.back()}
              className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-cy-muted"
            >
              ← Volver
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBrowserClient, type CanchaYaClient } from '@canchaya/db'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey && !url.includes('placeholder') && !anonKey.includes('placeholder'))
}

let cachedClient: CanchaYaClient | null = null

export function getSupabase(): CanchaYaClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase no configurado. Copiá .env.example a .env con las credenciales del proyecto.',
    )
  }
  if (!cachedClient) {
    cachedClient = createBrowserClient({
      url: url!,
      anonKey: anonKey!,
      storage: AsyncStorage,
    })
  }
  return cachedClient
}

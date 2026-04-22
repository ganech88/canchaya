import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBrowserClient } from '@canchaya/db'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY no están seteados. Copiá .env.example a .env.',
  )
}

export const supabase = createBrowserClient({
  url,
  anonKey,
  storage: AsyncStorage,
})

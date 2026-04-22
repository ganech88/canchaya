import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export type CanchaYaClient = SupabaseClient<Database>

interface ClientConfig {
  url: string
  anonKey: string
  // opcional: para server actions / edge functions con más permisos
  serviceRoleKey?: string
  // React Native: pasar AsyncStorage desde el app. Web: undefined (localStorage por default).
  storage?: {
    getItem: (key: string) => Promise<string | null> | string | null
    setItem: (key: string, value: string) => Promise<void> | void
    removeItem: (key: string) => Promise<void> | void
  }
}

export function createBrowserClient({ url, anonKey, storage }: ClientConfig): CanchaYaClient {
  return createClient<Database>(url, anonKey, {
    auth: {
      storage: storage as never,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: typeof window !== 'undefined',
    },
  })
}

export function createServiceRoleClient({ url, serviceRoleKey }: ClientConfig): CanchaYaClient {
  if (!serviceRoleKey) {
    throw new Error('serviceRoleKey is required for service-role client')
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

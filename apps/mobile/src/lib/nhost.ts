import 'react-native-url-polyfill/auto'
import { createBrowserClient, type CanchaYaClient } from '@canchaya/db'
import { AsyncStorageBackend } from './nhost-storage'

const subdomain = process.env.EXPO_PUBLIC_NHOST_SUBDOMAIN
const region = process.env.EXPO_PUBLIC_NHOST_REGION

export function isNhostConfigured(): boolean {
  return Boolean(
    subdomain && region && !subdomain.includes('placeholder') && !region.includes('placeholder'),
  )
}

const storage = new AsyncStorageBackend()

let cachedClient: CanchaYaClient | null = null

/**
 * Hidratación de la sesión desde AsyncStorage. Llamar UNA vez al boot del app
 * (en app/_layout.tsx) antes de usar getNhost().
 */
export async function preloadNhostSession(): Promise<void> {
  await storage.preload()
}

export function getNhost(): CanchaYaClient {
  if (!isNhostConfigured()) {
    throw new Error(
      'Nhost no configurado. Setear EXPO_PUBLIC_NHOST_SUBDOMAIN y EXPO_PUBLIC_NHOST_REGION en .env.',
    )
  }
  if (!cachedClient) {
    cachedClient = createBrowserClient({
      subdomain: subdomain!,
      region: region!,
      storage,
    })
  }
  return cachedClient
}

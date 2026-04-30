import 'react-native-url-polyfill/auto'
import { createBrowserClient, type CanchaYaClient } from '@canchaya/db'

const subdomain = process.env.EXPO_PUBLIC_NHOST_SUBDOMAIN
const region = process.env.EXPO_PUBLIC_NHOST_REGION

export function isNhostConfigured(): boolean {
  return Boolean(
    subdomain && region && !subdomain.includes('placeholder') && !region.includes('placeholder'),
  )
}

let cachedClient: CanchaYaClient | null = null

// TODO: agregar AsyncStorage adapter para persistir sesión entre cold starts.
// La interfaz SessionStorageBackend de Nhost v4 es sync, AsyncStorage es async,
// así que necesita un wrapper con preload + cache. Diferido hasta tener auth funcional.
// Por ahora, sesión vive en memoria — re-login requerido al reabrir la app.
export function getNhost(): CanchaYaClient {
  if (!isNhostConfigured()) {
    throw new Error(
      'Nhost no configurado. Copiá .env.example a .env con EXPO_PUBLIC_NHOST_SUBDOMAIN y EXPO_PUBLIC_NHOST_REGION.',
    )
  }
  if (!cachedClient) {
    cachedClient = createBrowserClient({
      subdomain: subdomain!,
      region: region!,
    })
  }
  return cachedClient
}

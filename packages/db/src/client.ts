import {
  createClient,
  createServerClient,
  withAdminSession,
  type NhostClient,
  type NhostClientOptions,
} from '@nhost/nhost-js'
import { MemoryStorage, type SessionStorageBackend } from '@nhost/nhost-js/session'

export type CanchaYaClient = NhostClient

export interface ClientConfig {
  subdomain: string
  region: string
  // RN: pasar AsyncStorage adapter custom. Web browser: undefined → localStorage por default.
  storage?: SessionStorageBackend
  // Sólo server-side. NUNCA en bundle de cliente.
  adminSecret?: string
}

export function createBrowserClient({
  subdomain,
  region,
  storage,
}: ClientConfig): CanchaYaClient {
  const opts: NhostClientOptions = { subdomain, region }
  if (storage) opts.storage = storage
  return createClient(opts)
}

export function createSsrClient({
  subdomain,
  region,
  storage,
}: ClientConfig): CanchaYaClient {
  return createServerClient({
    subdomain,
    region,
    storage: storage ?? new MemoryStorage(),
  })
}

export function createAdminClientWithSecret({
  subdomain,
  region,
  adminSecret,
  role = 'user',
  userId,
}: ClientConfig & { role?: string; userId?: string }): CanchaYaClient {
  if (!adminSecret) {
    throw new Error('adminSecret is required for admin client')
  }
  const sessionVariables: Record<string, string> = {}
  if (userId) sessionVariables['user-id'] = userId
  return createServerClient({
    subdomain,
    region,
    storage: new MemoryStorage(),
    configure: [withAdminSession({ adminSecret, role, sessionVariables })],
  })
}

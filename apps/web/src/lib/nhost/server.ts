import { createSsrClient } from '@canchaya/db/client'
import type { CanchaYaClient } from '@canchaya/db'

export function isNhostConfigured(): boolean {
  const sub = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN
  const region = process.env.NEXT_PUBLIC_NHOST_REGION
  return Boolean(sub && region && !sub.includes('placeholder') && !region.includes('placeholder'))
}

export function getServerClient(): CanchaYaClient {
  if (!isNhostConfigured()) {
    throw new Error('Nhost no configurado en server context')
  }
  return createSsrClient({
    subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!,
    region: process.env.NEXT_PUBLIC_NHOST_REGION!,
  })
}

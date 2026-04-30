'use client'

import { createBrowserClient as createDbBrowserClient } from '@canchaya/db/client'
import type { CanchaYaClient } from '@canchaya/db'

export function isNhostConfigured(): boolean {
  const sub = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN
  const region = process.env.NEXT_PUBLIC_NHOST_REGION
  return Boolean(sub && region && !sub.includes('placeholder') && !region.includes('placeholder'))
}

let cached: CanchaYaClient | null = null

export function getBrowserClient(): CanchaYaClient {
  if (!isNhostConfigured()) {
    throw new Error(
      'Nhost no configurado. Setear NEXT_PUBLIC_NHOST_SUBDOMAIN y NEXT_PUBLIC_NHOST_REGION.',
    )
  }
  if (!cached) {
    cached = createDbBrowserClient({
      subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!,
      region: process.env.NEXT_PUBLIC_NHOST_REGION!,
    })
  }
  return cached
}

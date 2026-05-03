// Owner context resolution. Por ahora, el dashboard demuestra el flow con el
// system user seedeado (`00000000-...001`) — una vez que pongamos auth real
// en /owner/*, este helper lee la sesión SSR y resuelve `ownerId` desde el JWT.

import { createAdminClientWithSecret } from '@canchaya/db/client'
import { fetchOwnerVenues, type OwnerVenueSummary } from '@canchaya/db'
import type { CanchaYaClient } from '@canchaya/db'
import { isNhostConfigured } from './server'

const DEMO_OWNER_ID = '00000000-0000-0000-0000-000000000001'

export interface OwnerContext {
  ownerId: string
  client: CanchaYaClient
  venues: OwnerVenueSummary[]
  selectedVenue: OwnerVenueSummary
}

function getAdminSecret(): string {
  const secret = process.env.NHOST_ADMIN_SECRET
  if (!secret) {
    throw new Error('NHOST_ADMIN_SECRET no está definido en server context')
  }
  return secret
}

export function getOwnerAdminClient(ownerId: string = DEMO_OWNER_ID): CanchaYaClient {
  if (!isNhostConfigured()) {
    throw new Error('Nhost no configurado en server context')
  }
  return createAdminClientWithSecret({
    subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!,
    region: process.env.NEXT_PUBLIC_NHOST_REGION!,
    adminSecret: getAdminSecret(),
    role: 'owner',
    userId: ownerId,
  })
}

/**
 * Devuelve el contexto del owner: cliente Nhost, lista de sus venues, y el
 * venue seleccionado por defecto. Si Nhost no está configurado o el owner no
 * tiene venues, devuelve null y la página decide mostrar fallback.
 *
 * `selectedVenueSlug` permite que las páginas que reciben el slug por param
 * lo usen para acotar; si no se pasa, toma el primer venue.
 */
export async function getOwnerContext(
  selectedVenueSlug?: string,
): Promise<OwnerContext | null> {
  if (!isNhostConfigured() || !process.env.NHOST_ADMIN_SECRET) {
    return null
  }
  try {
    const client = getOwnerAdminClient()
    const venues = await fetchOwnerVenues(client, DEMO_OWNER_ID)
    if (venues.length === 0) return null
    const selectedVenue =
      (selectedVenueSlug && venues.find((v) => v.slug === selectedVenueSlug)) || venues[0]!
    return { ownerId: DEMO_OWNER_ID, client, venues, selectedVenue }
  } catch {
    return null
  }
}

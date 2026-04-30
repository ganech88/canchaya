// POST /v1/functions/createPaymentPreference
// Crea una preference en Mercado Pago para una booking y devuelve init_point.
//
// Body: { booking_id: string }
// Headers: Authorization: Bearer <user_jwt> (Nhost lo inyecta)
// Response: { init_point: string, preference_id: string }
//
// Env vars requeridas:
//   MP_ACCESS_TOKEN          — APP_USR-... del owner del marketplace MP
//   APP_URL                  — base URL del web (https://canchaya.vercel.app)
//   APP_DEEP_LINK            — scheme del mobile app (canchaya://)
//   NHOST_ADMIN_SECRET       — para querear bookings server-side (Nhost lo inyecta automáticamente como NHOST_ADMIN_SECRET en functions)
//   NHOST_GRAPHQL_URL        — endpoint GraphQL (Nhost lo inyecta como NHOST_GRAPHQL_URL)

import type { Request, Response } from 'express'

interface MPPreferenceItem {
  title: string
  quantity: number
  unit_price: number
  currency_id: string
}

interface MPPreferenceRequest {
  items: MPPreferenceItem[]
  external_reference: string
  notification_url: string
  back_urls: {
    success: string
    pending: string
    failure: string
  }
  auto_return: 'approved'
  payer?: { email: string }
}

interface MPPreferenceResponse {
  id: string
  init_point: string
  sandbox_init_point: string
}

interface BookingForPayment {
  id: string
  total_cents: number
  deposit_cents: number
  host_id: string
  status: string
  payment_status: string
  court: {
    name: string
    venue: { name: string; country: { currency: string } }
  }
  host: { email: string }
}

const Q_BOOKING = `
  query GetBookingForPayment($id: uuid!) {
    bookings_by_pk(id: $id) {
      id total_cents deposit_cents host_id status payment_status
      court { name venue { name country { currency } } }
      host { email }
    }
  }
`

const M_UPDATE_BOOKING = `
  mutation MarkBookingPending($id: uuid!, $extId: String!) {
    update_bookings_by_pk(
      pk_columns: {id: $id},
      _set: {
        payment_provider: "mercado_pago",
        external_payment_id: $extId,
        payment_status: "processing"
      }
    ) { id }
  }
`

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const url = process.env.NHOST_GRAPHQL_URL
  const adminSecret = process.env.NHOST_ADMIN_SECRET
  if (!url || !adminSecret) throw new Error('Missing NHOST_GRAPHQL_URL or NHOST_ADMIN_SECRET')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': adminSecret },
    body: JSON.stringify({ query, variables }),
  })
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> }
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '))
  if (!json.data) throw new Error('Empty GraphQL data')
  return json.data
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const accessToken = process.env.MP_ACCESS_TOKEN
  const appUrl = process.env.APP_URL ?? 'https://canchaya.vercel.app'
  if (!accessToken) {
    res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurada' })
    return
  }

  const { booking_id } = (req.body ?? {}) as { booking_id?: string }
  if (!booking_id) {
    res.status(400).json({ error: 'booking_id requerido' })
    return
  }

  // 1. Traer la booking
  const data = await gql<{ bookings_by_pk: BookingForPayment | null }>(Q_BOOKING, {
    id: booking_id,
  })
  const booking = data.bookings_by_pk
  if (!booking) {
    res.status(404).json({ error: 'Booking no encontrada' })
    return
  }
  if (booking.payment_status === 'paid') {
    res.status(409).json({ error: 'Booking ya pagada' })
    return
  }

  // 2. Crear preference en MP
  const amountToCharge = (booking.deposit_cents > 0 ? booking.deposit_cents : booking.total_cents) / 100

  const mpRequest: MPPreferenceRequest = {
    items: [
      {
        title: `${booking.court.venue.name} · ${booking.court.name}`,
        quantity: 1,
        unit_price: amountToCharge,
        currency_id: booking.court.venue.country.currency,
      },
    ],
    external_reference: booking.id,
    notification_url: `${appUrl.replace(/\/$/, '')}/api/mp-webhook`,
    back_urls: {
      success: `${appUrl}/bookings/${booking.id}?status=success`,
      pending: `${appUrl}/bookings/${booking.id}?status=pending`,
      failure: `${appUrl}/bookings/${booking.id}?status=failure`,
    },
    auto_return: 'approved',
    payer: booking.host.email ? { email: booking.host.email } : undefined,
  }

  const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(mpRequest),
  })
  if (!mpRes.ok) {
    const err = await mpRes.text()
    res.status(502).json({ error: 'MP API error', detail: err })
    return
  }
  const mpPref = (await mpRes.json()) as MPPreferenceResponse

  // 3. Marcar booking como processing con el preference_id
  await gql<{ update_bookings_by_pk: { id: string } }>(M_UPDATE_BOOKING, {
    id: booking.id,
    extId: mpPref.id,
  })

  res.status(200).json({
    init_point: mpPref.init_point,
    preference_id: mpPref.id,
  })
}

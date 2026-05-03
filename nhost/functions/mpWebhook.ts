// POST /v1/functions/mpWebhook
// Recibe notificaciones de Mercado Pago (IPN/webhook) y actualiza la booking.
//
// MP llama con: ?type=payment&data.id=<paymentId>
// (o body JSON con la misma info, según versión)
//
// Flujo:
//   1. Verificar firma X-Signature (HMAC-SHA256 con MP_WEBHOOK_SECRET)
//   2. Pedir el payment a MP API: GET /v1/payments/{id}
//   3. De ahí sacar external_reference (booking_id) y status
//   4. Update booking según status:
//      - approved → status=paid, payment_status=paid
//      - pending  → payment_status=pending
//      - rejected → payment_status=failed
//
// Env: MP_ACCESS_TOKEN, NHOST_GRAPHQL_URL, NHOST_ADMIN_SECRET, MP_WEBHOOK_SECRET

import type { Request, Response } from 'express'
import { createHmac, timingSafeEqual } from 'crypto'

interface MPPayment {
  id: number
  status: 'approved' | 'pending' | 'in_process' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back'
  external_reference: string
  transaction_amount: number
}

const M_UPDATE = `
  mutation UpdateBookingFromMP($id: uuid!, $bookingStatus: booking_status!, $paymentStatus: payment_status!) {
    update_bookings_by_pk(
      pk_columns: {id: $id},
      _set: { status: $bookingStatus, payment_status: $paymentStatus }
    ) { id status payment_status }
  }
`

const M_INSERT_CHAT = `
  mutation NotifyChatPaid($bookingId: uuid!, $amount: Int!) {
    insert_chat_messages_one(object: {
      booking_id: $bookingId,
      kind: "system",
      meta: {type: "paid", amount_cents: $amount}
    }) { id }
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

/**
 * Valida la firma del webhook según el spec de Mercado Pago.
 *
 * Header `x-signature`: `ts=<timestamp>,v1=<hmac-sha256-hex>`
 * Manifest: `id:<data_id>;request-id:<req-id>;ts:<ts>;`
 * Comparación: timingSafeEqual contra HMAC-SHA256(MP_WEBHOOK_SECRET, manifest)
 *
 * Ref: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
function verifyMPSignature(req: Request, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  // Si no hay secret seteado, lo dejamos pasar pero loggeamos. Necesario para
  // setup inicial; en prod debería estar siempre configurado.
  if (!secret) return true

  const sigHeader = req.header('x-signature') ?? ''
  const reqId = req.header('x-request-id') ?? ''
  if (!sigHeader || !reqId) return false

  const parts = sigHeader.split(',').reduce<Record<string, string>>((acc, p) => {
    const [k, v] = p.split('=').map((s) => s.trim())
    if (k && v) acc[k] = v
    return acc
  }, {})
  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${reqId};ts:${ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')

  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(v1, 'hex')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function bookingStatusFromMP(mpStatus: MPPayment['status']): {
  bookingStatus: string
  paymentStatus: string
} {
  switch (mpStatus) {
    case 'approved':
      return { bookingStatus: 'paid', paymentStatus: 'paid' }
    case 'pending':
    case 'in_process':
      return { bookingStatus: 'pending', paymentStatus: 'processing' }
    case 'rejected':
    case 'cancelled':
      return { bookingStatus: 'pending', paymentStatus: 'failed' }
    case 'refunded':
    case 'charged_back':
      return { bookingStatus: 'cancelled', paymentStatus: 'refunded' }
    default:
      return { bookingStatus: 'pending', paymentStatus: 'pending' }
  }
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) {
    res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurada' })
    return
  }

  // MP manda type en query string o body — soportamos ambos.
  const type = (req.query.type as string) ?? (req.body as { type?: string })?.type
  const dataIdRaw =
    (req.query['data.id'] as string) ??
    (req.body as { data?: { id?: string | number } })?.data?.id

  if (type !== 'payment' || !dataIdRaw) {
    // Otros tipos (merchant_order, plan, subscription) los ignoramos por ahora
    res.status(200).json({ ignored: true })
    return
  }

  const dataId = String(dataIdRaw)

  // Validación de firma — MP_WEBHOOK_SECRET seteado en dashboard.
  if (!verifyMPSignature(req, dataId)) {
    res.status(401).json({ error: 'Invalid signature' })
    return
  }

  // Traer payment de MP API
  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!mpRes.ok) {
    res.status(502).json({ error: 'MP API error' })
    return
  }
  const payment = (await mpRes.json()) as MPPayment

  if (!payment.external_reference) {
    res.status(400).json({ error: 'Payment sin external_reference' })
    return
  }

  const { bookingStatus, paymentStatus } = bookingStatusFromMP(payment.status)

  await gql<{ update_bookings_by_pk: { id: string } | null }>(M_UPDATE, {
    id: payment.external_reference,
    bookingStatus,
    paymentStatus,
  })

  // Notificar al chat de la booking si pagó (best-effort, no bloquea)
  if (payment.status === 'approved') {
    try {
      await gql(M_INSERT_CHAT, {
        bookingId: payment.external_reference,
        amount: Math.round(payment.transaction_amount * 100),
      })
    } catch {
      /* ignore */
    }
  }

  res.status(200).json({ ok: true, status: bookingStatus })
}

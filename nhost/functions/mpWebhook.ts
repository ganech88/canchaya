// POST /v1/functions/mpWebhook
// Recibe notificaciones de Mercado Pago (IPN/webhook) y actualiza la booking.
//
// MP llama con: ?type=payment&data.id=<paymentId>
// (o body JSON con la misma info, según versión)
//
// Flujo:
//   1. Verificar firma (TODO: implementar X-Signature header validation)
//   2. Pedir el payment a MP API: GET /v1/payments/{id}
//   3. De ahí sacar external_reference (booking_id) y status
//   4. Update booking según status:
//      - approved → status=paid, payment_status=paid
//      - pending  → payment_status=pending
//      - rejected → payment_status=failed
//
// Env: MP_ACCESS_TOKEN, NHOST_GRAPHQL_URL, NHOST_ADMIN_SECRET, MP_WEBHOOK_SECRET (TODO)

import type { Request, Response } from 'express'

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

  // TODO: validar X-Signature header (HMAC-SHA256 con MP_WEBHOOK_SECRET).
  // Sin esto, cualquiera puede mandar notificaciones falsas. CRÍTICO antes de prod.

  // MP manda type en query string o body — soportamos ambos.
  const type = (req.query.type as string) ?? (req.body as { type?: string })?.type
  const dataId =
    (req.query['data.id'] as string) ??
    (req.body as { data?: { id?: string | number } })?.data?.id

  if (type !== 'payment' || !dataId) {
    // Otros tipos (merchant_order, plan, subscription) los ignoramos por ahora
    res.status(200).json({ ignored: true })
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

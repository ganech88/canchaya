// Placeholder — el chart de 30d del handoff vive en el Dashboard. Cuando se requiera una vista
// dedicada de ingresos con más granularidad (breakdown por cancha, por día de la semana, etc.),
// este archivo se expande.

import { redirect } from 'next/navigation'

export default function RevenuePage() {
  redirect('/owner/dashboard')
}

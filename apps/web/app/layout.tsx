import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CanchaYa — Dashboard',
  description: 'Gestioná tu complejo deportivo: reservas, canchas, bebidas y analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  )
}

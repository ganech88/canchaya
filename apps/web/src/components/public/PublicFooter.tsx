import Link from 'next/link'

const PLAYER_LINKS = [
  { label: 'Buscar cancha', href: '/results' },
  { label: 'Partidos abiertos', href: '/matches' },
  { label: 'App móvil', href: '/app' },
  { label: 'Entrar', href: '/login' },
] as const

export function PublicFooter() {
  return (
    <footer className="border-t-card border-cy-line bg-cy-ink text-cy-paper">
      <div className="mx-auto max-w-[1280px] grid grid-cols-4 gap-10 px-7 py-10">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-cy-accent">
            § CanchaYa
          </p>
          <p className="mt-2 font-display text-[26px] leading-[22px] tracking-tight text-cy-paper">
            JUGÁ CERCA.
          </p>
          <p className="mt-3 max-w-[200px] font-ui text-[12px] text-cy-paper/70">
            Marketplace de reserva de canchas deportivas. LATAM. Mobile + Web.
          </p>
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
            Para jugadores
          </p>
          {PLAYER_LINKS.map((it) => (
            <Link
              key={it.href}
              href={it.href as never}
              className="block py-1 font-mono text-[11px] text-cy-paper/80 hover:text-cy-accent"
            >
              {it.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
            Para dueños
          </p>
          {['Dashboard', 'Software', 'Tarifas', 'Contacto ventas'].map((t) => (
            <p key={t} className="py-1 font-mono text-[11px] text-cy-paper/80 hover:text-cy-accent">
              {t}
            </p>
          ))}
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
            Legal
          </p>
          {['Términos', 'Privacidad', 'Cookies', 'Reembolsos'].map((t) => (
            <p key={t} className="py-1 font-mono text-[11px] text-cy-paper/80 hover:text-cy-accent">
              {t}
            </p>
          ))}
        </div>
      </div>

      <div className="border-t border-cy-paper/15 px-7 py-4 text-center font-mono text-[10px] uppercase tracking-widest text-cy-paper/50">
        © 2026 CanchaYa — Argentina, México, Chile, Uruguay, Perú, Colombia, Brasil +
      </div>
    </footer>
  )
}

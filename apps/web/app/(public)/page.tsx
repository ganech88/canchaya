import { Icon } from '@canchaya/ui/icons'
import { Eyebrow, Stamp, Chip } from '@canchaya/ui/web'
import { SectionTitle } from '@/components/owner/SectionTitle'
import { HeroSearch } from '@/components/public/HeroSearch'
import { VenueCard } from '@/components/public/VenueCard'
import { SportRail } from '@/components/public/SportRail'
import { CityRail } from '@/components/public/CityRail'
import { MOCK_VENUES } from '@/data/mock'

export default function LandingPage() {
  const featured = MOCK_VENUES.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="border-b-card border-cy-line bg-cy-paper">
        <div className="mx-auto max-w-[1280px] px-7 pb-7 pt-14">
          <Eyebrow>HOY · BUENOS AIRES</Eyebrow>
          <h1 className="mt-4 font-display text-[110px] leading-[0.85] tracking-tighter text-cy-ink">
            JUGÁ<br />CERCA.
          </h1>
          <p className="mt-5 max-w-[560px] font-ui text-[16px] text-cy-muted">
            Reservá canchas en 9 países de LATAM. Fútbol, pádel, tenis, básquet y vóley. Sumate a
            partidos abiertos cerca tuyo.
          </p>

          <div className="mt-8 max-w-[960px]">
            <HeroSearch />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Stamp>+2.500 canchas</Stamp>
            <Stamp>9 países</Stamp>
            <Stamp>Reservá con 50%</Stamp>
          </div>
        </div>
      </section>

      {/* Deportes */}
      <section className="mx-auto max-w-[1280px] px-7 py-10">
        <SectionTitle eyebrow="CATÁLOGO" title="Elegí tu deporte" />
        <SportRail />
      </section>

      {/* Canchas destacadas */}
      <section className="mx-auto max-w-[1280px] px-7 py-10">
        <SectionTitle
          eyebrow="CERCA TUYO · HOY"
          title="Canchas destacadas"
          right={
            <a
              href="/results"
              className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cy-ink hover:text-cy-red"
            >
              Ver todas
              <Icon name="arrow" size={12} />
            </a>
          }
        />
        <div className="grid grid-cols-3 gap-5">
          {featured.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      </section>

      {/* Partido abierto banner */}
      <section className="mx-auto max-w-[1280px] px-7 py-10">
        <a
          href="/matches"
          className="group flex items-stretch border-card border-cy-line bg-cy-accent hover:bg-cy-accent-2"
        >
          <div className="flex-1 px-7 py-6">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-ink">
              § PARTIDO ABIERTO · HOY 21:00
            </p>
            <p className="mt-2 font-display text-[54px] leading-[0.88] tracking-tight text-cy-ink">
              FALTAN 2 JUGADORES.
            </p>
            <p className="mt-3 font-ui text-[14px] text-cy-ink">
              F5 · El Potrero · Villa Crespo · 0.8 km · Nivel intermedio · $2.6K por jugador
            </p>
          </div>
          <div className="flex w-[120px] items-center justify-center bg-cy-ink text-cy-accent transition-colors group-hover:bg-cy-paper group-hover:text-cy-ink">
            <Icon name="arrow" size={36} />
          </div>
        </a>
      </section>

      {/* Ciudades */}
      <section className="mx-auto max-w-[1280px] px-7 py-10">
        <SectionTitle eyebrow="EXPLORÁ" title="Por ciudad" />
        <CityRail />
      </section>

      {/* B2B teaser */}
      <section className="bg-cy-ink py-16">
        <div className="mx-auto max-w-[1280px] px-7">
          <div className="flex items-center gap-10">
            <div className="flex-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
                § PARA DUEÑOS DE COMPLEJOS
              </p>
              <p className="mt-4 font-display text-[72px] leading-[0.85] tracking-tighter text-cy-paper">
                VENDÉ MÁS<br />TURNOS.
              </p>
              <p className="mt-4 max-w-[520px] font-ui text-[16px] text-cy-paper/80">
                Dashboard, calendario, analytics de bebidas, gestión de canchas. Dejá de armar la
                grilla en papel — nosotros nos encargamos.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="/owner/dashboard"
                  className="inline-flex items-center gap-2 border-card border-cy-paper bg-cy-accent px-4 py-3 font-ui text-[13px] font-bold uppercase tracking-wide text-cy-ink hover:opacity-90"
                >
                  Ver demo
                  <Icon name="arrow" size={14} />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 border-card border-cy-paper bg-transparent px-4 py-3 font-ui text-[13px] font-bold uppercase tracking-wide text-cy-paper hover:bg-cy-paper hover:text-cy-ink"
                >
                  Hablar con ventas
                </a>
              </div>
            </div>
            <div className="w-[360px]">
              <div className="flex flex-col gap-3">
                {[
                  { k: 'Ingresos/mes promedio', v: '+22%' },
                  { k: 'Ocupación promedio', v: '82%' },
                  { k: 'Reservas vía app', v: '68%' },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="flex items-baseline justify-between border-chip border-cy-paper p-4"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-cy-paper/60">
                      {s.k}
                    </span>
                    <span className="font-display text-[26px] leading-[22px] tracking-tight text-cy-accent">
                      {s.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

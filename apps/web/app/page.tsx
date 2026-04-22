// Placeholder del dashboard del dueño — lo reemplazamos por OwnerDashboard del handoff cuando avancemos.

import { Masthead, Chip, Button, Eyebrow, Stamp, Placeholder } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'

export default function DashboardPlaceholder() {
  return (
    <main className="min-h-screen bg-cy-bg">
      <Masthead
        dateStr="ABR·22·2026"
        issue="DASHBOARD · OWNER"
        section="PANEL"
        title="CANCHAYA."
        sub="Monorepo operativo. Los 10 modelos del schema están listos y el design system consumible desde @canchaya/ui."
      />

      <div className="mx-auto max-w-[1280px] px-8 py-10">
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-8 border-card border-cy-line bg-cy-paper p-8">
            <Eyebrow>Setup</Eyebrow>
            <h1 className="mt-3 font-display text-[84px] leading-[0.85] tracking-tighter text-cy-ink">
              LISTO<br />PARA ARMAR.
            </h1>
            <p className="mt-6 max-w-xl text-[14px] text-cy-muted">
              Los 14 screens del handoff se implementan sobre estos primitives. La próxima
              iteración: Home del usuario (mobile) y Dashboard del dueño (web).
            </p>
            <div className="mt-8 flex gap-3">
              <Button variant="accent">
                <Icon name="bolt" size={14} />
                Empezar por Home
              </Button>
              <Button variant="ghost">Ver handoff</Button>
            </div>
          </section>

          <aside className="col-span-4 space-y-4">
            <div className="border-card border-cy-line bg-cy-paper p-6">
              <Eyebrow>Stack</Eyebrow>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between border-b border-cy-line py-1 font-mono text-[11px]">
                  <span>MOBILE</span>
                  <span className="text-cy-muted">Expo 52 + NW</span>
                </div>
                <div className="flex justify-between border-b border-cy-line py-1 font-mono text-[11px]">
                  <span>WEB</span>
                  <span className="text-cy-muted">Next 15</span>
                </div>
                <div className="flex justify-between border-b border-cy-line py-1 font-mono text-[11px]">
                  <span>DB</span>
                  <span className="text-cy-muted">Supabase · RLS</span>
                </div>
                <div className="flex justify-between py-1 font-mono text-[11px]">
                  <span>TOKENS</span>
                  <span className="text-cy-muted">@canchaya/ui</span>
                </div>
              </div>
            </div>

            <Placeholder variant="field" className="h-[180px]" label="CANCHA · PREVIEW" />

            <div className="flex flex-wrap gap-2">
              <Chip variant="accent">Editorial</Chip>
              <Chip variant="fill">Mobile-first</Chip>
              <Chip>RN + Next</Chip>
              <Stamp>v0.1.0</Stamp>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

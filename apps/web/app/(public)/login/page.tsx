import { Stamp } from '@canchaya/ui/web'
import { AuthForm } from '@/components/public/AuthForm'

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[960px] items-center gap-10 px-7 py-14">
      <div className="flex-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
          § CANCHAYA · ACCESO
        </p>
        <h1 className="mt-3 font-display text-[84px] leading-[0.85] tracking-tighter text-cy-ink">
          JUGÁ<br />YA.
        </h1>
        <p className="mt-5 max-w-[420px] font-ui text-[15px] text-cy-muted">
          Reservá canchas, sumate a partidos abiertos, chateá con tu equipo. Todo desde acá.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Stamp>Mobile + Web</Stamp>
          <Stamp>LATAM</Stamp>
          <Stamp>Seña 50%</Stamp>
        </div>
      </div>

      <AuthForm />
    </div>
  )
}

import { Stamp } from '@canchaya/ui/web'
import { AuthForm } from '@/components/public/AuthForm'

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[960px] items-center gap-10 px-7 py-14">
      <div className="flex-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
          § CANCHAYA · REGISTRO
        </p>
        <h1 className="mt-3 font-display text-[84px] leading-[0.85] tracking-tighter text-cy-ink">
          UNITE.
        </h1>
        <p className="mt-5 max-w-[420px] font-ui text-[15px] text-cy-muted">
          Creá tu cuenta y empezá a reservar hoy mismo. Gratis, sin compromiso.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Stamp>+2.500 canchas</Stamp>
          <Stamp>9 países</Stamp>
          <Stamp>Comunidad activa</Stamp>
        </div>
      </div>

      <AuthForm initialMode="signup" />
    </div>
  )
}

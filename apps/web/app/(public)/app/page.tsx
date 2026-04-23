import Link from 'next/link'
import { Stamp } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'

export const metadata = {
  title: 'CanchaYa — App Android',
  description: 'Descargá la app de CanchaYa para Android.',
}

export default function AppPage() {
  const apkUrl = process.env.NEXT_PUBLIC_ANDROID_APK_URL
  const hasDirectApk = apkUrl && apkUrl.length > 0

  return (
    <div className="mx-auto max-w-[960px] px-7 py-14">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-red">
        § CANCHAYA · MÓVIL
      </p>
      <h1 className="mt-3 font-display text-[84px] leading-[0.85] tracking-tighter text-cy-ink">
        DESCARGÁ<br />LA APP.
      </h1>
      <p className="mt-5 max-w-[560px] font-ui text-[16px] text-cy-muted">
        Reservá canchas más rápido, recibí push cuando se arma un partido cerca tuyo, chateá con
        tu equipo. Disponible para Android.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Stamp>Android 8+</Stamp>
        <Stamp>~25 MB</Stamp>
        <Stamp>Gratis</Stamp>
      </div>

      {/* Primary CTA */}
      <div className="mt-8 border-card border-cy-line bg-cy-paper">
        <div className="border-b-card border-cy-line bg-cy-ink px-5 py-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
            § OPCIÓN 1 — APK DIRECTO
          </p>
        </div>

        <div className="p-6">
          {hasDirectApk ? (
            <>
              <p className="font-ui text-[14px] text-cy-ink">
                Descargá el <strong>APK</strong> directo. Al abrir el archivo, tu Android te va a
                pedir permiso para instalar apps de orígenes desconocidos — aceptalo, después se
                instala como cualquier otra app.
              </p>
              <Link
                href={apkUrl as never}
                className="mt-5 inline-flex items-center gap-2 border-card border-cy-line bg-cy-accent px-5 py-3 font-ui text-[14px] font-bold uppercase tracking-wide text-cy-ink hover:opacity-90"
              >
                Descargar APK
                <Icon name="arrow" size={14} />
              </Link>
            </>
          ) : (
            <>
              <p className="font-ui text-[14px] text-cy-ink">
                Estamos terminando el <strong>primer release</strong> de la app. En las próximas
                horas va a estar disponible el APK para descarga directa.
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-cy-muted">
                Mientras tanto, podés probar la app en modo preview (ver opción 2 ↓).
              </p>
              <div className="mt-4 inline-flex items-center gap-2 border-card border-cy-line bg-cy-sand px-5 py-3 font-ui text-[14px] font-bold uppercase tracking-wide text-cy-muted">
                APK próximamente
              </div>
            </>
          )}
        </div>
      </div>

      {/* Alternativa: Expo Go */}
      <div className="mt-6 border-card border-cy-line bg-cy-paper">
        <div className="border-b-card border-cy-line bg-cy-ink px-5 py-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-accent">
            § OPCIÓN 2 — EXPO GO (PREVIEW)
          </p>
        </div>

        <div className="p-6">
          <p className="font-ui text-[14px] text-cy-ink">
            Si querés probar la app sin esperar el APK, usá <strong>Expo Go</strong> — un wrapper
            gratis que corre el bundle de la app directo desde el dev server.
          </p>

          <ol className="mt-5 space-y-4">
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center border-chip border-cy-line bg-cy-accent font-display text-[14px] text-cy-ink">
                1
              </span>
              <div>
                <p className="font-ui text-[13px] text-cy-ink">
                  Bajá <strong>Expo Go</strong> desde Play Store.
                </p>
                <Link
                  href={'https://play.google.com/store/apps/details?id=host.exp.exponent' as never}
                  className="mt-1 inline-block font-mono text-[11px] font-bold uppercase tracking-wider text-cy-red hover:text-cy-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir Play Store →
                </Link>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center border-chip border-cy-line bg-cy-accent font-display text-[14px] text-cy-ink">
                2
              </span>
              <p className="font-ui text-[13px] text-cy-ink">
                Escaneá el código QR que compartimos en el canal de beta testers.
              </p>
            </li>
            <li className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center border-chip border-cy-line bg-cy-accent font-display text-[14px] text-cy-ink">
                3
              </span>
              <p className="font-ui text-[13px] text-cy-ink">Ya podés usar CanchaYa móvil.</p>
            </li>
          </ol>
        </div>
      </div>

      {/* Beta list */}
      <div className="mt-6 border-card border-cy-line bg-cy-accent p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cy-ink">
          § SUMATE AL BETA
        </p>
        <p className="mt-2 font-condensed text-[22px] leading-tight uppercase text-cy-ink">
          Enterate cuando liberemos nuevos builds
        </p>
        <p className="mt-1 font-ui text-[13px] text-cy-ink">
          Te avisamos por email cada vez que publicamos una versión. Sin spam.
        </p>
        <form className="mt-4 flex gap-2">
          <input
            type="email"
            required
            placeholder="tu@email.com"
            className="flex-1 border-card border-cy-line bg-cy-paper px-3 py-2.5 font-mono text-[13px] text-cy-ink focus:outline-none focus:border-cy-red"
          />
          <button
            type="submit"
            className="border-card border-cy-line bg-cy-ink px-4 py-2.5 font-ui text-[13px] font-bold uppercase tracking-wide text-cy-accent hover:opacity-90"
            disabled
          >
            Avisame
          </button>
        </form>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-cy-ink/60">
          Wiring del form: pendiente de configuración de Supabase / mail provider
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="font-mono text-[11px] font-bold uppercase tracking-widest text-cy-ink hover:text-cy-red"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}

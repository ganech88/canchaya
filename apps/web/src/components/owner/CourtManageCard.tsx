import { Chip, Button, Placeholder, type PlaceholderVariant } from '@canchaya/ui/web'
import { cn } from '@canchaya/ui'

export interface OwnerCourt {
  number: number
  name: string
  surface: string
  covered: boolean
  price: number
  status: 'ACTIVA' | 'MANTENIMIENTO' | 'INACTIVA'
  occupancyPct: number
  imgVariant: PlaceholderVariant
}

interface Props {
  court: OwnerCourt
}

export function CourtManageCard({ court }: Props) {
  const priceK = court.price / 1000
  const occupancyColor = court.occupancyPct > 80 ? 'bg-cy-red' : 'bg-cy-ink'

  return (
    <article className="border-card border-cy-line bg-cy-paper">
      <div className="relative">
        <Placeholder variant={court.imgVariant} className="h-[120px] w-full" label="Foto" />
        <div className="absolute left-2 top-2">
          <Chip variant="fill">{court.status}</Chip>
        </div>
        <div className="absolute right-2 top-2">
          <Chip variant="accent">N°{String(court.number).padStart(2, '0')}</Chip>
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="font-display text-[20px] leading-[18px] tracking-tight text-cy-ink">
          {court.name}
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-cy-muted">
          {court.surface.toUpperCase()} · {court.covered ? 'TECHADA' : 'AL AIRE LIBRE'}
        </p>

        <div className="my-2.5 h-[2px] bg-cy-line" />

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">
              Precio / hora
            </p>
            <p className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
              ${priceK % 1 === 0 ? priceK.toFixed(0) : priceK.toFixed(1)}K
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-cy-muted">
              Ocupación 30d
            </p>
            <p className="font-display text-[22px] leading-[20px] tracking-tight text-cy-ink">
              {court.occupancyPct}%
            </p>
            <div className="mt-1 h-1 bg-cy-sand">
              <div
                className={cn('h-full', occupancyColor)}
                style={{ width: `${court.occupancyPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-1.5">
          <Button variant="ghost" className="flex-1 !px-2.5 !py-2 !text-[11px]">
            Editar
          </Button>
          <Button variant="accent" className="flex-1 !px-2.5 !py-2 !text-[11px]">
            Tarifas
          </Button>
        </div>
      </div>
    </article>
  )
}

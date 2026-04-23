import Link from 'next/link'
import { CITIES, COUNTRIES } from '@/data/mock'

export function CityRail() {
  // Top 10 cities for rendering — la lista entera vive en la URL dinámica.
  const top = CITIES.slice(0, 10)

  return (
    <div className="grid grid-cols-5 gap-3">
      {top.map((c) => {
        const country = COUNTRIES.find((x) => x.code === c.country)
        return (
          <Link
            key={c.code}
            href={`/results?city=${c.code}` as never}
            className="flex items-center justify-between border-chip border-cy-line bg-cy-paper px-4 py-3 transition-colors hover:bg-cy-ink hover:text-cy-accent"
          >
            <div>
              <p className="font-condensed text-[16px] uppercase">{c.name}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest opacity-60">
                {country?.name ?? c.country}
              </p>
            </div>
            <span className="text-[18px]">{country?.flag ?? ''}</span>
          </Link>
        )
      })}
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { Chip } from '@canchaya/ui/web'
import { CourtManageCard, type OwnerCourt } from './CourtManageCard'

interface Props {
  courts: OwnerCourt[]
}

type TabKey = 'TODAS' | 'FÚTBOL' | 'PÁDEL' | 'TENIS' | 'INACTIVAS'

function categorize(c: OwnerCourt): TabKey[] {
  const tabs: TabKey[] = ['TODAS']
  const lower = c.name.toLowerCase()
  if (
    lower.includes('fútbol') ||
    lower.includes('futbol') ||
    lower.startsWith('f5') ||
    lower.startsWith('f7') ||
    lower.startsWith('f8') ||
    lower.startsWith('f11')
  ) {
    tabs.push('FÚTBOL')
  }
  if (lower.includes('pádel') || lower.includes('padel')) tabs.push('PÁDEL')
  if (lower.includes('tenis')) tabs.push('TENIS')
  if (c.status !== 'ACTIVA') tabs.push('INACTIVAS')
  return tabs
}

export function CourtsTabs({ courts }: Props) {
  const [active, setActive] = useState<TabKey>('TODAS')

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { TODAS: 0, FÚTBOL: 0, PÁDEL: 0, TENIS: 0, INACTIVAS: 0 }
    for (const court of courts) for (const t of categorize(court)) c[t]++
    return c
  }, [courts])

  const tabs: TabKey[] = ['TODAS', 'FÚTBOL', 'PÁDEL', 'TENIS', 'INACTIVAS']
  const filtered = courts.filter((c) => categorize(c).includes(active))

  return (
    <>
      <div className="flex gap-1.5 border-b-chip border-cy-line bg-cy-paper px-7 py-3">
        {tabs.map((t) => (
          <button key={t} type="button" onClick={() => setActive(t)}>
            <Chip variant={t === active ? 'fill' : 'outline'}>
              {t} ({counts[t]})
            </Chip>
          </button>
        ))}
      </div>

      <div className="grid gap-[18px] p-7" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {filtered.map((c) => (
          <CourtManageCard key={c.number} court={c} />
        ))}
      </div>
    </>
  )
}

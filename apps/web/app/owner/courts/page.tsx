'use client'

import { useState } from 'react'
import { Button, Chip } from '@canchaya/ui/web'
import { Icon } from '@canchaya/ui/icons'
import { OwnerHeader } from '@/components/owner/OwnerHeader'
import { CourtManageCard, type OwnerCourt } from '@/components/owner/CourtManageCard'

const COURTS: OwnerCourt[] = [
  { number: 1, name: 'C1 · Fútbol 5', surface: 'Sintético', covered: true, price: 18000, status: 'ACTIVA', occupancyPct: 92, imgVariant: 'field' },
  { number: 2, name: 'C2 · Fútbol 5', surface: 'Sintético', covered: true, price: 18000, status: 'ACTIVA', occupancyPct: 88, imgVariant: 'field' },
  { number: 3, name: 'C3 · Fútbol 5', surface: 'Sintético', covered: false, price: 16000, status: 'ACTIVA', occupancyPct: 74, imgVariant: 'field' },
  { number: 4, name: 'C4 · Fútbol 8', surface: 'Césped natural', covered: false, price: 26000, status: 'ACTIVA', occupancyPct: 68, imgVariant: 'field' },
  { number: 5, name: 'P1 · Pádel', surface: 'Cemento', covered: true, price: 9500, status: 'ACTIVA', occupancyPct: 84, imgVariant: 'dark' },
  { number: 6, name: 'P2 · Pádel', surface: 'Cemento', covered: true, price: 9500, status: 'MANTENIMIENTO', occupancyPct: 0, imgVariant: 'dark' },
]

const TABS = ['TODAS (6)', 'FÚTBOL (4)', 'PÁDEL (2)', 'TENIS (0)', 'INACTIVAS (1)'] as const

export default function CourtsPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>(TABS[0])

  return (
    <>
      <OwnerHeader
        eyebrow="INVENTARIO · 6 CANCHAS"
        title="CANCHAS."
        right={
          <Button
            variant="accent"
            leftIcon={<Icon name="plus" size={12} />}
            className="!px-3.5 !py-2.5 !text-[12px]"
          >
            Agregar cancha
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1.5 border-b-chip border-cy-line bg-cy-paper px-7 py-3">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setActiveTab(t)}>
            <Chip variant={t === activeTab ? 'fill' : 'outline'}>{t}</Chip>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-[18px] p-7" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {COURTS.map((c) => (
          <CourtManageCard key={c.number} court={c} />
        ))}
      </div>
    </>
  )
}

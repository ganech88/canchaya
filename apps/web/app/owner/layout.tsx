import type { ReactNode } from 'react'
import { OwnerSidebar } from '@/components/owner/OwnerSidebar'

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-cy-bg font-ui">
      <OwnerSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

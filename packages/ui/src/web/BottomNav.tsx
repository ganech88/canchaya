import { Icon, type IconName } from '../icons'
import { cn } from '../cn'

export type BottomNavKey = 'home' | 'map' | 'match' | 'chat' | 'me'

interface NavItem {
  id: BottomNavKey
  label: string
  icon: IconName
}

const ITEMS: NavItem[] = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'map', label: 'Mapa', icon: 'map' },
  { id: 'match', label: 'Partidos', icon: 'bolt' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'me', label: 'Yo', icon: 'user' },
]

interface BottomNavProps {
  active: BottomNavKey
  onChange?: (key: BottomNavKey) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="flex border-t-card border-cy-line bg-cy-paper">
      {ITEMS.map((item, i) => {
        const isActive = item.id === active
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange?.(item.id)}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-[3px] px-0 pb-2 pt-2.5',
              i < ITEMS.length - 1 && 'border-r-chip border-cy-line',
              isActive ? 'bg-cy-ink text-cy-accent' : 'bg-transparent text-cy-ink',
            )}
          >
            <Icon name={item.icon} size={18} />
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

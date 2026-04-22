import { router, type Href } from 'expo-router'
import type { BottomNavKey } from '@canchaya/ui/native'

const BOTTOM_NAV_ROUTES: Record<BottomNavKey, Href> = {
  home: '/',
  map: '/map',
  match: '/match/new',
  chat: '/chat/1',
  me: '/profile',
}

export function navigateBottomNav(key: BottomNavKey) {
  router.navigate(BOTTOM_NAV_ROUTES[key])
}

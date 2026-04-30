import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Session, SessionStorageBackend } from '@nhost/nhost-js/session'

const DEFAULT_KEY = 'nhostSession'

/**
 * Adapter sync sobre AsyncStorage (async). Nhost v4 espera SessionStorageBackend
 * con `get()` sync; mantenemos un cache en memoria que se popula con `preload()`
 * antes de usar el cliente, y escribimos write-through async en cada set.
 *
 * Hay que llamar `preload()` una vez al boot (en app/_layout.tsx) antes del primer
 * `getNhost()`, sino el cache arranca vacío y el user empieza sin sesión.
 */
export class AsyncStorageBackend implements SessionStorageBackend {
  private cache: Session | null = null
  private loaded = false
  private readonly storageKey: string

  constructor(storageKey: string = DEFAULT_KEY) {
    this.storageKey = storageKey
  }

  async preload(): Promise<void> {
    if (this.loaded) return
    try {
      const raw = await AsyncStorage.getItem(this.storageKey)
      if (raw) this.cache = JSON.parse(raw) as Session
    } catch {
      this.cache = null
    } finally {
      this.loaded = true
    }
  }

  get(): Session | null {
    return this.cache
  }

  set(value: Session): void {
    this.cache = value
    AsyncStorage.setItem(this.storageKey, JSON.stringify(value)).catch(() => {})
  }

  remove(): void {
    this.cache = null
    AsyncStorage.removeItem(this.storageKey).catch(() => {})
  }
}

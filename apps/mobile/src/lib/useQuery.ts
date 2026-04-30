import { useEffect, useRef, useState } from 'react'
import { getNhost, isNhostConfigured } from './nhost'
import type { CanchaYaClient } from '@canchaya/db'

export interface QueryState<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
}

export function useNhostQuery<T>(
  fetcher: (nhost: CanchaYaClient) => Promise<T>,
  deps: unknown[] = [],
): QueryState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const run = async () => {
    if (!isNhostConfigured()) {
      setError(new Error('Nhost no configurado'))
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current(getNhost())
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, error, loading, refetch: run }
}

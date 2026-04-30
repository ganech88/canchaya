'use client'

import { useEffect, useRef, useState } from 'react'
import { getBrowserClient, isNhostConfigured } from './client'

export interface QueryState<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
}

/**
 * Wrapper minimalista alrededor de fetcher functions de @canchaya/db. Diseñado
 * para casos client-side; para server components usá las fetcher functions
 * directamente con `getServerClient()` y await.
 */
export function useNhostQuery<T>(
  fetcher: (nhost: ReturnType<typeof getBrowserClient>) => Promise<T>,
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
      const result = await fetcherRef.current(getBrowserClient())
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

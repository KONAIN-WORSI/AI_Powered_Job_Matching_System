import { useEffect, useState } from 'react'
import { listMatches } from '../api/matches'
import type { Match } from '../types/match'

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    listMatches().then(setMatches).catch((value: unknown) => {
      setError(value instanceof Error ? value : new Error(String(value)))
    })
  }, [])

  return { matches, error }
}

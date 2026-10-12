import { useEffect, useState } from 'react'
import { listResumes } from '../api/resumes'
import type { Resume } from '../types/resume'

export function useResume() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    listResumes().then(setResumes).catch((value: unknown) => {
      setError(value instanceof Error ? value : new Error(String(value)))
    })
  }, [])

  return { resumes, error }
}

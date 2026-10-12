import type { Job } from './job'

export interface Match {
  id: number
  score: number
  job: Job
}

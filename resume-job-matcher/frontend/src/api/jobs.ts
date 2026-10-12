import { apiClient } from './axios'
import type { Job } from '../types/job'

export async function listJobs(): Promise<Job[]> {
  const response = await apiClient.get<Job[]>('/jobs/')
  return response.data
}

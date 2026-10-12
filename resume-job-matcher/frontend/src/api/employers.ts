import { apiClient } from './axios'
import type { Job } from '../types/job'

export async function listEmployerJobs(): Promise<Job[]> {
  const response = await apiClient.get<Job[]>('/employers/jobs/')
  return response.data
}

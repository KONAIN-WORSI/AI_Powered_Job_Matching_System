import { apiClient } from './axios'
import type { Resume } from '../types/resume'

export async function listResumes(): Promise<Resume[]> {
  const response = await apiClient.get<Resume[]>('/resumes/')
  return response.data
}

export async function uploadResume(file: File): Promise<Resume> {
  const body = new FormData()
  body.append('file', file)
  const response = await apiClient.post<Resume>('/resumes/', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

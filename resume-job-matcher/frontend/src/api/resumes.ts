import { apiClient } from './axios'
import type { Resume } from '../types/resume'

export interface ResumeUploadResponse {
  message: string
  payload: {
    id: number
    file: string
    extracted_skills: string[]
    is_primary: boolean
    created_at: string
  }
}

export async function listResumes(): Promise<Resume[]> {
  const response = await apiClient.get<Resume[]>('/resumes/')
  return response.data
}

export async function uploadResume(file: File, isPrimary = false): Promise<ResumeUploadResponse> {
  const body = new FormData()
  body.append('file', file)
  body.append('is_primary', String(isPrimary))
  const response = await apiClient.post<ResumeUploadResponse>('/resumes/upload/', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

import { apiClient } from './axios'
import type { Match } from '../types/match'

export async function listMatches(): Promise<Match[]> {
  const response = await apiClient.get<Match[]>('/matches/')
  return response.data
}

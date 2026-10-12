import { apiClient } from './axios'
import type { User } from '../types/user'

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/accounts/me/')
  return response.data
}

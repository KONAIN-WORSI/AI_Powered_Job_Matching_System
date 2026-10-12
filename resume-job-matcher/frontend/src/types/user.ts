export type UserRole = 'job_seeker' | 'employer'

export interface User {
  id: number
  email: string
  role: UserRole
}

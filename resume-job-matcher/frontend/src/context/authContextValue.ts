import { createContext } from 'react'

export interface AuthContextType {
  isAuthenticated: boolean
  login: (access: string, refresh: string, role: string, email: string) => void
  logout: () => Promise<void>
  role: string | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

import { createContext, useState, type PropsWithChildren } from 'react'
import type { User } from '../types/user'

interface AuthContextValue {
  user: User | null
  setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

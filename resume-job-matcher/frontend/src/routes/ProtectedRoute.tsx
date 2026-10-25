import { Navigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/user'

export function ProtectedRoute({ children, allowedRole }: PropsWithChildren<{ allowedRole?: UserRole }>) {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate replace to="/login" />
  if (allowedRole && role !== allowedRole) {
    return <Navigate replace to={role === 'employer' ? '/employer' : '/dashboard'} />
  }
  return children
}

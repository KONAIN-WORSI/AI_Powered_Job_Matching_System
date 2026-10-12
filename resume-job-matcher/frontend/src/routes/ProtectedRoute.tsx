import { Navigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

interface ProtectedRouteProps extends PropsWithChildren {
  isAuthenticated: boolean
}

export function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
  return isAuthenticated ? children : <Navigate replace to="/login" />
}

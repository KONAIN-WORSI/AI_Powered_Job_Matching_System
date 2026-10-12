import { Navigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import type { UserRole } from '../types/user'

interface RoleRouteProps extends PropsWithChildren {
  role: UserRole | null
  allowedRole: UserRole
}

export function RoleRoute({ role, allowedRole, children }: RoleRouteProps) {
  if (!role) return <Navigate replace to="/login" />
  return role === allowedRole ? children : <Navigate replace to="/" />
}

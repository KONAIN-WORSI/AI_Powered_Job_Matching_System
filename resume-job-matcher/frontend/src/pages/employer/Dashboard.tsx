import { Card } from '../../components/common/Card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function EmployerDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login', { state: { logoutError: true } })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Card>
      <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? 'Signing out…' : 'Sign out'}
      </button>
      <p className="eyebrow">Employer</p>
      <h1>Find the right candidates.</h1>
      <p className="muted">Employer dashboards will connect to the jobs and matching API.</p>
    </Card>
  )
}

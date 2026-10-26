import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import { Sidebar } from '../../components/layout/Sidebar'
import { useAuth } from '../../hooks/useAuth'

export default function Dashboard() {
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
      <p className="eyebrow">Job seeker</p>
      <h1>Find work that fits your skills.</h1>
      <p className="muted">Upload a resume to start building your personalized job matches.</p>
      <Sidebar />
    </Card>
  )
}

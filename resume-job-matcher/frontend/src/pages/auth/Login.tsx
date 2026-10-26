import { useContext, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import axiosClient from '../../api/axios'
import { AuthField, AuthIntro, AuthPageShell } from './AuthPageShell'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const registered = (location.state as { registered?: boolean } | null)?.registered
  const logoutError = (location.state as { logoutError?: boolean } | null)?.logoutError

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const response = await axiosClient.post('/auth/login/', { email: email.trim().toLowerCase(), password })
      const { access, refresh, role } = response.data
      auth?.login(access, refresh, role)
      navigate(role === 'employer' ? '/employer' : '/dashboard')
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        if (!requestError.response) {
          setError('We could not read the server response. Check that the backend is running and allows this frontend origin.')
          return
        }
        const data = requestError.response?.data as Record<string, unknown> | undefined
        const message = data && Object.values(data).flat().find((value) => typeof value === 'string')
        setError(typeof message === 'string' ? message : 'The email or password you entered is incorrect.')
      } else {
        setError('We couldn’t sign you in. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell>
      <section className="auth-card auth-card-login">
        <AuthIntro title="Welcome back" subtitle="Sign in to find your next opportunity." />
        {registered && <p className="auth-success" role="status">Your account is ready. Sign in to continue.</p>}
        {logoutError && <p className="auth-error" role="alert">You were signed out on this device, but the server could not confirm that your refresh token was revoked.</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthField label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label className="auth-field">
            <span>Password</span>
            <span className="password-wrap">
              <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button className="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? '◉' : '◎'}</button>
            </span>
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</button>
        </form>
        <div className="auth-card-bottom">New to Matchwise? <Link to="/register">Create an account</Link></div>
      </section>
    </AuthPageShell>
  )
}

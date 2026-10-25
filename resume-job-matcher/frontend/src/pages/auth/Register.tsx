import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import axiosClient from '../../api/axios'
import { AuthField, AuthIntro, AuthPageShell } from './AuthPageShell'

type AccountRole = 'job_seeker' | 'employer'
type RegisterFormValues = { fullName: string; email: string; password: string; companyName: string; jobTitle: string }

export default function Register() {
  const [role, setRole] = useState<AccountRole>('job_seeker')
  const [forms, setForms] = useState<Record<AccountRole, RegisterFormValues>>({
    job_seeker: { fullName: '', email: '', password: '', companyName: '', jobTitle: '' },
    employer: { fullName: '', email: '', password: '', companyName: '', jobTitle: '' },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const form = forms[role]

  function updateField(field: string, value: string) {
    setForms((current) => ({
      ...current,
      [role]: { ...current[role], [field]: value },
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axiosClient.post('/auth/register/', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role,
        full_name: form.fullName.trim(),
        company_name: role === 'employer' ? form.companyName.trim() : undefined,
        job_title: role === 'employer' ? form.jobTitle.trim() : undefined,
      })
      navigate('/login', { state: { registered: true } })
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        if (!requestError.response) {
          setError('We could not read the server response. Check that the backend is running and allows this frontend origin.')
          return
        }
        const data = requestError.response?.data as Record<string, unknown> | undefined
        const message = data && Object.values(data).flat().find((value) => typeof value === 'string')
        setError(typeof message === 'string' ? message : 'We couldn’t create your account. Please check your details and try again.')
      } else {
        setError('We couldn’t create your account. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell>
      <section className={`auth-card auth-card-register role-${role}`}>
        <AuthIntro title="Create your account" subtitle="Your next great match starts here." />

        <form className="auth-form" onSubmit={handleSubmit}>
          <fieldset className="role-picker">
            <legend>I'm joining as</legend>
            <div className="role-track" role="group" aria-label="Choose account type">
              <span className={`role-slider ${role === 'employer' ? 'role-slider-employer' : ''}`} aria-hidden="true" />
              <button type="button" className={role === 'job_seeker' ? 'role-option selected' : 'role-option'} aria-pressed={role === 'job_seeker'} onClick={() => setRole('job_seeker')}>
                <span aria-hidden="true">♙</span> Job Seeker
              </button>
              <button type="button" className={role === 'employer' ? 'role-option selected' : 'role-option'} aria-pressed={role === 'employer'} onClick={() => setRole('employer')}>
                <span aria-hidden="true">▣</span> Employer
              </button>
            </div>
          </fieldset>

          <div className="role-fields" key={role}>
            <AuthField label="Full Name" autoComplete="name" placeholder="Enter your full name" value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} required />
            {role === 'employer' && (
              <>
                <AuthField label="Company Name" autoComplete="organization" placeholder="Enter your company name" value={form.companyName} onChange={(event) => updateField('companyName', event.target.value)} required />
                <AuthField label="Job Title" autoComplete="organization-title" placeholder="e.g. Talent Acquisition Manager" value={form.jobTitle} onChange={(event) => updateField('jobTitle', event.target.value)} required />
              </>
            )}
            <AuthField label={role === 'employer' ? 'Work Email' : 'Email'} type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => updateField('email', event.target.value)} required />
            <label className="auth-field">
              <span>Password</span>
              <span className="password-wrap">
                <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a password" minLength={8} value={form.password} onChange={(event) => updateField('password', event.target.value)} required />
                <button className="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? '◉' : '◎'}</button>
              </span>
            </label>
            <p className="auth-hint">Use at least 8 characters, including a number.</p>
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create Account'}</button>
          <p className="auth-terms">By creating an account, you agree to our <a href="#terms">Terms of Service</a><br className="desktop-break" /> and <a href="#privacy">Privacy Policy</a>.</p>
        </form>

        <div className="auth-card-bottom">Already have an account? <Link to="/login">Sign in</Link></div>
      </section>
    </AuthPageShell>
  )
}

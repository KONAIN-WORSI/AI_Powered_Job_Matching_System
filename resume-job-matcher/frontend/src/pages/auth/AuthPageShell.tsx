import type { InputHTMLAttributes, PropsWithChildren } from 'react'
import './auth.css'

export function AuthPageShell({ children }: PropsWithChildren) {
  return (
    <div className="auth-page">
      <header className="auth-topbar">
        <a className="auth-brand" href="/login" aria-label="Matchwise home">
          <span className="auth-brand-mark" aria-hidden="true">✦</span>
          <span>matchwise</span>
        </a>
        <a className="auth-help" href="mailto:support@matchwise.com"><span aria-hidden="true">ⓘ</span> Need help?</a>
      </header>

      <main className="auth-main">
        <div className="auth-content">{children}</div>
        <p className="auth-security"><span aria-hidden="true">♧</span> Your information is safe and secure.</p>
      </main>

      <footer className="auth-footer">
        <span>© 2026 Matchwise. All rights reserved.</span>
        <span>Better matches. Brighter futures.</span>
      </footer>
    </div>
  )
}

export function AuthIntro({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="auth-intro">
      <div className="auth-sparkle" aria-hidden="true">✧</div>
      <p className="auth-eyebrow">AI-Powered Job Matching System</p>
      <h1>{title}</h1>
      <p className="auth-subtitle">{subtitle}</p>
    </div>
  )
}

export function AuthField({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <input {...props} />
    </label>
  )
}

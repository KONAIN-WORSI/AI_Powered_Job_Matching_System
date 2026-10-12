import { NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/">ResumeMatch</NavLink>
      <nav aria-label="Main navigation" className="site-nav">
        <NavLink to="/jobs">Find jobs</NavLink>
        <NavLink to="/resume">Resume</NavLink>
        <NavLink to="/employer">For employers</NavLink>
        <NavLink to="/login">Sign in</NavLink>
      </nav>
    </header>
  )
}

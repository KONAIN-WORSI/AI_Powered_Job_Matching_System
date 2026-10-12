import { NavLink } from 'react-router-dom'

export function Sidebar() {
  return (
    <nav aria-label="Dashboard navigation">
      <NavLink to="/jobs">Job matches</NavLink>
      {' · '}
      <NavLink to="/resume">My resume</NavLink>
    </nav>
  )
}

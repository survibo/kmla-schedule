import { NavLink } from 'react-router-dom'
import { APP_PATHS } from '../../routes/appRoutes.js'

export function TabBar({ editTabPath }) {
  return (
    <nav className="tab-bar" aria-label="Primary">
      <NavLink to={APP_PATHS.week} end>
        <span>Schedule</span>
      </NavLink>
      <NavLink to={editTabPath}>
        <span>Edit</span>
      </NavLink>
      <NavLink to={APP_PATHS.changes}>
        <span>Changes</span>
      </NavLink>
    </nav>
  )
}

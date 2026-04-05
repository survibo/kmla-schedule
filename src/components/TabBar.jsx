import { NavLink } from 'react-router-dom'

export function TabBar({ weekPath, modulesPath, changesPath }) {
  return (
    <div className="shrink-0 border-t border-[rgba(20,34,33,0.1)] bg-[rgba(255,248,236,0.96)] backdrop-blur-[18px]">
      <nav
        className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-2 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-6"
        aria-label="Primary"
      >
        <NavLink
          to={weekPath}
          end
          className={({ isActive }) =>
            [
              'block min-h-12 rounded-[0.95rem] border border-transparent px-4 py-[0.7rem] text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out',
              isActive
                ? 'border-[rgba(31,111,120,0.22)] bg-[rgba(31,111,120,0.14)] text-[var(--ink)]'
                : 'text-[var(--muted)]',
            ].join(' ')
          }
        >
          <span>Schedule</span>
        </NavLink>
        <NavLink
          to={modulesPath}
          className={({ isActive }) =>
            [
              'block min-h-12 rounded-[0.95rem] border border-transparent px-4 py-[0.7rem] text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out',
              isActive
                ? 'border-[rgba(31,111,120,0.22)] bg-[rgba(31,111,120,0.14)] text-[var(--ink)]'
                : 'text-[var(--muted)]',
            ].join(' ')
          }
        >
          <span>Modules</span>
        </NavLink>
        <NavLink
          to={changesPath}
          className={({ isActive }) =>
            [
              'block min-h-12 rounded-[0.95rem] border border-transparent px-4 py-[0.7rem] text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out',
              isActive
                ? 'border-[rgba(31,111,120,0.22)] bg-[rgba(31,111,120,0.14)] text-[var(--ink)]'
                : 'text-[var(--muted)]',
            ].join(' ')
          }
        >
          <span>Changes</span>
        </NavLink>
      </nav>
    </div>
  )
}

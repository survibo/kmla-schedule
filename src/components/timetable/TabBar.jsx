import { NavLink } from 'react-router-dom'
import { APP_PATHS } from '../../routes/appRoutes.js'

export function TabBar({ editTabPath }) {
  return (
    <nav
      className="fixed inset-x-4 bottom-4 z-10 grid grid-cols-3 gap-[0.6rem] rounded-[1.3rem] border border-[rgba(20,34,33,0.1)] bg-[rgba(255,248,236,0.94)] p-[0.55rem] shadow-[0_1rem_2rem_rgba(20,34,33,0.12)] backdrop-blur-[16px] min-[860px]:static min-[860px]:mx-auto min-[860px]:w-fit min-[860px]:grid-cols-[repeat(3,minmax(8rem,1fr))]"
      aria-label="Primary"
    >
      <NavLink
        to={APP_PATHS.week}
        end
        className={({ isActive }) =>
          [
            'block min-h-12 rounded-full border border-transparent px-4 py-[0.7rem] text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px',
            isActive
              ? 'border-[rgba(31,111,120,0.3)] bg-[rgba(31,111,120,0.16)] text-[var(--ink)]'
              : 'text-[var(--muted)]',
          ].join(' ')
        }
      >
        <span>Schedule</span>
      </NavLink>
      <NavLink
        to={editTabPath}
        className={({ isActive }) =>
          [
            'block min-h-12 rounded-full border border-transparent px-4 py-[0.7rem] text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px',
            isActive
              ? 'border-[rgba(31,111,120,0.3)] bg-[rgba(31,111,120,0.16)] text-[var(--ink)]'
              : 'text-[var(--muted)]',
          ].join(' ')
        }
      >
        <span>Edit</span>
      </NavLink>
      <NavLink
        to={APP_PATHS.changes}
        className={({ isActive }) =>
          [
            'block min-h-12 rounded-full border border-transparent px-4 py-[0.7rem] text-center no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px',
            isActive
              ? 'border-[rgba(31,111,120,0.3)] bg-[rgba(31,111,120,0.16)] text-[var(--ink)]'
              : 'text-[var(--muted)]',
          ].join(' ')
        }
      >
        <span>Changes</span>
      </NavLink>
    </nav>
  )
}

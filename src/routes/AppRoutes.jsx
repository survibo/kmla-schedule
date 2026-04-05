import { useEffect } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { TabBar } from '../components/TabBar.jsx'
import { useTimetableApp } from '../features/useTimetableApp.js'
import { getDateKey, getSuggestedOverrideDate } from '../features/timetableShared.js'
import { ChangesPage } from '../pages/ChangesPage.jsx'
import { ModulesPage } from '../pages/ModulesPage.jsx'
import { OverridePage } from '../pages/EditPage.jsx'
import { SchedulePage } from '../pages/SchedulePage.jsx'
import { SlotEditorPage } from '../pages/SlotEditorPage.jsx'

const APP_PATHS = {
  week: '/',
  modules: '/modules',
  override: '/override',
  slot: '/slot',
  changes: '/changes',
}

function buildOverrideEditPath(dateKey) {
  return `${APP_PATHS.override}?date=${dateKey}`
}

function buildBaseSlotPath(dayKey, periodIndex) {
  return `${APP_PATHS.slot}?scope=base&day=${dayKey}&period=${periodIndex + 1}`
}

function buildOverrideSlotPath(dateKey, periodIndex) {
  return `${APP_PATHS.slot}?scope=override&date=${dateKey}&period=${periodIndex + 1}`
}

function useAppRouting({
  dayKeys,
  fallbackDayKey,
  todayDayKey,
  suggestedOverrideDateKey,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const editorScope = searchParams.get('scope') === 'override' ? 'override' : 'base'
  const baseRouteDayKey = dayKeys.includes(searchParams.get('day'))
    ? searchParams.get('day')
    : todayDayKey ?? fallbackDayKey
  const overrideRouteDate = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.get('date') ?? '')
    ? searchParams.get('date')
    : suggestedOverrideDateKey
  const rawPeriod = Number(searchParams.get('period'))
  const slotPeriodIndex =
    Number.isInteger(rawPeriod) && rawPeriod >= 1 && rawPeriod <= 8
      ? rawPeriod - 1
      : null

  useEffect(() => {
    if (![APP_PATHS.override, APP_PATHS.slot].includes(location.pathname)) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    let changed = false

    if (location.pathname === APP_PATHS.override) {
      if (nextParams.get('scope') === 'base') {
        nextParams.delete('scope')
        changed = true
      }

      if (searchParams.get('date') !== overrideRouteDate) {
        nextParams.set('date', overrideRouteDate)
        changed = true
      }

      if (nextParams.has('day')) {
        nextParams.delete('day')
        changed = true
      }

      if (nextParams.has('period')) {
        nextParams.delete('period')
        changed = true
      }
    } else if (editorScope === 'base') {
      if (searchParams.get('scope') !== 'base') {
        nextParams.set('scope', 'base')
        changed = true
      }

      if (searchParams.get('day') !== baseRouteDayKey) {
        nextParams.set('day', baseRouteDayKey)
        changed = true
      }

      if (nextParams.has('date')) {
        nextParams.delete('date')
        changed = true
      }
    } else {
      if (searchParams.get('scope') !== 'override') {
        nextParams.set('scope', 'override')
        changed = true
      }

      if (searchParams.get('date') !== overrideRouteDate) {
        nextParams.set('date', overrideRouteDate)
        changed = true
      }

      if (nextParams.has('day')) {
        nextParams.delete('day')
        changed = true
      }
    }

    if (changed) {
      setSearchParams(nextParams, { replace: true })
    }
  }, [
    baseRouteDayKey,
    editorScope,
    location.pathname,
    overrideRouteDate,
    searchParams,
    setSearchParams,
  ])

  return {
    location,
    editorScope,
    baseRouteDayKey,
    overrideRouteDate,
    slotPeriodIndex,
    goToWeek() {
      navigate(APP_PATHS.week)
    },
    goToOverrideEdit(dateKey = overrideRouteDate) {
      navigate(buildOverrideEditPath(dateKey))
    },
    goToBaseSlot(dayKey = baseRouteDayKey, periodIndex) {
      navigate(buildBaseSlotPath(dayKey, periodIndex))
    },
    goToOverrideSlot(dateKey = overrideRouteDate, periodIndex) {
      navigate(buildOverrideSlotPath(dateKey, periodIndex))
    },
  }
}

export function AppRoutes() {
  const app = useTimetableApp()
  const { now, resetEditorDrafts, saveStatus, todayDayKey } = app
  const routing = useAppRouting({
    dayKeys: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    fallbackDayKey: 'Mon',
    todayDayKey,
    suggestedOverrideDateKey: getDateKey(getSuggestedOverrideDate(now)),
  })

  useEffect(() => {
    resetEditorDrafts()
  }, [resetEditorDrafts, routing.location.pathname, routing.location.search])

  const routeProps = {
    ...app,
    ...routing,
  }

  function jumpToOverridesEdit(dateKey) {
    routing.goToOverrideEdit(dateKey)
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-6xl flex-col overflow-hidden px-4 pt-4 sm:px-6 min-[860px]:pt-6">
      {saveStatus !== 'idle' && saveStatus !== 'loading' ? (
        <div className="pointer-events-none fixed inset-x-4 top-3 z-30 flex justify-center sm:inset-x-6 sm:top-4">
          <div
            className={[
              'rounded-full px-4 py-2 text-sm font-semibold shadow-[0_0.6rem_1.4rem_rgba(24,49,47,0.12)]',
              saveStatus === 'saving'
                ? 'bg-[rgba(36,93,98,0.92)] text-[rgb(255,248,236)]'
                : '',
              saveStatus === 'saved'
                ? 'bg-[rgba(48,110,73,0.92)] text-[rgb(255,248,236)]'
                : '',
              saveStatus === 'error'
                ? 'bg-[rgba(150,47,47,0.94)] text-[rgb(255,248,236)]'
                : '',
            ].join(' ')}
          >
            {saveStatus === 'saving' ? 'Saving...' : ''}
            {saveStatus === 'saved' ? 'Saved' : ''}
            {saveStatus === 'error' ? 'Save failed on this device' : ''}
          </div>
        </div>
      ) : null}
      <main className="app-scroll min-h-0 flex-1 overflow-y-auto pb-4">
        <Routes>
          <Route
            path={APP_PATHS.week}
            element={<SchedulePage {...routeProps} />}
          />
          <Route
            path={APP_PATHS.modules}
            element={<ModulesPage {...routeProps} />}
          />
          <Route
            path={APP_PATHS.override}
            element={<OverridePage {...routeProps} />}
          />
          <Route
            path={APP_PATHS.slot}
            element={<SlotEditorPage {...routeProps} />}
          />
          <Route
            path={APP_PATHS.changes}
            element={
              <ChangesPage
                {...routeProps}
                jumpToOverridesEdit={jumpToOverridesEdit}
              />
            }
          />
          <Route path="*" element={<Navigate to={APP_PATHS.week} replace />} />
        </Routes>
      </main>
      <TabBar
        weekPath={APP_PATHS.week}
        modulesPath={APP_PATHS.modules}
        changesPath={APP_PATHS.changes}
      />
    </div>
  )
}

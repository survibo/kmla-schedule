import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { TabBar } from '../components/timetable/TabBar.jsx'
import { useTimetableApp } from '../features/timetable/useTimetableApp.js'
import { getDateKey, getSuggestedOverrideDate } from '../features/timetable/timetableShared.js'
import { ChangesPage } from '../pages/ChangesPage.jsx'
import { EditPage } from '../pages/EditPage.jsx'
import { SchedulePage } from '../pages/SchedulePage.jsx'
import { SlotEditorPage } from '../pages/SlotEditorPage.jsx'
import { APP_PATHS, useAppRouting } from './appRoutes.js'

export function AppRoutes() {
  const app = useTimetableApp()
  const { now, resetEditorDrafts, todayDayKey } = app
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
    <>
      <Routes>
        <Route
          path={APP_PATHS.week}
          element={<SchedulePage {...routeProps} />}
        />
        <Route
          path={APP_PATHS.edit}
          element={<EditPage {...routeProps} />}
        />
        <Route
          path={APP_PATHS.editSlot}
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

      <TabBar editTabPath={routing.editTabPath} />
    </>
  )
}

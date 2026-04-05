import { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export const APP_PATHS = {
  week: '/',
  edit: '/edit',
  editSlot: '/edit/slot',
  changes: '/changes',
}

export function isKnownAppPath(pathname) {
  return Object.values(APP_PATHS).includes(pathname)
}

export function getActiveTab(pathname) {
  if (pathname === APP_PATHS.edit || pathname === APP_PATHS.editSlot) {
    return 'edit'
  }

  if (pathname === APP_PATHS.changes) {
    return 'overrides'
  }

  return 'week'
}

export function buildBaseEditPath(dayKey) {
  return `${APP_PATHS.edit}?scope=base&day=${dayKey}`
}

export function buildOverrideEditPath(dateKey) {
  return `${APP_PATHS.edit}?scope=override&date=${dateKey}`
}

export function buildBaseSlotPath(dayKey, periodIndex) {
  return `${APP_PATHS.editSlot}?scope=base&day=${dayKey}&period=${periodIndex + 1}`
}

export function buildOverrideSlotPath(dateKey, periodIndex) {
  return `${APP_PATHS.editSlot}?scope=override&date=${dateKey}&period=${periodIndex + 1}`
}

export function useAppRouting({
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
    if (![APP_PATHS.edit, APP_PATHS.editSlot].includes(location.pathname)) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    let changed = false

    if (editorScope === 'base') {
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
    activeTab: getActiveTab(location.pathname),
    editorScope,
    baseRouteDayKey,
    overrideRouteDate,
    slotPeriodIndex,
    editTabPath:
      editorScope === 'override'
        ? buildOverrideEditPath(overrideRouteDate)
        : buildBaseEditPath(baseRouteDayKey),
    goToBaseEdit(dayKey = baseRouteDayKey) {
      navigate(buildBaseEditPath(dayKey))
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

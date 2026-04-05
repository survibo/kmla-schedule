import { useCallback, useEffect, useState } from 'react'
import {
  DAYS,
  DEFAULT_MODULE_COLORS,
  STORAGE_KEYS,
  cleanLabel,
  createDefaultModuleDetails,
  createEmptyTimetable,
  getCurrentPeriodIndex,
  getDateKey,
  getDayIndex,
  getDayKey,
  getOverrideValue,
  getStatusCard,
  getWeekDates,
  isModuleLabel,
  loadStoredValue,
  normalizeBaseTimetable,
  normalizeModuleColors,
  normalizeModuleDetails,
  normalizeOverrides,
  saveStoredValue,
} from './timetableShared.js'

export function useTimetableApp() {
  const [baseTimetable, setBaseTimetable] = useState(() =>
    loadStoredValue(STORAGE_KEYS.base, normalizeBaseTimetable, createEmptyTimetable()),
  )
  const [overrides, setOverrides] = useState(() =>
    loadStoredValue(STORAGE_KEYS.overrides, normalizeOverrides, {}),
  )
  const [moduleColors, setModuleColors] = useState(() =>
    loadStoredValue(STORAGE_KEYS.colors, normalizeModuleColors, { ...DEFAULT_MODULE_COLORS }),
  )
  const [moduleDetails, setModuleDetails] = useState(() =>
    loadStoredValue(STORAGE_KEYS.details, normalizeModuleDetails, createDefaultModuleDetails()),
  )
  const initialSchoolDayIndex = getDayIndex(getDayKey(new Date()))
  const [editorPanel, setEditorPanel] = useState('subjects')
  const [selectedCell, setSelectedCell] = useState(null)
  const [draftModule, setDraftModule] = useState('')
  const [draftCustomLabel, setDraftCustomLabel] = useState('')
  const [weekAnchor, setWeekAnchor] = useState(() => new Date())
  const [weekFocusIndex, setWeekFocusIndex] = useState(() => (initialSchoolDayIndex >= 0 ? initialSchoolDayIndex : 0))
  const [now, setNow] = useState(() => new Date())
  const [lastSavedAt, setLastSavedAt] = useState(null)

  useEffect(() => {
    saveStoredValue(STORAGE_KEYS.base, baseTimetable)
    saveStoredValue(STORAGE_KEYS.overrides, overrides)
    saveStoredValue(STORAGE_KEYS.colors, moduleColors)
    saveStoredValue(STORAGE_KEYS.details, moduleDetails)
    setLastSavedAt(new Date())
  }, [baseTimetable, overrides, moduleColors, moduleDetails])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const resetEditorDrafts = useCallback(() => {
    setSelectedCell(null)
    setDraftModule('')
    setDraftCustomLabel('')
  }, [])

  const todayKey = getDateKey(now)
  const todayDayKey = getDayKey(now)
  const todayDayIndex = getDayIndex(todayDayKey)
  const weekDates = getWeekDates(weekAnchor)
  const focusedWeekDate = weekDates[weekFocusIndex] ?? weekDates[0]
  const focusedWeekDayKey = DAYS[weekFocusIndex]?.key ?? DAYS[0].key
  const activePeriodIndex = todayDayKey ? getCurrentPeriodIndex(now) : null
  const statusCard = getStatusCard(now, baseTimetable, overrides, moduleDetails)
  const sortedOverrideDates = Object.keys(overrides).sort()

  const openBaseCell = useCallback((dayKey, periodIndex) => {
    const currentLabel = baseTimetable[dayKey][periodIndex] ?? ''
    setSelectedCell({ scope: 'base', dayKey, periodIndex })
    setDraftModule(isModuleLabel(currentLabel) ? currentLabel : '')
    setDraftCustomLabel('')
  }, [baseTimetable])

  const openOverrideCell = useCallback((dateKey, dayKey, periodIndex) => {
    if (!dayKey) {
      return
    }

    const currentLabel = getOverrideValue(overrides, dateKey, periodIndex) ?? ''
    setSelectedCell({ scope: 'override', dateKey, dayKey, periodIndex })
    setDraftModule(isModuleLabel(currentLabel) ? currentLabel : '')
    setDraftCustomLabel(isModuleLabel(currentLabel) ? '' : currentLabel)
  }, [overrides])

  const closeEditor = useCallback(() => {
    setSelectedCell(null)
    setDraftModule('')
    setDraftCustomLabel('')
  }, [])

  const updateBaseCell = useCallback((dayKey, periodIndex, nextValue) => {
    setBaseTimetable((current) => ({
      ...current,
      [dayKey]: current[dayKey].map((value, index) => (index === periodIndex ? nextValue : value)),
    }))
  }, [])

  const updateOverride = useCallback((dateKey, periodIndex, nextValue) => {
    setOverrides((current) => {
      const dayOverrides = { ...(current[dateKey] ?? {}) }
      const periodKey = String(periodIndex + 1)

      if (!nextValue) {
        delete dayOverrides[periodKey]
      } else {
        dayOverrides[periodKey] = nextValue
      }

      if (Object.keys(dayOverrides).length === 0) {
        const { [dateKey]: _removed, ...rest } = current
        return rest
      }

      return {
        ...current,
        [dateKey]: dayOverrides,
      }
    })
  }, [])

  const removeOverride = useCallback((dateKey, periodIndex) => {
    updateOverride(dateKey, periodIndex, null)
    if (
      selectedCell?.scope === 'override' &&
      selectedCell.dateKey === dateKey &&
      selectedCell.periodIndex === periodIndex
    ) {
      closeEditor()
    }
  }, [closeEditor, selectedCell, updateOverride])

  const removeOverrideDay = useCallback((dateKey) => {
    setOverrides((current) => {
      const { [dateKey]: _removed, ...rest } = current
      return rest
    })

    if (selectedCell?.scope === 'override' && selectedCell.dateKey === dateKey) {
      closeEditor()
    }
  }, [closeEditor, selectedCell])

  const handleSaveSelection = useCallback(() => {
    if (!selectedCell) {
      return
    }

    const baseValue = baseTimetable[selectedCell.dayKey][selectedCell.periodIndex]
    const customValue = selectedCell.scope === 'override' ? cleanLabel(draftCustomLabel) : null
    const moduleValue = cleanLabel(draftModule)
    const nextValue = customValue ?? moduleValue

    if (selectedCell.scope === 'base') {
      updateBaseCell(selectedCell.dayKey, selectedCell.periodIndex, moduleValue)
      closeEditor()
      return
    }

    if (!nextValue || nextValue === baseValue) {
      updateOverride(selectedCell.dateKey, selectedCell.periodIndex, null)
    } else {
      updateOverride(selectedCell.dateKey, selectedCell.periodIndex, nextValue)
    }

    closeEditor()
  }, [baseTimetable, closeEditor, draftCustomLabel, draftModule, selectedCell, updateBaseCell, updateOverride])

  const handleClearSelection = useCallback(() => {
    if (!selectedCell) {
      return
    }

    if (selectedCell.scope === 'base') {
      updateBaseCell(selectedCell.dayKey, selectedCell.periodIndex, null)
    } else {
      updateOverride(selectedCell.dateKey, selectedCell.periodIndex, null)
    }

    closeEditor()
  }, [closeEditor, selectedCell, updateBaseCell, updateOverride])

  function resetWeekToToday() {
    setWeekAnchor(new Date())

    if (todayDayIndex >= 0) {
      setWeekFocusIndex(todayDayIndex)
    }
  }

  return {
    activePeriodIndex,
    baseTimetable,
    closeEditor,
    draftCustomLabel,
    draftModule,
    editorPanel,
    focusedWeekDate,
    focusedWeekDayKey,
    handleClearSelection,
    handleSaveSelection,
    lastSavedAt,
    moduleColors,
    moduleDetails,
    now,
    openBaseCell,
    openOverrideCell,
    overrides,
    removeOverride,
    removeOverrideDay,
    resetEditorDrafts,
    resetWeekToToday,
    selectedCell,
    setDraftCustomLabel,
    setDraftModule,
    setEditorPanel,
    setModuleColors,
    setModuleDetails,
    setWeekAnchor,
    setWeekFocusIndex,
    sortedOverrideDates,
    statusCard,
    todayDayIndex,
    todayDayKey,
    todayKey,
    weekAnchor,
    weekDates,
  }
}

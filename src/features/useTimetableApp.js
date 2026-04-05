import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DAYS,
  buildModuleMaps,
  clearLegacyPersistentState,
  clearLegacyStoredState,
  cleanLabel,
  cleanModuleCode,
  createDefaultAppState,
  createModuleDefinition,
  getCurrentPeriodIndex,
  getDateKey,
  getDayIndex,
  getDayKey,
  getNextModuleCode,
  getOverrideValue,
  getStatusCard,
  getWeekDates,
  isModuleLabel,
  loadPersistentAppState,
  savePersistentAppState,
} from './timetableShared.js'

export function useTimetableApp() {
  const initialAppState = useMemo(() => createDefaultAppState(), [])
  const [baseTimetable, setBaseTimetable] = useState(initialAppState.baseTimetable)
  const [overrides, setOverrides] = useState(initialAppState.overrides)
  const [moduleDefinitions, setModuleDefinitions] = useState(initialAppState.moduleDefinitions)
  const initialSchoolDayIndex = getDayIndex(getDayKey(new Date()))
  const [selectedCell, setSelectedCell] = useState(null)
  const [draftModule, setDraftModule] = useState('')
  const [draftCustomLabel, setDraftCustomLabel] = useState('')
  const [weekAnchor, setWeekAnchor] = useState(() => new Date())
  const [weekFocusIndex, setWeekFocusIndex] = useState(() => (initialSchoolDayIndex >= 0 ? initialSchoolDayIndex : 0))
  const [now, setNow] = useState(() => new Date())
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [saveStatus, setSaveStatus] = useState('loading')
  const [hasLoadedPersistentState, setHasLoadedPersistentState] = useState(false)
  const { moduleColors, moduleDetails, moduleCodeSet } = useMemo(
    () => buildModuleMaps(moduleDefinitions),
    [moduleDefinitions],
  )

  useEffect(() => {
    let cancelled = false

    async function hydratePersistentState() {
      const persistedState = await loadPersistentAppState()

      if (cancelled) {
        return
      }

      setBaseTimetable(persistedState.baseTimetable)
      setOverrides(persistedState.overrides)
      setModuleDefinitions(persistedState.moduleDefinitions)

      setSaveStatus('idle')
      setHasLoadedPersistentState(true)
    }

    void hydratePersistentState()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedPersistentState) {
      return
    }

    let cancelled = false

    async function persistState() {
      setSaveStatus('saving')
      const saved = await savePersistentAppState({
        baseTimetable,
        overrides,
        moduleDefinitions,
      })

      if (cancelled) {
        return
      }

      if (saved) {
        clearLegacyStoredState()
        void clearLegacyPersistentState()
      }

      setSaveStatus(saved ? 'saved' : 'error')
      setLastSavedAt(saved ? new Date() : null)
    }

    void persistState()

    return () => {
      cancelled = true
    }
  }, [
    baseTimetable,
    hasLoadedPersistentState,
    moduleDefinitions,
    overrides,
  ])

  useEffect(() => {
    if (saveStatus !== 'saved') {
      return
    }

    const timer = window.setTimeout(() => {
      setSaveStatus('idle')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [saveStatus])

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
  const statusCard = getStatusCard(now, baseTimetable, overrides, moduleDetails, moduleCodeSet)
  const sortedOverrideDates = Object.keys(overrides).sort()

  const openBaseCell = useCallback((dayKey, periodIndex) => {
    const currentLabel = baseTimetable[dayKey][periodIndex] ?? ''
    setSelectedCell({ scope: 'base', dayKey, periodIndex })
    setDraftModule(isModuleLabel(currentLabel, moduleCodeSet) ? currentLabel : '')
    setDraftCustomLabel('')
  }, [baseTimetable, moduleCodeSet])

  const openOverrideCell = useCallback((dateKey, dayKey, periodIndex) => {
    if (!dayKey) {
      return
    }

    const currentLabel = getOverrideValue(overrides, dateKey, periodIndex) ?? ''
    setSelectedCell({ scope: 'override', dateKey, dayKey, periodIndex })
    setDraftModule(isModuleLabel(currentLabel, moduleCodeSet) ? currentLabel : '')
    setDraftCustomLabel(isModuleLabel(currentLabel, moduleCodeSet) ? '' : currentLabel)
  }, [moduleCodeSet, overrides])

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

  const addModule = useCallback(() => {
    setModuleDefinitions((current) => [
      ...current,
      createModuleDefinition(getNextModuleCode(current)),
    ])
  }, [])

  const updateModule = useCallback((moduleCode, updates) => {
    setModuleDefinitions((current) =>
      current.map((module) => (
        module.code === moduleCode
          ? {
              ...module,
              ...updates,
              color: updates.color ?? module.color,
            }
          : module
      )),
    )
  }, [])

  const renameModule = useCallback((moduleCode, nextCodeValue) => {
    const nextCode = cleanModuleCode(nextCodeValue)

    if (!nextCode || nextCode === moduleCode) {
      return nextCode === moduleCode
    }

    let renamed = false

    setModuleDefinitions((current) => {
      if (current.some((module) => module.code === nextCode)) {
        return current
      }

      renamed = true
      return current.map((module) => (
        module.code === moduleCode
          ? { ...module, code: nextCode }
          : module
      ))
    })

    if (!renamed) {
      return false
    }

    setBaseTimetable((current) =>
      Object.fromEntries(
        Object.entries(current).map(([dayKey, periods]) => [
          dayKey,
          periods.map((label) => (label === moduleCode ? nextCode : label)),
        ]),
      ),
    )

    setOverrides((current) =>
      Object.fromEntries(
        Object.entries(current).map(([dateKey, dayOverrides]) => [
          dateKey,
          Object.fromEntries(
            Object.entries(dayOverrides).map(([periodKey, label]) => [
              periodKey,
              label === moduleCode ? nextCode : label,
            ]),
          ),
        ]),
      ),
    )

    setDraftModule((current) => (current === moduleCode ? nextCode : current))

    return true
  }, [])

  const removeModule = useCallback((moduleCode) => {
    const removedModule = moduleDefinitions.find((module) => module.code === moduleCode)
    const fallbackLabel = removedModule?.subject || moduleCode

    setModuleDefinitions((current) =>
      current.filter((module) => module.code !== moduleCode),
    )

    setBaseTimetable((current) =>
      Object.fromEntries(
        Object.entries(current).map(([dayKey, periods]) => [
          dayKey,
          periods.map((label) => (label === moduleCode ? fallbackLabel : label)),
        ]),
      ),
    )

    setOverrides((current) =>
      Object.fromEntries(
        Object.entries(current).map(([dateKey, dayOverrides]) => [
          dateKey,
          Object.fromEntries(
            Object.entries(dayOverrides).map(([periodKey, label]) => [
              periodKey,
              label === moduleCode ? fallbackLabel : label,
            ]),
          ),
        ]),
      ),
    )

    setDraftModule((current) => (current === moduleCode ? '' : current))
  }, [moduleDefinitions])

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
    addModule,
    baseTimetable,
    closeEditor,
    draftCustomLabel,
    draftModule,
    focusedWeekDate,
    focusedWeekDayKey,
    handleClearSelection,
    handleSaveSelection,
    lastSavedAt,
    moduleCodeSet,
    moduleColors,
    moduleDefinitions,
    moduleDetails,
    now,
    openBaseCell,
    openOverrideCell,
    overrides,
    removeModule,
    removeOverride,
    removeOverrideDay,
    renameModule,
    resetEditorDrafts,
    resetWeekToToday,
    saveStatus,
    selectedCell,
    setDraftCustomLabel,
    setDraftModule,
    setWeekAnchor,
    setWeekFocusIndex,
    sortedOverrideDates,
    statusCard,
    todayDayIndex,
    todayDayKey,
    todayKey,
    updateModule,
    weekAnchor,
    weekDates,
  }
}

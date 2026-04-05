import { useEffect } from 'react'
import {
  MODULES,
  PERIODS,
  dateFromKey,
  formatDateLabel,
  getDayKey,
  getLabelPresentation,
  getModulePalette,
} from '../features/timetable/timetableShared.js'

export function SlotEditorPage({
  baseRouteDayKey,
  closeEditor,
  draftCustomLabel,
  draftModule,
  editorScope,
  goToBaseEdit,
  goToOverrideEdit,
  handleClearSelection,
  handleSaveSelection,
  moduleColors,
  moduleDetails,
  openBaseCell,
  openOverrideCell,
  overrideRouteDate,
  selectedCell,
  setDraftCustomLabel,
  setDraftModule,
  slotPeriodIndex,
}) {
  const overrideDayKey = getDayKey(dateFromKey(overrideRouteDate))

  useEffect(() => {
    if (slotPeriodIndex === null) {
      return
    }

    if (editorScope === 'base') {
      openBaseCell(baseRouteDayKey, slotPeriodIndex)
      return
    }

    if (overrideDayKey) {
      openOverrideCell(overrideRouteDate, overrideDayKey, slotPeriodIndex)
    }
  }, [
    baseRouteDayKey,
    editorScope,
    openBaseCell,
    openOverrideCell,
    overrideDayKey,
    overrideRouteDate,
    slotPeriodIndex,
  ])

  const period = slotPeriodIndex === null ? null : PERIODS[slotPeriodIndex]

  function navigateBack() {
    closeEditor()

    if (editorScope === 'base') {
      goToBaseEdit(baseRouteDayKey)
      return
    }

    goToOverrideEdit(overrideRouteDate)
  }

  function handleSaveAndBack() {
    handleSaveSelection()

    if (editorScope === 'base') {
      goToBaseEdit(baseRouteDayKey)
      return
    }

    goToOverrideEdit(overrideRouteDate)
  }

  function handleClearAndBack() {
    handleClearSelection()
    
    if (editorScope === 'base') {
      goToBaseEdit(baseRouteDayKey)
      return
    }

    goToOverrideEdit(overrideRouteDate)
  }

  useEffect(() => {
    if (!period || (editorScope === 'override' && !overrideDayKey)) {
      if (editorScope === 'base') {
        goToBaseEdit(baseRouteDayKey)
        return
      }

      goToOverrideEdit(overrideRouteDate)
    }
  }, [baseRouteDayKey, editorScope, goToBaseEdit, goToOverrideEdit, overrideDayKey, overrideRouteDate, period])

  if (!period || (editorScope === 'override' && !overrideDayKey)) {
    return null
  }

  const slotTitle = editorScope === 'base'
    ? `${baseRouteDayKey} ${period.label}`
    : `${formatDateLabel(overrideRouteDate, {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      })} ${period.label}`

  const currentLabel = draftCustomLabel || draftModule || null
  const currentPresentation = getLabelPresentation(currentLabel, moduleDetails)

  return (
    <section className="panel slot-editor-page">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{editorScope === 'base' ? 'Base slot' : 'Date override'}</p>
          <h2>{slotTitle}</h2>
          <p className="slot-editor-meta">
            {period.start} - {period.end}
          </p>
        </div>

        <button type="button" className="ghost-button" onClick={navigateBack}>
          Back
        </button>
      </div>

      <div className="slot-editor-current">
        <span className="eyebrow">Current selection</span>
        <strong>{currentPresentation.title}</strong>
        {currentPresentation.subtitle ? <small>{currentPresentation.subtitle}</small> : null}
      </div>

      <div className="slot-editor-section">
        <div className="slot-editor-section-head">
          <h3>Assign module</h3>
          <p>Pick one module for this period.</p>
        </div>

        <div className="module-picker">
          {MODULES.map((module) => {
            const palette = getModulePalette(module, moduleColors)
            const isActive = draftModule === module
            const modulePresentation = getLabelPresentation(module, moduleDetails)

            return (
              <button
                key={module}
                type="button"
                className={`module-chip ${isActive ? 'active' : ''}`}
                style={{
                  background: palette.background,
                  borderColor: palette.border,
                  color: palette.text,
                }}
                onClick={() => {
                  setDraftModule(module)
                  setDraftCustomLabel('')
                }}
              >
                <span>{module}</span>
                <small>{modulePresentation.title}</small>
              </button>
            )
          })}
        </div>
      </div>

      {selectedCell?.scope === 'override' ? (
        <div className="slot-editor-section">
          <div className="slot-editor-section-head">
            <h3>Or use a custom label</h3>
            <p>Useful for sports day, exam, event blocks, and one-off schedule changes.</p>
          </div>

          <label className="custom-field">
            <span>Custom label</span>
            <input
              type="text"
              value={draftCustomLabel}
              onChange={(event) => {
                setDraftCustomLabel(event.target.value)
                setDraftModule('')
              }}
              placeholder="e.g. Sports Day"
            />
          </label>
        </div>
      ) : null}

      <div className="assignment-actions slot-editor-actions">
        <button type="button" className="secondary-button" onClick={navigateBack}>
          Cancel
        </button>
        <button type="button" className="ghost-button" onClick={handleClearAndBack}>
          {selectedCell?.scope === 'base' ? 'Clear slot' : 'Remove override'}
        </button>
        <button type="button" className="primary-button" onClick={handleSaveAndBack}>
          Save and return
        </button>
      </div>
    </section>
  )
}

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
    <section className="mx-auto grid w-full max-w-[52rem] gap-4 rounded-[1.2rem] bg-[rgba(255,250,240,0.86)] p-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {editorScope === 'base' ? 'Base slot' : 'Date override'}
          </p>
          <h2 className="font-serif text-[clamp(1.45rem,3vw,2rem)] leading-[1.05] text-[var(--ink)]">
            {slotTitle}
          </h2>
          <p className="text-[var(--muted)]">
            {period.start} - {period.end}
          </p>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
          onClick={navigateBack}
        >
          Back
        </button>
      </div>

      <div className="grid gap-3 rounded-[1.1rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.94)] p-4">
        <span className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
          Current selection
        </span>
        <strong className="text-[var(--ink)]">{currentPresentation.title}</strong>
        {currentPresentation.subtitle ? (
          <small className="text-[var(--muted)]">{currentPresentation.subtitle}</small>
        ) : null}
      </div>

      <div className="grid gap-3 rounded-[1.1rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.94)] p-4">
        <div className="grid gap-3">
          <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
            Assign module
          </h3>
          <p className="text-[var(--muted)]">Pick one module for this period.</p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] gap-3">
          {MODULES.map((module) => {
            const palette = getModulePalette(module, moduleColors)
            const isActive = draftModule === module
            const modulePresentation = getLabelPresentation(module, moduleDetails)

            return (
              <button
                key={module}
                type="button"
                className={[
                  'grid cursor-pointer gap-1 rounded-[1rem] border-[1.5px] p-[0.8rem_0.6rem] text-left font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px',
                  isActive ? 'translate-y-[-1px] shadow-[0_0_0_3px_rgba(20,34,33,0.08)]' : '',
                ].join(' ')}
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
                <small className="text-[0.74rem] font-semibold leading-[1.2] opacity-80">
                  {modulePresentation.title}
                </small>
              </button>
            )
          })}
        </div>
      </div>

      {selectedCell?.scope === 'override' ? (
        <div className="grid gap-3 rounded-[1.1rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.94)] p-4">
          <div className="grid gap-3">
            <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
              Or use a custom label
            </h3>
            <p className="text-[var(--muted)]">
              Useful for sports day, exam, event blocks, and one-off schedule changes.
            </p>
          </div>

          <label className="grid gap-1.5">
            <span className="text-[0.88rem] font-bold text-[var(--muted)]">Custom label</span>
            <input
              type="text"
              value={draftCustomLabel}
              className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
              onChange={(event) => {
                setDraftCustomLabel(event.target.value)
                setDraftModule('')
              }}
              placeholder="e.g. Sports Day"
            />
          </label>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          className="cursor-pointer rounded-full border border-transparent bg-[rgba(20,34,33,0.06)] px-4 py-[0.7rem] text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
          onClick={navigateBack}
        >
          Cancel
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
          onClick={handleClearAndBack}
        >
          {selectedCell?.scope === 'base' ? 'Clear slot' : 'Remove override'}
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-full border border-[rgba(31,111,120,0.32)] bg-[rgba(31,111,120,0.18)] px-4 py-[0.7rem] text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
          onClick={handleSaveAndBack}
        >
          Save and return
        </button>
      </div>
    </section>
  )
}

import { EditToolPanel } from '../components/timetable/EditToolPanel.jsx'
import { WeekGrid } from '../components/timetable/WeekGrid.jsx'
import {
  DAYS,
  PERIODS,
  dateFromKey,
  getDayKey,
  getEffectiveLabel,
  getLabelPresentation,
  getModulePalette,
  getOverrideValue,
  getWeekDates,
} from '../features/timetable/timetableShared.js'

export function EditPage({
  baseRouteDayKey,
  baseTimetable,
  editorPanel,
  editorScope,
  goToBaseEdit,
  goToOverrideEdit,
  goToBaseSlot,
  goToOverrideSlot,
  moduleColors,
  moduleDetails,
  now,
  overrideRouteDate,
  overrides,
  setEditorPanel,
  setModuleColors,
  setModuleDetails,
  todayKey,
}) {
  const overrideDayKey = getDayKey(dateFromKey(overrideRouteDate))

  return (
    <section className="grid gap-4 min-[860px]:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.8fr)] min-[860px]:items-start">
      <div className="grid gap-4 rounded-[1.2rem] bg-[rgba(255,250,240,0.86)] p-4">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
              Edit mode
            </p>
            <h2 className="font-serif text-[clamp(1.45rem,3vw,2rem)] leading-[1.05] text-[var(--ink)]">
              {editorScope === 'base' ? 'Base timetable' : 'Date-specific override'}
            </h2>
          </div>

          <div
            className="inline-grid grid-flow-col gap-1 rounded-full bg-[rgba(20,34,33,0.08)] p-1 max-sm:w-full max-sm:grid-cols-2"
            role="tablist"
            aria-label="Edit scope"
          >
            <button
              type="button"
              className={[
                'cursor-pointer rounded-full border border-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px',
                editorScope === 'base'
                  ? 'border-[rgba(31,111,120,0.3)] bg-[rgba(31,111,120,0.16)] text-[var(--ink)]'
                  : '',
              ].join(' ')}
              onClick={() => {
                setEditorPanel('subjects')
                goToBaseEdit(baseRouteDayKey)
              }}
            >
              Weekly base
            </button>
            <button
              type="button"
              className={[
                'cursor-pointer rounded-full border border-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px',
                editorScope === 'override'
                  ? 'border-[rgba(31,111,120,0.3)] bg-[rgba(31,111,120,0.16)] text-[var(--ink)]'
                  : '',
              ].join(' ')}
              onClick={() => {
                setEditorPanel('subjects')
                goToOverrideEdit(overrideRouteDate)
              }}
            >
              Date override
            </button>
          </div>
        </div>

        {editorScope === 'base' ? (
          <WeekGrid
            weekDates={getWeekDates(now)}
            baseTimetable={baseTimetable}
            overrides={{}}
            moduleColors={moduleColors}
            moduleDetails={moduleDetails}
            todayKey={todayKey}
            activePeriodIndex={null}
            editable
            onCellClick={(dayKey, periodIndex) => goToBaseSlot(dayKey, periodIndex)}
          />
        ) : (
          <div className="grid gap-3">
            <label className="grid gap-1.5">
              <span className="text-[0.88rem] font-bold text-[var(--muted)]">Override date</span>
              <input
                type="date"
                value={overrideRouteDate}
                className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
                onChange={(event) => {
                  goToOverrideEdit(event.target.value)
                }}
              />
            </label>

            {overrideDayKey ? (
              <div className="grid gap-3">
                {PERIODS.map((period, periodIndex) => {
                  const overrideValue = getOverrideValue(overrides, overrideRouteDate, periodIndex)
                  const effectiveLabel = getEffectiveLabel(
                    baseTimetable,
                    overrides,
                    overrideDayKey,
                    overrideRouteDate,
                    periodIndex,
                  )
                  const baseLabel = baseTimetable[overrideDayKey][periodIndex]
                  const effectivePresentation = getLabelPresentation(effectiveLabel, moduleDetails)
                  const basePresentation = getLabelPresentation(baseLabel, moduleDetails)
                  const palette = getModulePalette(effectiveLabel, moduleColors)

                  return (
                    <button
                      key={period.number}
                      type="button"
                      className="flex cursor-pointer flex-col items-start gap-3 rounded-[1.1rem] border-[1.5px] p-[0.95rem_1rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px sm:flex-row sm:items-center sm:justify-between"
                      style={{
                        background: palette.background,
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                      onClick={() => goToOverrideSlot(overrideRouteDate, periodIndex)}
                    >
                      <div>
                        <strong className="text-[var(--ink)]">{period.label}</strong>
                        <span className="text-[var(--muted)]">
                          {period.start} - {period.end}
                        </span>
                      </div>
                      <div className="grid gap-1 text-left sm:text-right">
                        <span>{effectivePresentation.title}</span>
                        {effectivePresentation.subtitle ? (
                          <small className="text-[var(--muted)]">
                            {effectivePresentation.subtitle}
                          </small>
                        ) : null}
                        <small className="text-[var(--muted)]">
                          {overrideValue
                            ? `Base: ${basePresentation.title}`
                            : 'No override yet'}
                        </small>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="grid content-center gap-2">
                <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                  Weekday only
                </p>
                <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
                  Select a Monday-Friday date
                </h3>
                <p>Overrides are only available for school days in this schedule.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="grid gap-4">
        <EditToolPanel
          editorPanel={editorPanel}
          setEditorPanel={setEditorPanel}
          moduleColors={moduleColors}
          setModuleColors={setModuleColors}
          moduleDetails={moduleDetails}
          setModuleDetails={setModuleDetails}
        />
      </aside>
    </section>
  )
}

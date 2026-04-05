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
    <section className="edit-layout">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Edit mode</p>
            <h2>{editorScope === 'base' ? 'Base timetable' : 'Date-specific override'}</h2>
          </div>

          <div className="segmented-control" role="tablist" aria-label="Edit scope">
            <button
              type="button"
              className={editorScope === 'base' ? 'active' : ''}
              onClick={() => {
                setEditorPanel('subjects')
                goToBaseEdit(baseRouteDayKey)
              }}
            >
              Weekly base
            </button>
            <button
              type="button"
              className={editorScope === 'override' ? 'active' : ''}
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
          <div className="override-editor">
            <label className="date-field">
              <span>Override date</span>
              <input
                type="date"
                value={overrideRouteDate}
                onChange={(event) => {
                  goToOverrideEdit(event.target.value)
                }}
              />
            </label>

            {overrideDayKey ? (
              <div className="override-periods">
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
                      className="override-period-card"
                      style={{
                        background: palette.background,
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                      onClick={() => goToOverrideSlot(overrideRouteDate, periodIndex)}
                    >
                      <div>
                        <strong>{period.label}</strong>
                        <span>
                          {period.start} - {period.end}
                        </span>
                      </div>
                      <div className="override-period-copy">
                        <span>{effectivePresentation.title}</span>
                        {effectivePresentation.subtitle ? (
                          <small>{effectivePresentation.subtitle}</small>
                        ) : null}
                        <small>
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
              <div className="editor-placeholder compact">
                <p className="eyebrow">Weekday only</p>
                <h3>Select a Monday-Friday date</h3>
                <p>Overrides are only available for school days in this schedule.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="side-column">
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

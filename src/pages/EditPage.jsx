import {
  PERIODS,
  dateFromKey,
  getDayKey,
  getEffectiveLabel,
  getLabelPresentation,
  getModulePalette,
  getOverrideValue,
} from '../features/timetableShared.js'

export function OverridePage({
  baseTimetable,
  goToOverrideEdit,
  goToOverrideSlot,
  moduleColors,
  moduleCodeSet,
  moduleDetails,
  overrideRouteDate,
  overrides,
}) {
  const overrideDayKey = getDayKey(dateFromKey(overrideRouteDate))

  return (
    <section className="grid gap-4 min-[860px]:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.8fr)] min-[860px]:items-start">
      <div className="grid gap-4 rounded-[1.2rem] bg-[rgba(255,250,240,0.86)] p-4">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
              Override
            </p>
            <h2 className="font-serif text-[clamp(1.45rem,3vw,2rem)] leading-[1.05] text-[var(--ink)]">
              Date-specific override
            </h2>
          </div>
        </div>

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
                const effectivePresentation = getLabelPresentation(
                  effectiveLabel,
                  moduleDetails,
                  moduleCodeSet,
                )
                const basePresentation = getLabelPresentation(
                  baseLabel,
                  moduleDetails,
                  moduleCodeSet,
                )
                const palette = getModulePalette(effectiveLabel, moduleColors, moduleCodeSet)

                return (
                  <button
                    key={period.number}
                    type="button"
                    className="flex cursor-pointer flex-col items-start gap-3 rounded-[1.1rem] border-[1.5px] p-[0.95rem_1rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] sm:flex-row sm:items-center sm:justify-between"
                    style={{
                      background: palette.background,
                      borderColor: palette.border,
                      color: palette.text,
                    }}
                    onClick={() => goToOverrideSlot(overrideRouteDate, periodIndex)}
                  >
                    <div className='flex gap-2'>
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
                      
                      {overrideValue && <small className="text-[var(--muted)]">
                       Base: ${basePresentation.title}
                      </small>}
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
      </div>
    </section>
  )
}

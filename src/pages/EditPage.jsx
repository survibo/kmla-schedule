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
    <section className="grid gap-[0.85rem]">
      <div className="grid gap-[0.9rem] rounded-[1rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.96)] p-4 shadow-[0_0.6rem_1.4rem_rgba(24,49,47,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
              Override
            </p>
            <h2 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
              {dateFromKey(overrideRouteDate).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
              })}
            </h2>
          </div>

          <div className="w-full max-w-[14rem]">
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
          </div>
        </div>

        <div className="grid gap-1">
          {overrideDayKey ? (
            <div className="grid gap-1">
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
                    className={[
                      'grid min-h-[86px] grid-cols-1 items-center gap-[0.3rem] rounded-[0.5rem] border-[1.5px] p-[0.4rem] px-[0.6rem] text-left max-sm:items-start sm:grid-cols-[minmax(4.2rem,4.8rem)_minmax(0,1fr)_auto] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]',
                      overrideValue ? 'border-dashed' : '',
                    ].join(' ')}
                    style={{
                      background: palette.background,
                      borderColor: palette.border,
                      color: palette.text,
                    }}
                    onClick={() => goToOverrideSlot(overrideRouteDate, periodIndex)}
                  >
                    <div className="flex items-center gap-1">
                      <strong className="text-[0.92rem] text-[var(--ink)]">{period.label}</strong>
                      <span className="text-[0.75rem] leading-[1.25] text-[var(--muted)]">
                        {period.start} - {period.end}
                      </span>
                    </div>
                    <div className="grid min-w-0 gap-1">
                      <span className="font-extrabold leading-[1.2]">{effectivePresentation.title}</span>
                      {effectivePresentation.subtitle ? (
                        <small className="text-[0.78rem] leading-[1.25] opacity-[0.82]">
                          {effectivePresentation.subtitle}
                        </small>
                      ) : null}

                      {overrideValue ? (
                        <small className="text-[0.78rem] leading-[1.25] text-[var(--muted)]">
                          Base: {basePresentation.title}
                        </small>
                      ) : null}
                    </div>
                    <div className="grid gap-[0.35rem] justify-self-start max-sm:grid-flow-col sm:justify-items-end">
                      {overrideValue ? (
                        <small className="w-fit rounded-full bg-[rgba(20,34,33,0.08)] px-[0.45rem] py-[0.18rem] text-[0.72rem] font-bold uppercase tracking-[0.04em]">
                          Override
                        </small>
                      ) : null}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid gap-[0.65rem] rounded-[0.5rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,248,236,0.7)] p-4">
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

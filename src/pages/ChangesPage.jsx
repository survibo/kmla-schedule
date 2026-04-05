import {
  PERIODS,
  formatDateLabel,
  getLabelPresentation,
  getModulePalette,
} from '../features/timetableShared.js'

export function ChangesPage({
  jumpToOverridesEdit,
  moduleColors,
  moduleCodeSet,
  moduleDetails,
  overrides,
  removeOverride,
  removeOverrideDay,
  sortedOverrideDates,
}) {
  return (
    <section className="grid gap-4 rounded-[1.2rem] bg-[rgba(255,250,240,0.86)] p-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            Overrides list
          </p>
          <h2 className="font-serif text-[clamp(1.45rem,3vw,2rem)] leading-[1.05] text-[var(--ink)]">
            One-off changes
          </h2>
        </div>
      </div>

      {sortedOverrideDates.length === 0 ? (
        <div className="grid min-h-48 content-center gap-2">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            Nothing stored yet
          </p>
          <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
            Your weekly base schedule is in control
          </h3>
          <p>Date-specific overrides will appear here as soon as you add them.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedOverrideDates.map((dateKey) => (
            <article
              key={dateKey}
              className="grid gap-4 rounded-[1.25rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.92)] p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                    {formatDateLabel(dateKey, { weekday: 'long' })}
                  </p>
                  <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
                    {formatDateLabel(dateKey, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    className="cursor-pointer rounded-full border border-transparent bg-[rgba(20,34,33,0.06)] px-4 py-[0.7rem] text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
                    onClick={() => jumpToOverridesEdit(dateKey)}
                  >
                    Edit date
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
                    onClick={() => removeOverrideDay(dateKey)}
                  >
                    Clear day
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
                {Object.entries(overrides[dateKey]).map(([periodKey, label]) => {
                  const periodIndex = Number(periodKey) - 1
                  const palette = getModulePalette(label, moduleColors, moduleCodeSet)
                  const presentation = getLabelPresentation(label, moduleDetails, moduleCodeSet)

                  return (
                    <div
                      key={periodKey}
                      className="flex flex-col items-start gap-3 rounded-[1rem] border-[1.5px] p-[0.75rem_0.85rem] sm:flex-row sm:items-center sm:justify-between"
                      style={{
                        background: palette.background,
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    >
                      <span className="font-bold">
                        {PERIODS[periodIndex].label}: {presentation.title}
                      </span>
                      {presentation.subtitle ? (
                        <small className="opacity-80">{presentation.subtitle}</small>
                      ) : null}
                      <button
                        type="button"
                        className="cursor-pointer rounded-full bg-[rgba(20,34,33,0.08)] px-3 py-2 text-sm font-semibold text-[var(--ink)] transition duration-150 ease-out hover:-translate-y-px"
                        onClick={() => removeOverride(dateKey, periodIndex)}
                        aria-label={`Remove ${PERIODS[periodIndex].label} override`}
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

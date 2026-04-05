import {
  PERIODS,
  formatDateLabel,
  getLabelPresentation,
  getModulePalette,
} from '../features/timetable/timetableShared.js'

export function ChangesPage({
  jumpToOverridesEdit,
  moduleColors,
  moduleDetails,
  overrides,
  removeOverride,
  removeOverrideDay,
  sortedOverrideDates,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Overrides list</p>
          <h2>One-off changes</h2>
        </div>
      </div>

      {sortedOverrideDates.length === 0 ? (
        <div className="editor-placeholder">
          <p className="eyebrow">Nothing stored yet</p>
          <h3>Your weekly base schedule is in control</h3>
          <p>Date-specific overrides will appear here as soon as you add them.</p>
        </div>
      ) : (
        <div className="override-list">
          {sortedOverrideDates.map((dateKey) => (
            <article key={dateKey} className="override-list-card">
              <div className="override-list-header">
                <div>
                  <p className="eyebrow">{formatDateLabel(dateKey, { weekday: 'long' })}</p>
                  <h3>{formatDateLabel(dateKey, { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                </div>

                <div className="override-list-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => jumpToOverridesEdit(dateKey)}
                  >
                    Edit date
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => removeOverrideDay(dateKey)}
                  >
                    Clear day
                  </button>
                </div>
              </div>

              <div className="override-tags">
                {Object.entries(overrides[dateKey]).map(([periodKey, label]) => {
                  const periodIndex = Number(periodKey) - 1
                  const palette = getModulePalette(label, moduleColors)
                  const presentation = getLabelPresentation(label, moduleDetails)

                  return (
                    <div
                      key={periodKey}
                      className="override-tag"
                      style={{
                        background: palette.background,
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    >
                      <span>
                        {PERIODS[periodIndex].label}: {presentation.title}
                      </span>
                      {presentation.subtitle ? <small>{presentation.subtitle}</small> : null}
                      <button
                        type="button"
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

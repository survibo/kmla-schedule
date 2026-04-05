import {
  DAYS,
  PERIODS,
  getDateKey,
  getEffectiveLabel,
  getLabelPresentation,
  getModulePalette,
  getOverrideValue,
} from '../../features/timetable/timetableShared.js'

export function WeekGrid({
  weekDates,
  baseTimetable,
  overrides,
  moduleColors,
  moduleDetails,
  todayKey,
  activePeriodIndex,
  editable = false,
  selectedCell,
  onCellClick,
}) {
  return (
    <>
      <div className="week-mobile-focus">
        {weekDates.map((date, dayIndex) => {
          const dateKey = getDateKey(date)
          const dayKey = DAYS[dayIndex].key

          return (
            <ScheduleDayCard
              key={dateKey}
              date={date}
              dayKey={dayKey}
              dateKey={dateKey}
              baseTimetable={baseTimetable}
              overrides={overrides}
              moduleColors={moduleColors}
              moduleDetails={moduleDetails}
              todayKey={todayKey}
              activePeriodIndex={activePeriodIndex}
              editable={editable}
              selectedCell={selectedCell}
              onCellClick={onCellClick}
            />
          )
        })}
      </div>

      <div className="week-grid-wrap week-desktop-grid">
        <div className="week-grid" role="table" aria-label="Weekly timetable">
          <div className="grid-corner">
            <span>Period</span>
          </div>

          {weekDates.map((date, index) => {
            const dateKey = getDateKey(date)
            const isToday = dateKey === todayKey

            return (
              <div
                key={dateKey}
                className={`day-header ${isToday ? 'today' : ''}`}
                style={{ gridColumn: index + 2, gridRow: 1 }}
              >
                <strong>{DAYS[index].label}</strong>
                <span>{date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span>
              </div>
            )
          })}

          {PERIODS.slice(0, 4).map((period, rowIndex) => (
            <PeriodRow
              key={period.number}
              period={period}
              rowIndex={rowIndex + 2}
              dayDates={weekDates}
              baseTimetable={baseTimetable}
              overrides={overrides}
              moduleColors={moduleColors}
              moduleDetails={moduleDetails}
              todayKey={todayKey}
              activePeriodIndex={activePeriodIndex}
              editable={editable}
              selectedCell={selectedCell}
              onCellClick={onCellClick}
            />
          ))}

          <div className="time-cell lunch-time" style={{ gridColumn: 1, gridRow: 6 }}>
            <span>Lunch</span>
            <small>12:30 - 13:30</small>
          </div>
          <div className="lunch-row" style={{ gridColumn: '2 / span 5', gridRow: 6 }}>
            <strong>Lunch break</strong>
            <span>12:20 - 12:30 buffer, lunch from 12:30 - 13:30, class resumes at 13:40.</span>
          </div>

          {PERIODS.slice(4).map((period, rowIndex) => (
            <PeriodRow
              key={period.number}
              period={period}
              rowIndex={rowIndex + 7}
              dayDates={weekDates}
              baseTimetable={baseTimetable}
              overrides={overrides}
              moduleColors={moduleColors}
              moduleDetails={moduleDetails}
              todayKey={todayKey}
              activePeriodIndex={activePeriodIndex}
              editable={editable}
              selectedCell={selectedCell}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export function ScheduleDayCard({
  date,
  dayKey,
  dateKey,
  baseTimetable,
  overrides,
  moduleColors,
  moduleDetails,
  todayKey,
  activePeriodIndex,
  editable,
  selectedCell,
  onCellClick,
}) {
  const isToday = dateKey === todayKey
  const dayLabel = DAYS.find((day) => day.key === dayKey)?.label

  return (
    <section className={`day-card ${isToday ? 'today' : ''} ${editable ? 'editable' : ''}`}>
      <div className="day-card-header">
        <div>
          <p className="eyebrow">{editable ? 'Tap a period to edit' : dayLabel}</p>
          <h3>
            {date.toLocaleDateString(undefined, {
              weekday: editable ? 'short' : undefined,
              month: 'long',
              day: 'numeric',
            })}
          </h3>
        </div>
        <div className="day-card-badges">
          {editable ? <span className="today-pill neutral">Edit mode</span> : null}
          {isToday ? <span className="today-pill">Today</span> : null}
        </div>
      </div>

      <div className="day-card-periods">
        {PERIODS.map((period) => {
          const label = getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, period.number - 1)
          const presentation = getLabelPresentation(label, moduleDetails)
          const hasOverride = Boolean(getOverrideValue(overrides, dateKey, period.number - 1))
          const isLive = isToday && activePeriodIndex === period.number - 1
          const isSelected =
            editable &&
            selectedCell?.scope === 'base' &&
            selectedCell.dayKey === dayKey &&
            selectedCell.periodIndex === period.number - 1
          const palette = getModulePalette(label, moduleColors)
          const classes = [
            'day-period-row',
            editable ? 'editable' : '',
            isLive ? 'live' : '',
            hasOverride ? 'overridden' : '',
            isSelected ? 'selected' : '',
          ]
            .filter(Boolean)
            .join(' ')

          const content = (
            <>
              <div className="day-period-time">
                <strong>{period.label}</strong>
                <span>
                  {period.start} - {period.end}
                </span>
              </div>
              <div className="day-period-main">
                <span className="day-period-title">{presentation.title}</span>
                {presentation.subtitle ? (
                  <small className="day-period-meta">{presentation.subtitle}</small>
                ) : null}
              </div>
              <div className="day-period-flags">
                {isLive ? <small className="live-pill">Now</small> : null}
                {hasOverride ? <small className="override-badge">Override</small> : null}
              </div>
            </>
          )

          if (editable) {
            return (
              <button
                key={period.number}
                type="button"
                className={classes}
                style={{
                  background: palette.background,
                  borderColor: palette.border,
                  color: palette.text,
                }}
                onClick={() => onCellClick(dayKey, period.number - 1)}
              >
                {content}
              </button>
            )
          }

          return (
            <div
              key={period.number}
              className={classes}
              style={{
                background: palette.background,
                borderColor: palette.border,
                color: palette.text,
              }}
            >
              {content}
            </div>
          )
        })}
      </div>

      <div className="day-card-lunch">
        <strong>Lunch</strong>
        <span>12:20 - 12:30 buffer, lunch 12:30 - 13:30</span>
      </div>
    </section>
  )
}

function PeriodRow({
  period,
  rowIndex,
  dayDates,
  baseTimetable,
  overrides,
  moduleColors,
  moduleDetails,
  todayKey,
  activePeriodIndex,
  editable,
  selectedCell,
  onCellClick,
}) {
  return (
    <>
      <div className="time-cell" style={{ gridColumn: 1, gridRow: rowIndex }}>
        <span>{period.label}</span>
        <small>
          {period.start} - {period.end}
        </small>
      </div>

      {dayDates.map((date, dayIndex) => {
        const dateKey = getDateKey(date)
        const dayKey = DAYS[dayIndex].key
        const label = getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, period.number - 1)
        const presentation = getLabelPresentation(label, moduleDetails)
        const hasOverride = Boolean(getOverrideValue(overrides, dateKey, period.number - 1))
        const isToday = dateKey === todayKey
        const isLive = isToday && activePeriodIndex === period.number - 1
        const isSelected =
          editable &&
          selectedCell?.scope === 'base' &&
          selectedCell.dayKey === dayKey &&
          selectedCell.periodIndex === period.number - 1
        const palette = getModulePalette(label, moduleColors)
        const classes = [
          'grid-cell',
          editable ? 'editable' : '',
          isToday ? 'today' : '',
          isLive ? 'live' : '',
          hasOverride ? 'overridden' : '',
          isSelected ? 'selected' : '',
        ]
          .filter(Boolean)
          .join(' ')

        const content = (
          <>
            <div className="grid-cell-copy">
              <span className="grid-cell-label">{presentation.title}</span>
              {presentation.subtitle ? (
                <small className="grid-cell-meta">{presentation.subtitle}</small>
              ) : null}
            </div>
            {hasOverride ? <small className="override-badge">Override</small> : null}
          </>
        )

        if (editable) {
          return (
            <button
              key={dateKey}
              type="button"
              className={classes}
              style={{
                gridColumn: dayIndex + 2,
                gridRow: rowIndex,
                background: palette.background,
                borderColor: palette.border,
                color: palette.text,
              }}
              onClick={() => onCellClick(dayKey, period.number - 1)}
            >
              {content}
            </button>
          )
        }

        return (
          <div
            key={dateKey}
            className={classes}
            style={{
              gridColumn: dayIndex + 2,
              gridRow: rowIndex,
              background: palette.background,
              borderColor: palette.border,
              color: palette.text,
            }}
          >
            {content}
          </div>
        )
      })}
    </>
  )
}

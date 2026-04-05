import { ScheduleDayCard } from '../components/timetable/WeekGrid.jsx'
import {
  getDateKey,
  getDayKey,
  getNextSchoolDate,
  getSchoolDateLabel,
  shiftDate,
} from '../features/timetable/timetableShared.js'

export function SchedulePage({
  activePeriodIndex,
  baseTimetable,
  moduleColors,
  moduleDetails,
  overrides,
  resetWeekToToday,
  setWeekAnchor,
  todayKey,
  weekAnchor,
}) {
  const selectedDate = weekAnchor
  const selectedDateKey = getDateKey(selectedDate)
  const selectedDayKey = getDayKey(selectedDate)

  return (
    <section className="schedule-page">
      <div className="schedule-toolbar" aria-label="Schedule navigation">
        <button
          type="button"
          className="mini-button"
          onClick={() => setWeekAnchor((current) => shiftDate(current, -1))}
          aria-label="Previous day"
        >
          Prev
        </button>
        <button
          type="button"
          className="mini-button"
          onClick={resetWeekToToday}
        >
          Today
        </button>
        <button
          type="button"
          className="mini-button"
          onClick={() => setWeekAnchor((current) => shiftDate(current, 1))}
          aria-label="Next day"
        >
          Next
        </button>
      </div>

      {selectedDayKey ? (
        <ScheduleDayCard
          date={selectedDate}
          dayKey={selectedDayKey}
          dateKey={selectedDateKey}
          baseTimetable={baseTimetable}
          overrides={overrides}
          moduleColors={moduleColors}
          moduleDetails={moduleDetails}
          todayKey={todayKey}
          activePeriodIndex={activePeriodIndex}
        />
      ) : (
        <section className="day-card weekend-card">
          <div className="day-card-header">
            <div>
              <p className="eyebrow">No classes</p>
              <h3>
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
            </div>
            {selectedDateKey === todayKey ? <span className="today-pill">Today</span> : null}
          </div>

          <div className="weekend-copy">
            <strong>Weekend</strong>
            <p>Next school day: {getSchoolDateLabel(getNextSchoolDate(selectedDate))}</p>
          </div>
        </section>
      )}
    </section>
  )
}

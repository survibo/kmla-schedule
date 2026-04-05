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
    <section className="grid gap-[0.85rem]">
      <div className="grid grid-cols-3 justify-start gap-[0.45rem] sm:w-fit" aria-label="Schedule navigation">
        <button
          type="button"
          className="min-h-10 cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-[rgba(255,248,236,0.88)] px-3 py-2 text-[0.86rem] font-bold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
          onClick={() => setWeekAnchor((current) => shiftDate(current, -1))}
          aria-label="Previous day"
        >
          Prev
        </button>
        <button
          type="button"
          className="min-h-10 cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-[rgba(255,248,236,0.88)] px-3 py-2 text-[0.86rem] font-bold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
          onClick={resetWeekToToday}
        >
          Today
        </button>
        <button
          type="button"
          className="min-h-10 cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-[rgba(255,248,236,0.88)] px-3 py-2 text-[0.86rem] font-bold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px"
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
        <section className="grid gap-[0.65rem] rounded-[1.35rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.96)] p-4 shadow-[0_0.6rem_1.4rem_rgba(24,49,47,0.06)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                No classes
              </p>
              <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
            </div>
            {selectedDateKey === todayKey ? (
              <span className="inline-flex items-center justify-center rounded-full bg-[rgba(31,111,120,0.12)] px-[0.65rem] py-[0.3rem] text-[0.75rem] font-extrabold uppercase tracking-[0.04em] text-[var(--accent)]">
                Today
              </span>
            ) : null}
          </div>

          <div className="grid gap-[0.65rem]">
            <strong className="text-base text-[var(--ink)]">Weekend</strong>
            <p className="text-[var(--muted)]">
              Next school day: {getSchoolDateLabel(getNextSchoolDate(selectedDate))}
            </p>
          </div>
        </section>
      )}
    </section>
  )
}

import {
  DAYS,
  PERIODS,
  getDateKey,
  getEffectiveLabel,
  getLabelPresentation,
  getModulePalette,
  getOverrideValue,
} from '../features/timetableShared.js'

export function WeekGrid({
  weekDates,
  baseTimetable,
  overrides,
  moduleColors,
  moduleCodeSet,
  moduleDetails,
  todayKey,
  activePeriodIndex,
  editable = false,
  selectedCell,
  onCellClick,
}) {
  return (
    <>
      <div className="grid gap-[0.9rem] min-[860px]:hidden">
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
              moduleCodeSet={moduleCodeSet}
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

      <div className="hidden overflow-x-auto pb-1 min-[860px]:block">
        <div
          className="grid min-w-[46rem] auto-rows-[minmax(4.8rem,auto)] grid-cols-[6rem_repeat(5,minmax(7rem,1fr))] gap-[0.55rem]"
          role="table"
          aria-label="Weekly timetable"
        >
          <div className="grid min-h-[4.6rem] content-center gap-1 rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,247,235,0.92)] p-[0.85rem]">
            <span>Period</span>
          </div>

          {weekDates.map((date, index) => {
            const dateKey = getDateKey(date)
            const isToday = dateKey === todayKey

            return (
              <div
                key={dateKey}
                className={[
                  'grid min-h-[4.6rem] content-center gap-1 rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,247,235,0.92)] p-[0.85rem]',
                  isToday ? 'shadow-[inset_0_0_0_2px_rgba(31,111,120,0.15)]' : '',
                ].join(' ')}
                style={{ gridColumn: index + 2, gridRow: 1 }}
              >
                <strong>{DAYS[index].label}</strong>
                <span className="text-[var(--muted)]">
                  {date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                </span>
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
              moduleCodeSet={moduleCodeSet}
              moduleDetails={moduleDetails}
              todayKey={todayKey}
              activePeriodIndex={activePeriodIndex}
              editable={editable}
              selectedCell={selectedCell}
              onCellClick={onCellClick}
            />
          ))}

          <div
            className="grid content-center gap-[0.2rem] rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,247,235,0.92)] p-[0.85rem]"
            style={{ gridColumn: 1, gridRow: 6 }}
          >
            <span>Lunch</span>
            <small className="text-[var(--muted)]">12:30 - 13:30</small>
          </div>
          <div
            className="grid content-center gap-[0.3rem] rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,247,235,0.92)] p-[0.9rem_1rem]"
            style={{ gridColumn: '2 / span 5', gridRow: 6 }}
          >
            <strong>Lunch break</strong>
            <span className="text-[var(--muted)]">
              12:20 - 12:30 buffer, lunch from 12:30 - 13:30, class resumes at 13:40.
            </span>
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
  moduleCodeSet,
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
    <section
      className={[
        'grid gap-[0.9rem] border rounded-[1rem] border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.96)] p-4 shadow-[0_0.6rem_1.4rem_rgba(24,49,47,0.06)]',
        isToday ? 'border-[rgba(31,111,120,0.35)] shadow-[0_0_0_3px_rgba(31,111,120,0.08)]' : '',
      ].join(' ')}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {dayLabel}
          </p>
          <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
            {date.toLocaleDateString(undefined, {
              weekday: editable ? 'short' : undefined,
              month: 'long',
              day: 'numeric',
            })}
          </h3>
        </div>
        <div className="flex flex-wrap gap-[0.4rem] max-sm:justify-start sm:justify-end">
          {isToday ? (
            <span className="inline-flex items-center justify-center rounded-full bg-[rgba(31,111,120,0.12)] px-[0.65rem] py-[0.3rem] text-[0.75rem] font-extrabold uppercase tracking-[0.04em] text-[var(--accent)]">
              Today
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-1">
        {PERIODS.map((period) => {
          const label = getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, period.number - 1)
          const presentation = getLabelPresentation(label, moduleDetails, moduleCodeSet)
          const hasOverride = Boolean(getOverrideValue(overrides, dateKey, period.number - 1))
          const isLive = isToday && activePeriodIndex === period.number - 1
          const isSelected =
            editable &&
            selectedCell?.scope === 'base' &&
            selectedCell.dayKey === dayKey &&
            selectedCell.periodIndex === period.number - 1
          const palette = getModulePalette(label, moduleColors, moduleCodeSet)

          const content = (
            <>
              <div className="flex gap-1 items-center">
                <strong className="text-[0.92rem] text-[var(--ink)]">{period.label}</strong>
                <span className="text-[0.75rem] leading-[1.25] text-[var(--muted)]">
                  {period.start} - {period.end}
                </span>
              </div>
              <div className="grid min-w-0 gap-1">
                <span className="font-extrabold leading-[1.2]">{presentation.title}</span>
                {presentation.subtitle ? (
                  <small className="text-[0.78rem] leading-[1.25] opacity-[0.82]">
                    {presentation.subtitle}
                  </small>
                ) : null}
              </div>
              <div className="grid gap-[0.35rem] justify-self-start max-sm:grid-flow-col sm:justify-items-end">
                {isLive ? (
                  <small className="inline-flex items-center justify-center rounded-full bg-[rgba(31,111,120,0.14)] px-[0.65rem] py-[0.3rem] text-[0.75rem] font-extrabold uppercase tracking-[0.04em] text-[var(--accent)]">
                    Now
                  </small>
                ) : null}
                {hasOverride ? (
                  <small className="w-fit rounded-full bg-[rgba(20,34,33,0.08)] px-[0.45rem] py-[0.18rem] text-[0.72rem] font-bold uppercase tracking-[0.04em]">
                    Override
                  </small>
                ) : null}
              </div>
            </>
          )

          if (editable) {
            return (
              <button
                key={period.number}
                type="button"
                className={[
                  'grid grid-cols-1 items-center gap-[0.3rem] min-h-[86px] rounded-[0.5rem] border-[1.5px] p-[0.4rem] px-[0.6rem] text-left max-sm:items-start sm:grid-cols-[minmax(4.2rem,4.8rem)_minmax(0,1fr)_auto] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]',
                  hasOverride ? 'border-dashed' : '',
                  isSelected ? 'shadow-[0_0_0_3px_rgba(47,124,172,0.16)]' : '',
                  !isSelected && isLive
                    ? 'shadow-[inset_0_0_0_2px_rgba(31,111,120,0.55),0_0_0_4px_rgba(31,111,120,0.06)]'
                    : '',
                ].join(' ')}
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
              className={[
                'grid grid-cols-1 items-center gap-[0.3rem] min-h-[86px] rounded-[0.5rem] border-[1.5px] p-[0.4rem] px-[0.6rem] text-left max-sm:items-start sm:grid-cols-[minmax(4.2rem,4.8rem)_minmax(0,1fr)_auto]',
                hasOverride ? 'border-dashed' : '',
                isSelected ? 'shadow-[0_0_0_3px_rgba(47,124,172,0.16)]' : '',
                !isSelected && isLive
                  ? 'shadow-[inset_0_0_0_2px_rgba(31,111,120,0.55),0_0_0_4px_rgba(31,111,120,0.06)]'
                  : '',
              ].join(' ')}
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
  moduleCodeSet,
  moduleDetails,
  todayKey,
  activePeriodIndex,
  editable,
  selectedCell,
  onCellClick,
}) {
  return (
    <>
      <div
        className="grid content-center gap-[0.2rem] rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,247,235,0.92)] p-[0.85rem]"
        style={{ gridColumn: 1, gridRow: rowIndex }}
      >
        <span>{period.label}</span>
        <small className="text-[var(--muted)]">
          {period.start} - {period.end}
        </small>
      </div>

      {dayDates.map((date, dayIndex) => {
        const dateKey = getDateKey(date)
        const dayKey = DAYS[dayIndex].key
        const label = getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, period.number - 1)
        const presentation = getLabelPresentation(label, moduleDetails, moduleCodeSet)
        const hasOverride = Boolean(getOverrideValue(overrides, dateKey, period.number - 1))
        const isToday = dateKey === todayKey
        const isLive = isToday && activePeriodIndex === period.number - 1
        const isSelected =
          editable &&
          selectedCell?.scope === 'base' &&
          selectedCell.dayKey === dayKey &&
          selectedCell.periodIndex === period.number - 1
        const palette = getModulePalette(label, moduleColors, moduleCodeSet)

        const content = (
          <>
            <div className="grid gap-1">
              <span className="font-bold leading-[1.2]">{presentation.title}</span>
              {presentation.subtitle ? (
                <small className="text-[0.78rem] leading-[1.25] opacity-[0.82]">
                  {presentation.subtitle}
                </small>
              ) : null}
            </div>
            {hasOverride ? (
              <small className="w-fit rounded-full bg-[rgba(20,34,33,0.08)] px-[0.45rem] py-[0.18rem] text-[0.72rem] font-bold uppercase tracking-[0.04em]">
                Override
              </small>
            ) : null}
          </>
        )

        if (editable) {
          return (
            <button
              key={dateKey}
              type="button"
              className={[
                'relative grid content-between gap-[0.65rem] rounded-[1.2rem] border-[1.5px] p-[0.85rem] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]',
                hasOverride ? 'border-dashed' : '',
                isSelected ? 'shadow-[0_0_0_3px_rgba(47,124,172,0.2)]' : '',
                !isSelected && isLive
                  ? 'shadow-[inset_0_0_0_2px_rgba(31,111,120,0.65),0_0_0_4px_rgba(31,111,120,0.08)]'
                  : '',
                !isSelected && !isLive && isToday
                  ? 'shadow-[inset_0_0_0_2px_rgba(31,111,120,0.15)]'
                  : '',
              ].join(' ')}
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
            className={[
              'relative grid content-between gap-[0.65rem] rounded-[1.2rem] border-[1.5px] p-[0.85rem]',
              hasOverride ? 'border-dashed' : '',
              isSelected ? 'shadow-[0_0_0_3px_rgba(47,124,172,0.2)]' : '',
              !isSelected && isLive
                ? 'shadow-[inset_0_0_0_2px_rgba(31,111,120,0.65),0_0_0_4px_rgba(31,111,120,0.08)]'
                : '',
              !isSelected && !isLive && isToday
                ? 'shadow-[inset_0_0_0_2px_rgba(31,111,120,0.15)]'
                : '',
            ].join(' ')}
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

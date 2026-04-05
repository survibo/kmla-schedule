export const DAYS = [
  { key: 'Mon', label: 'Mon' },
  { key: 'Tue', label: 'Tue' },
  { key: 'Wed', label: 'Wed' },
  { key: 'Thu', label: 'Thu' },
  { key: 'Fri', label: 'Fri' },
]

export const PERIODS = [
  { number: 1, label: '1st', start: '08:30', end: '09:20' },
  { number: 2, label: '2nd', start: '09:30', end: '10:20' },
  { number: 3, label: '3rd', start: '10:30', end: '11:20' },
  { number: 4, label: '4th', start: '11:30', end: '12:20' },
  { number: 5, label: '5th', start: '13:40', end: '14:30' },
  { number: 6, label: '6th', start: '14:40', end: '15:30' },
  { number: 7, label: '7th', start: '15:40', end: '16:30' },
  { number: 8, label: '8th', start: '16:40', end: '17:30' },
]

export const MODULES = ['D1', 'D2', 'D3', 'K', 'L', 'M', 'N', 'G', 'H', 'P', 'S']

export const DEFAULT_MODULE_COLORS = {
  D1: '#1f6f78',
  D2: '#2e8b57',
  D3: '#f28f3b',
  K: '#c8553d',
  L: '#5b4b8a',
  M: '#8f5e2e',
  N: '#3f7cac',
  G: '#768948',
  H: '#c06c84',
  P: '#2d3047',
  S: '#7c5cfc',
}

export const STORAGE_KEYS = {
  base: 'baseTimetable',
  overrides: 'overrides',
  colors: 'moduleColors',
  details: 'moduleDetails',
}

export const SCHEDULE_BLOCKS = [
  { type: 'period', periodIndex: 0, start: '08:30', end: '09:20' },
  { type: 'break', start: '09:20', end: '09:30', label: 'Break' },
  { type: 'period', periodIndex: 1, start: '09:30', end: '10:20' },
  { type: 'break', start: '10:20', end: '10:30', label: 'Break' },
  { type: 'period', periodIndex: 2, start: '10:30', end: '11:20' },
  { type: 'break', start: '11:20', end: '11:30', label: 'Break' },
  { type: 'period', periodIndex: 3, start: '11:30', end: '12:20' },
  { type: 'buffer', start: '12:20', end: '12:30', label: 'Buffer' },
  { type: 'lunch', start: '12:30', end: '13:30', label: 'Lunch' },
  { type: 'break', start: '13:30', end: '13:40', label: 'Break' },
  { type: 'period', periodIndex: 4, start: '13:40', end: '14:30' },
  { type: 'break', start: '14:30', end: '14:40', label: 'Break' },
  { type: 'period', periodIndex: 5, start: '14:40', end: '15:30' },
  { type: 'break', start: '15:30', end: '15:40', label: 'Break' },
  { type: 'period', periodIndex: 6, start: '15:40', end: '16:30' },
  { type: 'break', start: '16:30', end: '16:40', label: 'Break' },
  { type: 'period', periodIndex: 7, start: '16:40', end: '17:30' },
]

export function createEmptyTimetable() {
  return Object.fromEntries(DAYS.map((day) => [day.key, Array(PERIODS.length).fill(null)]))
}

export function createDefaultModuleDetails() {
  return Object.fromEntries(
    MODULES.map((module) => [
      module,
      {
        subject: '',
        teacher: '',
        room: '',
      },
    ]),
  )
}

export function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function dateFromKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

export function getPeriodKey(periodIndex) {
  return String(periodIndex + 1)
}

export function isHexColor(value) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
}

export function cleanLabel(value) {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export function normalizeBaseTimetable(value) {
  const fallback = createEmptyTimetable()

  if (!value || typeof value !== 'object') {
    return fallback
  }

  DAYS.forEach((day) => {
    const source = Array.isArray(value[day.key]) ? value[day.key] : []
    fallback[day.key] = PERIODS.map((_, periodIndex) => cleanLabel(source[periodIndex]))
  })

  return fallback
}

export function normalizeOverrides(value) {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const normalized = {}

  Object.entries(value).forEach(([dateKey, periods]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !periods || typeof periods !== 'object') {
      return
    }

    const nextPeriods = {}

    Object.entries(periods).forEach(([periodKey, label]) => {
      const periodNumber = Number(periodKey)

      if (Number.isInteger(periodNumber) && periodNumber >= 1 && periodNumber <= PERIODS.length) {
        const cleaned = cleanLabel(label)
        if (cleaned) {
          nextPeriods[String(periodNumber)] = cleaned
        }
      }
    })

    if (Object.keys(nextPeriods).length > 0) {
      normalized[dateKey] = nextPeriods
    }
  })

  return normalized
}

export function normalizeModuleColors(value) {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_MODULE_COLORS }
  }

  const normalized = { ...DEFAULT_MODULE_COLORS }

  MODULES.forEach((module) => {
    if (isHexColor(value[module])) {
      normalized[module] = value[module]
    }
  })

  return normalized
}

export function normalizeModuleDetails(value) {
  const fallback = createDefaultModuleDetails()

  if (!value || typeof value !== 'object') {
    return fallback
  }

  MODULES.forEach((module) => {
    const source = value[module]

    if (source && typeof source === 'object') {
      fallback[module] = {
        subject: cleanLabel(source.subject) ?? '',
        teacher: cleanLabel(source.teacher) ?? '',
        room: cleanLabel(source.room) ?? '',
      }
    }
  })

  return fallback
}

export function loadStoredValue(key, normalize, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return fallback
    }

    return normalize(JSON.parse(raw))
  } catch {
    return fallback
  }
}

export function saveStoredValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function parseTime(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function getMinutesFromDate(date) {
  return date.getHours() * 60 + date.getMinutes()
}

export function getSecondsUntil(time, date) {
  return parseTime(time) * 60 - (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds())
}

export function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) {
    return '0m'
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`
  }

  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

export function getDayKey(date) {
  const dayIndex = date.getDay()
  return DAYS[dayIndex - 1]?.key ?? null
}

export function getWeekDates(anchorDate) {
  const weekStart = new Date(anchorDate)
  const dayOfWeek = weekStart.getDay()
  const shift = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  weekStart.setDate(weekStart.getDate() + shift)
  weekStart.setHours(12, 0, 0, 0)

  return DAYS.map((_, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)
    return date
  })
}

export function shiftDate(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function getDayIndex(dayKey) {
  return DAYS.findIndex((day) => day.key === dayKey)
}

export function formatWeekRange(weekDates) {
  const start = weekDates[0]
  const end = weekDates[weekDates.length - 1]
  const sameMonth = start.getMonth() === end.getMonth()
  const startLabel = start.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
  const endLabel = end.toLocaleDateString(undefined, {
    month: sameMonth ? undefined : 'short',
    day: 'numeric',
  })

  return `${startLabel} - ${endLabel}`
}

export function formatDateLabel(dateKey, options) {
  return dateFromKey(dateKey).toLocaleDateString(undefined, options)
}

export function isModuleLabel(label) {
  return MODULES.includes(label)
}

export function getOverrideValue(overrides, dateKey, periodIndex) {
  return overrides[dateKey]?.[getPeriodKey(periodIndex)] ?? null
}

export function getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, periodIndex) {
  const override = getOverrideValue(overrides, dateKey, periodIndex)
  if (override) {
    return override
  }

  return baseTimetable[dayKey]?.[periodIndex] ?? null
}

export function getContrastColor(hexColor) {
  const value = hexColor.replace('#', '')
  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000
  return luminance >= 150 ? '#142221' : '#f8f6ef'
}

export function getModulePalette(label, moduleColors) {
  if (!label) {
    return {
      background: '#f4efe6',
      border: '#d9ceb9',
      text: '#62594c',
    }
  }

  if (!isModuleLabel(label)) {
    return {
      background: '#f7ddc9',
      border: '#df9b68',
      text: '#5f3717',
    }
  }

  const color = moduleColors[label] ?? DEFAULT_MODULE_COLORS[label]

  return {
    background: `${color}20`,
    border: `${color}99`,
    text: getContrastColor(color),
  }
}

export function buildModuleSubtitle(details) {
  const parts = [details.room, details.teacher].filter(Boolean)
  return parts.length > 0 ? parts.join(' 쨌 ') : null
}

export function getLabelPresentation(label, moduleDetails) {
  if (!label) {
    return {
      title: 'Unassigned',
      subtitle: null,
      isModule: false,
    }
  }

  if (!isModuleLabel(label)) {
    return {
      title: label,
      subtitle: 'Custom override',
      isModule: false,
    }
  }

  const details = moduleDetails[label] ?? createDefaultModuleDetails()[label]
  return {
    title: details.subject || label,
    subtitle: buildModuleSubtitle(details),
    isModule: true,
    moduleCode: label,
  }
}

export function getCurrentPeriodIndex(date) {
  const minutes = getMinutesFromDate(date)
  const activePeriod = PERIODS.findIndex((period) => {
    return minutes >= parseTime(period.start) && minutes < parseTime(period.end)
  })

  return activePeriod >= 0 ? activePeriod : null
}

export function getSchoolDateLabel(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function getNextSchoolDate(date) {
  const next = new Date(date)
  next.setHours(12, 0, 0, 0)

  do {
    next.setDate(next.getDate() + 1)
  } while (!getDayKey(next))

  return next
}

export function getSuggestedOverrideDate(date) {
  return getDayKey(date) ? date : getNextSchoolDate(date)
}

export function getStatusCard(now, baseTimetable, overrides, moduleDetails) {
  const dayKey = getDayKey(now)

  if (!dayKey) {
    const nextSchoolDate = getNextSchoolDate(now)
    return {
      eyebrow: 'Weekend',
      headline: 'No classes right now',
      detail: `Next school day: ${getSchoolDateLabel(nextSchoolDate)}`,
      accent: 'rest',
    }
  }

  const dateKey = getDateKey(now)
  const minutes = getMinutesFromDate(now)
  const currentBlock = SCHEDULE_BLOCKS.find((block) => {
    return minutes >= parseTime(block.start) && minutes < parseTime(block.end)
  })
  const nextBlock = SCHEDULE_BLOCKS.find((block) => minutes < parseTime(block.start))

  if (currentBlock?.type === 'period') {
    const label = getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, currentBlock.periodIndex)
    const presentation = getLabelPresentation(label, moduleDetails)
    return {
      eyebrow: 'Now',
      headline: presentation.title,
      detail: `${PERIODS[currentBlock.periodIndex].label} ends in ${formatCountdown(getSecondsUntil(currentBlock.end, now))}`,
      accent: 'live',
    }
  }

  if (currentBlock?.type === 'lunch') {
    const nextLabel = getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, 4)
    const presentation = getLabelPresentation(nextLabel, moduleDetails)
    return {
      eyebrow: 'Lunch',
      headline: 'Midday reset',
      detail: `Next: ${presentation.title} at ${PERIODS[4].start}`,
      accent: 'rest',
    }
  }

  if (currentBlock) {
    const upcomingPeriod = nextBlock?.type === 'period' ? nextBlock.periodIndex : null
    const nextLabel = upcomingPeriod === null
      ? null
      : getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, upcomingPeriod)
    const presentation = getLabelPresentation(nextLabel, moduleDetails)

    return {
      eyebrow: currentBlock.label,
      headline: upcomingPeriod === null ? 'Between sessions' : `Next: ${presentation.title}`,
      detail: upcomingPeriod === null
        ? 'No more periods left today'
        : `${PERIODS[upcomingPeriod].label} starts in ${formatCountdown(getSecondsUntil(nextBlock.start, now))}`,
      accent: 'rest',
    }
  }

  if (nextBlock?.type === 'period') {
    const nextLabel = getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, nextBlock.periodIndex)
    const presentation = getLabelPresentation(nextLabel, moduleDetails)
    return {
      eyebrow: 'Up next',
      headline: presentation.title,
      detail: `${PERIODS[nextBlock.periodIndex].label} starts in ${formatCountdown(getSecondsUntil(nextBlock.start, now))}`,
      accent: 'rest',
    }
  }

  const nextSchoolDate = getNextSchoolDate(now)
  const nextSchoolDayKey = getDayKey(nextSchoolDate)
  const nextSchoolDateKey = getDateKey(nextSchoolDate)
  const firstLabel = getEffectiveLabel(baseTimetable, overrides, nextSchoolDayKey, nextSchoolDateKey, 0)
  const presentation = getLabelPresentation(firstLabel, moduleDetails)

  return {
    eyebrow: 'Done for today',
    headline: 'School day complete',
    detail: `Next: ${presentation.title} on ${getSchoolDateLabel(nextSchoolDate)}`,
    accent: 'rest',
  }
}

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

export const DEFAULT_MODULE_DEFINITIONS = [
  { code: 'D1', color: '#1f6f78', subject: '', teacher: '', room: '' },
  { code: 'D2', color: '#2e8b57', subject: '', teacher: '', room: '' },
  { code: 'D3', color: '#f28f3b', subject: '', teacher: '', room: '' },
  { code: 'K', color: '#c8553d', subject: '', teacher: '', room: '' },
  { code: 'L', color: '#5b4b8a', subject: '', teacher: '', room: '' },
  { code: 'M', color: '#8f5e2e', subject: '', teacher: '', room: '' },
  { code: 'N', color: '#3f7cac', subject: '', teacher: '', room: '' },
  { code: 'G', color: '#768948', subject: '', teacher: '', room: '' },
  { code: 'H', color: '#c06c84', subject: '', teacher: '', room: '' },
  { code: 'P', color: '#2d3047', subject: '', teacher: '', room: '' },
  { code: 'S', color: '#7c5cfc', subject: '', teacher: '', room: '' },
]

export const STORAGE_KEYS = {
  base: 'baseTimetable',
  overrides: 'overrides',
  modules: 'moduleDefinitions',
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

export function createDefaultModuleDefinitions() {
  return DEFAULT_MODULE_DEFINITIONS.map((module) => ({ ...module }))
}

export function createDefaultModuleDetails() {
  return Object.fromEntries(
    createDefaultModuleDefinitions().map((module) => [
      module.code,
      {
        subject: module.subject,
        teacher: module.teacher,
        room: module.room,
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

export function cleanModuleCode(value) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toUpperCase().replace(/\s+/g, '')
  return normalized ? normalized : null
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
    return Object.fromEntries(
      createDefaultModuleDefinitions().map((module) => [module.code, module.color]),
    )
  }

  const normalized = Object.fromEntries(
    createDefaultModuleDefinitions().map((module) => [module.code, module.color]),
  )

  Object.keys(normalized).forEach((moduleCode) => {
    if (isHexColor(value[moduleCode])) {
      normalized[moduleCode] = value[moduleCode]
    }
  })

  return normalized
}

export function normalizeModuleDetails(value) {
  const fallback = createDefaultModuleDetails()

  if (!value || typeof value !== 'object') {
    return fallback
  }

  Object.keys(fallback).forEach((moduleCode) => {
    const source = value[moduleCode]

    if (source && typeof source === 'object') {
      fallback[moduleCode] = {
        subject: cleanLabel(source.subject) ?? '',
        teacher: cleanLabel(source.teacher) ?? '',
        room: cleanLabel(source.room) ?? '',
      }
    }
  })

  return fallback
}

export function normalizeModuleDefinitions(value, legacyColors = {}, legacyDetails = {}) {
  const fallback = createDefaultModuleDefinitions().map((module) => ({
    ...module,
    color: legacyColors[module.code] ?? module.color,
    subject: legacyDetails[module.code]?.subject ?? module.subject,
    teacher: legacyDetails[module.code]?.teacher ?? module.teacher,
    room: legacyDetails[module.code]?.room ?? module.room,
  }))

  if (!Array.isArray(value)) {
    return fallback
  }

  const seen = new Set()
  const normalized = value
    .map((module, index) => {
      if (!module || typeof module !== 'object') {
        return null
      }

      const code = cleanModuleCode(module.code)
      if (!code || seen.has(code)) {
        return null
      }

      seen.add(code)
      const fallbackColor = fallback[index]?.color ?? '#3f7cac'

      return {
        code,
        color: isHexColor(module.color) ? module.color : fallbackColor,
        subject: cleanLabel(module.subject) ?? '',
        teacher: cleanLabel(module.teacher) ?? '',
        room: cleanLabel(module.room) ?? '',
      }
    })
    .filter(Boolean)

  return normalized.length > 0 ? normalized : fallback
}

export function buildModuleMaps(moduleDefinitions) {
  const moduleColors = {}
  const moduleDetails = {}
  const moduleCodeSet = new Set()

  moduleDefinitions.forEach((module) => {
    moduleCodeSet.add(module.code)
    moduleColors[module.code] = module.color
    moduleDetails[module.code] = {
      subject: module.subject,
      teacher: module.teacher,
      room: module.room,
    }
  })

  return {
    moduleColors,
    moduleDetails,
    moduleCodeSet,
  }
}

export function createModuleDefinition(code, color = '#3f7cac') {
  return {
    code,
    color,
    subject: '',
    teacher: '',
    room: '',
  }
}

export function getNextModuleCode(moduleDefinitions) {
  const existingCodes = new Set(moduleDefinitions.map((module) => module.code))
  let index = 1

  while (existingCodes.has(`M${index}`)) {
    index += 1
  }

  return `M${index}`
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

export function isModuleLabel(label, moduleCodeSet) {
  return typeof label === 'string' && moduleCodeSet.has(label)
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

export function getContrastColor() {
  return '#142221'
}

export function getModulePalette(label, moduleColors, moduleCodeSet) {
  if (!label) {
    return {
      background: '#f4efe6',
      border: '#d9ceb9',
      text: '#62594c',
    }
  }

  if (!isModuleLabel(label, moduleCodeSet)) {
    return {
      background: '#f7ddc9',
      border: '#df9b68',
      text: '#5f3717',
    }
  }

  const color = moduleColors[label] ?? '#3f7cac'

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

export function getLabelPresentation(label, moduleDetails, moduleCodeSet) {
  if (!label) {
    return {
      title: 'Unassigned',
      subtitle: null,
      isModule: false,
    }
  }

  if (!isModuleLabel(label, moduleCodeSet)) {
    return {
      title: label,
      subtitle: 'Custom override',
      isModule: false,
    }
  }

  const details = moduleDetails[label] ?? { subject: '', teacher: '', room: '' }
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

export function getStatusCard(now, baseTimetable, overrides, moduleDetails, moduleCodeSet) {
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
    const presentation = getLabelPresentation(label, moduleDetails, moduleCodeSet)
    return {
      eyebrow: 'Now',
      headline: presentation.title,
      detail: `${PERIODS[currentBlock.periodIndex].label} ends in ${formatCountdown(getSecondsUntil(currentBlock.end, now))}`,
      accent: 'live',
    }
  }

  if (currentBlock?.type === 'lunch') {
    const nextLabel = getEffectiveLabel(baseTimetable, overrides, dayKey, dateKey, 4)
    const presentation = getLabelPresentation(nextLabel, moduleDetails, moduleCodeSet)
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
    const presentation = getLabelPresentation(nextLabel, moduleDetails, moduleCodeSet)

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
    const presentation = getLabelPresentation(nextLabel, moduleDetails, moduleCodeSet)
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
  const presentation = getLabelPresentation(firstLabel, moduleDetails, moduleCodeSet)

  return {
    eyebrow: 'Done for today',
    headline: 'School day complete',
    detail: `Next: ${presentation.title} on ${getSchoolDateLabel(nextSchoolDate)}`,
    accent: 'rest',
  }
}

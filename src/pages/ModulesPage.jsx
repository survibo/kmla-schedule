import { useState } from 'react'

function isModuleUsed(moduleCode, baseTimetable, overrides) {
  const usedInBase = Object.values(baseTimetable).some((periods) =>
    periods.some((label) => label === moduleCode),
  )

  if (usedInBase) {
    return true
  }

  return Object.values(overrides).some((dayOverrides) =>
    Object.values(dayOverrides).some((label) => label === moduleCode),
  )
}

function ModuleCard({ module, onRename, onUpdate, onRemove }) {
  const [codeDraft, setCodeDraft] = useState(module.code)

  function commitCodeChange() {
    const renamed = onRename(module.code, codeDraft)

    if (!renamed) {
      setCodeDraft(module.code)
    }
  }

  return (
    <article className="grid gap-4 rounded-[1.15rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.94)] p-4 shadow-[0_0.6rem_1.4rem_rgba(24,49,47,0.06)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <label className="grid gap-1.5">
          <span className="text-[0.88rem] font-bold text-[var(--muted)]">Code</span>
          <input
            type="text"
            value={codeDraft}
            className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
            onChange={(event) => setCodeDraft(event.target.value)}
            onBlur={commitCodeChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                commitCodeChange()
              }
            }}
          />
        </label>

        <button
          type="button"
          className="cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
          onClick={() => onRemove(module.code)}
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]">
        <label className="grid gap-1.5">
          <span className="text-[0.88rem] font-bold text-[var(--muted)]">Subject</span>
          <input
            type="text"
            value={module.subject}
            className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
            onChange={(event) => onUpdate(module.code, { subject: event.target.value })}
            placeholder="Subject name"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-[0.88rem] font-bold text-[var(--muted)]">Color</span>
          <input
            type="color"
            value={module.color}
            className="h-[3.35rem] w-full cursor-pointer rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] p-2"
            onChange={(event) => onUpdate(module.code, { color: event.target.value })}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[0.88rem] font-bold text-[var(--muted)]">Teacher</span>
          <input
            type="text"
            value={module.teacher}
            className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
            onChange={(event) => onUpdate(module.code, { teacher: event.target.value })}
            placeholder="Teacher"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-[0.88rem] font-bold text-[var(--muted)]">Room</span>
          <input
            type="text"
            value={module.room}
            className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
            onChange={(event) => onUpdate(module.code, { room: event.target.value })}
            placeholder="Room"
          />
        </label>
      </div>
    </article>
  )
}

export function ModulesPage({
  addModule,
  baseTimetable,
  moduleDefinitions,
  overrides,
  removeModule,
  renameModule,
  updateModule,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasModules = moduleDefinitions.length > 0
  const lastIndex = Math.max(0, moduleDefinitions.length - 1)
  const currentIndex = Math.min(activeIndex, lastIndex)

  function handleAddModule() {
    addModule()
    setActiveIndex(moduleDefinitions.length)
  }

  function handleRemoveModule(moduleCode) {
    const removedIndex = moduleDefinitions.findIndex((module) => module.code === moduleCode)

    if (isModuleUsed(moduleCode, baseTimetable, overrides)) {
      const confirmed = window.confirm(
        'This module is already used in the schedule or overrides.\nDeleting it will convert those cells to plain text.\nDelete anyway?',
      )

      if (!confirmed) {
        return
      }
    }

    removeModule(moduleCode)
    setActiveIndex((current) => {
      if (removedIndex < 0) {
        return current
      }

      return Math.max(0, Math.min(current, moduleDefinitions.length - 2))
    })
  }

  return (
    <section className="grid gap-4 rounded-[1.2rem] bg-[rgba(255,250,240,0.86)] p-4">
      <div className="flex flex-col gap-3 min-[900px]:flex-row min-[900px]:items-start min-[900px]:justify-between">
        <div className="grid flex-1 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {hasModules ? (
              moduleDefinitions.map((module, index) => (
                <button
                  key={module.code}
                  type="button"
                  className={[
                    'min-h-[1rem] min-w-[5rem] cursor-pointer justify-center rounded-[0.5rem] border p-2 text-left transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]',
                    index === currentIndex
                      ? 'border-[rgba(31,111,120,0.3)] bg-[rgba(31,111,120,0.16)]'
                      : 'border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.92)]',
                  ].join(' ')}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="block text-sm font-bold text-[var(--ink)]">
                    {module.code}
                    {module.subject ? ` - ${module.subject}` : ''}
                  </span>
                  <span className="mt-1 block text-[0.82rem] text-[var(--muted)]">
                    {module.teacher || 'Teacher not set'}
                  </span>
                </button>
              ))
            ) : (
              <div className="rounded-[1rem] border border-dashed border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.7)] px-4 py-5 text-sm text-[var(--muted)]">
                No modules yet
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-full border border-[rgba(31,111,120,0.32)] bg-[rgba(31,111,120,0.18)] px-4 py-[0.7rem] text-sm font-semibold text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
          onClick={handleAddModule}
        >
          Add module
        </button>
      </div>

      {hasModules ? (
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] disabled:cursor-default disabled:opacity-40"
              onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
              disabled={currentIndex === 0}
            >
              Prev
            </button>

            <span className="text-sm font-semibold text-[var(--muted)]">
              {currentIndex + 1} / {moduleDefinitions.length}
            </span>

            <button
              type="button"
              className="cursor-pointer rounded-full border border-[rgba(20,34,33,0.12)] bg-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] disabled:cursor-default disabled:opacity-40"
              onClick={() => setActiveIndex((current) => Math.min(lastIndex, current + 1))}
              disabled={currentIndex === lastIndex}
            >
              Next
            </button>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {moduleDefinitions.map((module) => (
                <div key={module.code} className="w-full shrink-0">
                  <ModuleCard
                    module={module}
                    onRename={renameModule}
                    onUpdate={updateModule}
                    onRemove={handleRemoveModule}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {moduleDefinitions.map((module, index) => (
              <button
                key={module.code}
                type="button"
                className={[
                  'h-2.5 w-2.5 rounded-full',
                  index === currentIndex ? 'bg-[var(--accent)]' : 'bg-[rgba(20,34,33,0.14)]',
                ].join(' ')}
                onClick={() => setActiveIndex(index)}
                aria-label={`${module.code} slide`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

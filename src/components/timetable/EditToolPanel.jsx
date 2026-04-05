import {
  MODULES,
} from '../../features/timetable/timetableShared.js'

export function EditToolPanel({
  editorPanel,
  setEditorPanel,
  moduleColors,
  setModuleColors,
  moduleDetails,
  setModuleDetails,
}) {
  function renderColorEditor() {
    return (
      <div className="grid gap-4">
        <div className="grid content-center gap-2">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            Module colors
          </p>
          <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
            Make subjects easier to scan
          </h3>
          <p className="text-[var(--muted)]">
            Pick stronger colors so each block is recognizable with a quick glance.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-3">
          {MODULES.map((module) => (
            <label
              key={module}
              className="grid gap-1.5 rounded-[1rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.94)] p-[0.7rem_0.8rem]"
            >
              <span className="text-[0.88rem] font-bold text-[var(--muted)]">{module}</span>
              <input
                type="color"
                className="h-10 w-full cursor-pointer border-none bg-transparent p-0"
                value={moduleColors[module]}
                onChange={(event) =>
                  setModuleColors((current) => ({
                    ...current,
                    [module]: event.target.value,
                  }))
                }
              />
            </label>
          ))}
        </div>
      </div>
    )
  }

  function renderModuleDetailsEditor() {
    return (
      <div className="grid gap-4">
        <div className="grid content-center gap-2">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            Module details
          </p>
          <h3 className="font-serif text-[1.15rem] leading-[1.05] text-[var(--ink)]">
            Use real subject names
          </h3>
          <p className="text-[var(--muted)]">
            Adding subject, room, and teacher makes the timetable readable without decoding codes.
          </p>
        </div>

        <div className="grid gap-4">
          {MODULES.map((module) => (
            <div
              key={module}
              className="grid gap-3 rounded-[1rem] border border-[rgba(20,34,33,0.08)] bg-[rgba(255,252,246,0.94)] p-[0.9rem]"
            >
              <div className="flex items-center gap-[0.6rem] text-[var(--ink)]">
                <span
                  className="size-[0.9rem] rounded-full shadow-[inset_0_0_0_2px_rgba(255,248,238,0.8)]"
                  style={{ backgroundColor: moduleColors[module] }}
                />
                <strong>{module}</strong>
              </div>

              <label className="grid gap-1.5">
                <span className="text-[0.88rem] font-bold text-[var(--muted)]">Subject</span>
                <input
                  type="text"
                  className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
                  value={moduleDetails[module].subject}
                  onChange={(event) =>
                    setModuleDetails((current) => ({
                      ...current,
                      [module]: {
                        ...current[module],
                        subject: event.target.value,
                      },
                    }))
                  }
                  placeholder={`${module} subject`}
                />
              </label>

              <div className="grid gap-3">
                <label className="grid gap-1.5">
                  <span className="text-[0.88rem] font-bold text-[var(--muted)]">Room</span>
                  <input
                    type="text"
                    className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
                    value={moduleDetails[module].room}
                    onChange={(event) =>
                      setModuleDetails((current) => ({
                        ...current,
                        [module]: {
                          ...current[module],
                          room: event.target.value,
                        },
                      }))
                    }
                    placeholder="Room"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[0.88rem] font-bold text-[var(--muted)]">Teacher</span>
                  <input
                    type="text"
                    className="w-full rounded-[0.95rem] border border-[rgba(20,34,33,0.14)] bg-[rgba(255,252,246,0.94)] px-4 py-[0.85rem] text-[var(--ink)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)]"
                    value={moduleDetails[module].teacher}
                    onChange={(event) =>
                      setModuleDetails((current) => ({
                        ...current,
                        [module]: {
                          ...current[module],
                          teacher: event.target.value,
                        },
                      }))
                    }
                    placeholder="Teacher"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const panelTitle = editorPanel === 'colors' ? 'Colors' : 'Subjects'

  return (
    <section className="grid gap-4 rounded-[1.2rem] bg-[rgba(255,250,240,0.86)] p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            Editor settings
          </p>
          <h2 className="font-serif text-[clamp(1.45rem,3vw,2rem)] leading-[1.05] text-[var(--ink)]">
            {panelTitle}
          </h2>
        </div>
      </div>

      <div
        className="grid w-full grid-cols-2 gap-1 rounded-full bg-[rgba(20,34,33,0.08)] p-1"
        role="tablist"
        aria-label="Editor settings"
      >
        <button
          type="button"
          className={[
            'cursor-pointer rounded-full border border-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px',
            editorPanel === 'subjects'
              ? 'border-[rgba(31,111,120,0.3)] bg-[rgba(31,111,120,0.16)] text-[var(--ink)]'
              : '',
          ].join(' ')}
          onClick={() => setEditorPanel('subjects')}
        >
          Subjects
        </button>
        <button
          type="button"
          className={[
            'cursor-pointer rounded-full border border-transparent px-4 py-[0.7rem] text-sm font-semibold text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,111,120,0.45)] transition duration-150 ease-out hover:-translate-y-px',
            editorPanel === 'colors'
              ? 'border-[rgba(31,111,120,0.3)] bg-[rgba(31,111,120,0.16)] text-[var(--ink)]'
              : '',
          ].join(' ')}
          onClick={() => setEditorPanel('colors')}
        >
          Colors
        </button>
      </div>

      {editorPanel === 'colors' ? renderColorEditor() : renderModuleDetailsEditor()}
    </section>
  )
}

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
      <div className="editor-tool-content">
        <div className="editor-placeholder compact">
          <p className="eyebrow">Module colors</p>
          <h3>Make subjects easier to scan</h3>
          <p>Pick stronger colors so each block is recognizable with a quick glance.</p>
        </div>

        <div className="color-grid">
          {MODULES.map((module) => (
            <label key={module} className="color-row">
              <span>{module}</span>
              <input
                type="color"
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
      <div className="editor-tool-content">
        <div className="editor-placeholder compact">
          <p className="eyebrow">Module details</p>
          <h3>Use real subject names</h3>
          <p>Adding subject, room, and teacher makes the timetable readable without decoding codes.</p>
        </div>

        <div className="module-details-list">
          {MODULES.map((module) => (
            <div key={module} className="module-detail-card">
              <div className="module-detail-header">
                <span
                  className="module-detail-swatch"
                  style={{ backgroundColor: moduleColors[module] }}
                />
                <strong>{module}</strong>
              </div>

              <label className="custom-field">
                <span>Subject</span>
                <input
                  type="text"
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

              <div className="module-detail-fields">
                <label className="custom-field">
                  <span>Room</span>
                  <input
                    type="text"
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

                <label className="custom-field">
                  <span>Teacher</span>
                  <input
                    type="text"
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
    <section className="panel">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">Editor settings</p>
          <h2>{panelTitle}</h2>
        </div>
      </div>

      <div className="segmented-control editor-panel-switcher" role="tablist" aria-label="Editor settings">
        <button
          type="button"
          className={editorPanel === 'subjects' ? 'active' : ''}
          onClick={() => setEditorPanel('subjects')}
        >
          Subjects
        </button>
        <button
          type="button"
          className={editorPanel === 'colors' ? 'active' : ''}
          onClick={() => setEditorPanel('colors')}
        >
          Colors
        </button>
      </div>

      {editorPanel === 'colors' ? renderColorEditor() : renderModuleDetailsEditor()}
    </section>
  )
}

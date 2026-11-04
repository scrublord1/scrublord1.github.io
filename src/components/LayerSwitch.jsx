const LAYERS = [
  { id: 'projects', code: 'F.Cu', label: 'Projects', color: 'var(--color-cyan-glow)' },
  { id: 'skills', code: 'In1.Cu', label: 'Signal Chain', color: 'var(--color-emerald-glow)' },
]

export default function LayerSwitch({ compact, skillsOpen, onShowProjects, onShowSkills }) {
  return (
    <div role="group" aria-label="Board layers" className="flex h-full flex-col justify-end">
      {!compact && <p className="silk mb-1.5 font-mono text-[11px] tracking-[0.12em] uppercase">Layers (press L)</p>}
      <div className="grid flex-1 grid-cols-2 gap-2">
        {LAYERS.map((layer) => {
          const active = (layer.id === 'skills') === skillsOpen
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={active}
              onClick={layer.id === 'skills' ? onShowSkills : onShowProjects}
              style={{ '--layer': layer.color }}
              className={`flex items-center gap-2 border px-2.5 text-left transition-colors ${
                active ? 'border-[var(--layer)] bg-[#0b0f19]' : 'border-[#33435e] bg-[#0b0f19]/70 hover:border-[var(--layer)]'
              }`}
            >
              <span aria-hidden="true" className="h-3 w-3 shrink-0 bg-[var(--layer)]" />
              <span className="min-w-0">
                <span className="block font-mono text-[10.5px] leading-tight text-slate-400">{layer.code}</span>
                <span className="block truncate text-[13px] leading-tight font-medium text-white">{layer.label}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

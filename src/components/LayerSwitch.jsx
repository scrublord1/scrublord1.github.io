const LAYERS = [
  { id: 'projects', code: 'F.Cu', label: 'Projects', color: 'var(--color-cyan-glow)' },
  { id: 'skills', code: 'In1.Cu', label: 'Signal Chain', color: 'var(--color-emerald-glow)' },
  { id: 'experience', code: 'F.Silk', label: 'Experience', color: 'var(--color-amber-glow)' },
]

export default function LayerSwitch({ compact, activeLayer, onSelect }) {
  return (
    <div role="group" aria-label="Board layers" className="flex h-full flex-col justify-end">
      {!compact && <p className="silk mb-1.5 font-mono text-[11px] tracking-[0.12em] uppercase">Layers (press L)</p>}
      <div className="grid flex-1 grid-cols-3 gap-2">
        {LAYERS.map((layer) => {
          const active = layer.id === activeLayer
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(layer.id)}
              style={{ '--layer': layer.color }}
              className={`flex min-w-0 items-center gap-1.5 border px-2 text-left transition-colors ${
                active ? 'border-[var(--layer)] bg-[#0b0f19]' : 'border-[#33435e] bg-[#0b0f19]/70 hover:border-[var(--layer)]'
              }`}
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 bg-[var(--layer)]" />
              <span className="min-w-0">
                <span className="block font-mono text-[10px] leading-tight text-slate-400">{layer.code}</span>
                <span className="block truncate text-[12.5px] leading-tight font-medium text-white">{layer.label}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

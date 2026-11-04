export default function Chip({ project, refdes, index, compact, dimmed, onOpen, onHover }) {
  const metric = project.metrics[0]

  return (
    <button
      id={`chip-${project.id}`}
      type="button"
      onClick={onOpen}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(project.id)}
      onBlur={() => onHover(null)}
      aria-label={`Open ${project.title}, ${project.subtitle}`}
      style={{ animationDelay: `${0.35 + index * 0.07}s` }}
      className={`chip group animate-chip-seat absolute inset-0 text-left transition-opacity ${dimmed ? 'opacity-30' : ''}`}
    >
      <span aria-hidden="true" className="chip-leads chip-leads-top" />
      <span aria-hidden="true" className="chip-leads chip-leads-bottom" />
      <span aria-hidden="true" className="chip-leads chip-leads-left" />
      <span aria-hidden="true" className="chip-leads chip-leads-right" />

      <span className={`chip-body flex h-full flex-col ${compact ? 'p-2.5' : 'p-3'}`}>
        <span className="flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            {refdes}
          </span>
          <span className="led animate-led" />
        </span>

        <span className={`mt-auto block font-semibold tracking-tight text-[#dbe3ee] group-hover:text-white ${compact ? 'text-[15px]' : 'text-[18px] leading-tight'}`}>
          {project.title}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-400">{project.pinout.chip}</span>

        {!compact && (
          <span className="mt-1 block text-[12px] leading-snug text-slate-400">{project.subtitle}</span>
        )}

        <span className={`block font-mono text-cyan-glow ${compact ? 'mt-1 truncate text-[12px]' : 'mt-2 text-[13px]'}`}>
          {metric.value} {metric.unit}
          <span className={`truncate text-slate-500 ${compact ? '' : 'block text-[12px]'}`}> {metric.label.toLowerCase()}</span>
        </span>
      </span>
    </button>
  )
}

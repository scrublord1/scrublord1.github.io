// The longest metric line that fits on a chip without being cut off.
const MAX_METRIC_CHARS = 17

export default function Chip({ project, refdes, index, dimmed, onOpen, onHover }) {
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
      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
      className={`chip group animate-chip-seat absolute inset-0 text-left transition-opacity ${dimmed ? 'opacity-30' : ''}`}
    >
      <span aria-hidden="true" className="chip-leads chip-leads-top" />
      <span aria-hidden="true" className="chip-leads chip-leads-bottom" />
      <span aria-hidden="true" className="chip-leads chip-leads-left" />
      <span aria-hidden="true" className="chip-leads chip-leads-right" />

      <span className="chip-body flex h-full flex-col p-2.5">
        <span className="flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            {refdes}
          </span>
          <span className="led animate-led" />
        </span>

        <span className="mt-auto block truncate text-[15px] leading-tight font-semibold tracking-tight text-[#dbe3ee] group-hover:text-white">
          {project.title}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-400">{project.pinout.chip}</span>
        <span className="mt-1 block truncate font-mono text-[12px] text-cyan-glow">
          {metric.value} {metric.unit}
          {`${metric.value} ${metric.unit} ${metric.label}`.length <= MAX_METRIC_CHARS && (
            <span className="text-slate-500"> {metric.label.toLowerCase()}</span>
          )}
        </span>
      </span>
    </button>
  )
}

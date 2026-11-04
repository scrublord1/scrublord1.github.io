import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { projects, signalChain } from '../data/projects'
import { chamfer } from '../lib/traces'

const { stages, links } = signalChain
const allSkills = stages.flatMap((stage) => stage.skills)

/* Follows the wires both ways, so a node lights its whole path through the chain. */
function traceSignal(startId) {
  const nodes = new Set([startId])
  const wires = new Set()

  const walk = (id, from, to) => {
    links.forEach((link, index) => {
      if (link[from] !== id) return
      wires.add(index)
      nodes.add(link[to])
      walk(link[to], from, to)
    })
  }
  walk(startId, 0, 1)
  walk(startId, 1, 0)

  return { nodes, wires }
}

function buildWires(container) {
  const box = container.getBoundingClientRect()
  const panels = [...container.querySelectorAll('[data-stage]')].map((panel) => panel.getBoundingClientRect())
  const stacked = panels[1].top >= panels[0].bottom - 1

  const rectOf = (id) => {
    const rect = container.querySelector(`[data-skill="${id}"]`).getBoundingClientRect()
    return {
      left: rect.left - box.left,
      right: rect.right - box.left,
      top: rect.top - box.top,
      bottom: rect.bottom - box.top,
      centerX: rect.left + rect.width / 2 - box.left,
      centerY: rect.top + rect.height / 2 - box.top,
    }
  }

  // A small lane offset keeps parallel routes from sitting on top of each other.
  const paths = links.map(([from, to], index) => {
    const a = rectOf(from)
    const b = rectOf(to)
    const lane = ((index % 5) - 2) * 6
    if (stacked) {
      const midY = (a.bottom + b.top) / 2 + lane
      return chamfer([[a.centerX, a.bottom], [a.centerX, midY], [b.centerX, midY], [b.centerX, b.top]], 7)
    }
    const midX = (a.right + b.left) / 2 + lane
    return chamfer([[a.right, a.centerY], [midX, a.centerY], [midX, b.centerY], [b.left, b.centerY]], 7)
  })

  return { width: box.width, height: box.height, paths }
}

export default function SkillsMatrix({ onOpenProject, onClose }) {
  const containerRef = useRef(null)
  const panelRef = useRef(null)
  const [geometry, setGeometry] = useState({ width: 0, height: 0, paths: [] })
  const [hovered, setHovered] = useState(null)
  const [locked, setLocked] = useState(null)

  useLayoutEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
    const container = containerRef.current
    const measure = () => setGeometry(buildWires(container))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const activeId = hovered ?? locked
  const trace = useMemo(() => (activeId ? traceSignal(activeId) : null), [activeId])
  const readoutSkill = allSkills.find((skill) => skill.id === activeId)

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signal-chain-title"
      tabIndex={-1}
      className="animate-layer-in thin-scroll fixed inset-0 z-40 overflow-y-auto bg-[#07130f]/90 outline-none backdrop-blur-sm"
    >
      <div className="mx-auto flex min-h-full max-w-[1320px] flex-col px-4 py-5 sm:px-6">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
          <div>
            <p className="eyebrow flex items-center gap-2 text-emerald-glow">
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-emerald-glow" />
              In1.Cu · Inner layer exposed
            </p>
            <h2 id="signal-chain-title" className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Signal Chain
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-300">
              How my skills connect, from the physical world to the application. Select a node to trace its path.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-line-bright bg-ink px-2.5 py-1.5 font-mono text-xs text-cyan-glow transition-colors hover:bg-cyan-glow/10"
          >
            ← Back to board
          </button>
        </header>

        <div className="@container flex-1">
          <div ref={containerRef} className="relative grid gap-12 @3xl:grid-cols-3 @3xl:gap-20">
            <svg aria-hidden="true" width={geometry.width} height={geometry.height} className="pointer-events-none absolute inset-0">
              {geometry.paths.map((path, index) => {
                const isLive = trace?.wires.has(index)
                return (
                  <path
                    key={`base-${index}`}
                    d={path}
                    fill="none"
                    strokeWidth="1.5"
                    stroke="#2f6b57"
                    opacity={trace && !isLive ? 0.3 : 1}
                  />
                )
              })}
              {geometry.paths.map((path, index) => {
                const isLive = trace?.wires.has(index)
                if (trace && !isLive) return null
                return (
                  <path
                    key={`flow-${index}`}
                    d={path}
                    fill="none"
                    className="signal-flow"
                    strokeLinecap="round"
                    strokeWidth={isLive ? 2.2 : 1.4}
                    stroke={isLive ? 'var(--color-cyan-glow)' : 'var(--color-emerald-glow)'}
                    opacity={isLive ? 1 : 0.55}
                    style={isLive ? { filter: 'drop-shadow(0 0 4px var(--color-cyan-glow))' } : undefined}
                  />
                )
              })}
            </svg>

            {stages.map((stage) => (
              <div key={stage.id} data-stage={stage.id} className="panel relative flex flex-col">
                <div className="border-b border-line px-3 py-2.5">
                  <p className="eyebrow text-emerald-glow">{stage.code}</p>
                  <h3 className="mt-1 text-base font-semibold text-white">{stage.label}</h3>
                  <p className="text-xs text-slate-400">{stage.note}</p>
                </div>

                <div className="grid flex-1 content-start gap-2 p-3 @md:@max-3xl:grid-cols-2">
                  {stage.skills.map((skill) => {
                    const inTrace = trace?.nodes.has(skill.id)
                    const isSource = activeId === skill.id
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        data-skill={skill.id}
                        aria-pressed={locked === skill.id}
                        onMouseEnter={() => setHovered(skill.id)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(skill.id)}
                        onBlur={() => setHovered(null)}
                        onClick={() => {
                          const release = locked === skill.id
                          setLocked(release ? null : skill.id)
                          if (release) setHovered(null)
                        }}
                        className={`min-w-0 border px-2.5 py-2 text-left transition-all ${
                          isSource
                            ? 'border-cyan-glow bg-cyan-glow/10 shadow-[0_0_16px_rgb(34_211_238_/_0.25)]'
                            : inTrace
                              ? 'border-cyan-glow/50 bg-raised'
                              : trace
                                ? 'border-line opacity-45'
                                : 'border-line bg-raised hover:border-line-bright'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium text-white">
                          <span className="led" style={{ '--led': inTrace ? 'var(--color-cyan-glow)' : 'var(--color-emerald-glow)' }} />
                          <span className="min-w-0 truncate">{skill.name}</span>
                        </span>
                        <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-400">{skill.meta}</span>
                      </button>
                    )
                  })}
                </div>

                <p className="border-t border-line px-3 py-2 font-mono text-[10px] text-slate-500">
                  OUT <span className="text-emerald-glow">▸</span> {stage.output}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="panel sticky bottom-3 z-20 mt-6 flex min-h-16 flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          {readoutSkill ? (
            <>
              <p className="font-mono text-xs text-slate-300">
                <span className="text-cyan-glow">PROBE</span> {readoutSkill.name}
                <span className="text-slate-500"> | {readoutSkill.meta}</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {readoutSkill.link && (
                  <a
                    href={readoutSkill.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-emerald-glow/30 px-2 py-1 font-mono text-[11px] text-emerald-glow transition-colors hover:bg-emerald-glow/10"
                  >
                    {readoutSkill.link.label} ↗
                  </a>
                )}
                {readoutSkill.projects.map((projectId) => {
                  const project = projects.find((item) => item.id === projectId)
                  return (
                    <button
                      key={projectId}
                      type="button"
                      onClick={() => onOpenProject(projectId)}
                      className="border border-emerald-glow/30 px-2 py-1 font-mono text-[11px] text-emerald-glow transition-colors hover:bg-emerald-glow/10"
                    >
                      {project.title} →
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="font-mono text-xs text-slate-500">Probe disconnected. Click a node to hold its trace and see where it was used.</p>
          )}
        </div>
      </div>
    </div>
  )
}

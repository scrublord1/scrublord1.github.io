import { useEffect, useRef } from 'react'
import { projects, tabs } from '../data/projects'
import { useViewport } from '../hooks/useViewport'
import PinoutMap from './PinoutMap'
import Oscilloscope from './Oscilloscope'

const WIDE_DIE = 1100

function BlockLabel({ code, children }) {
  return (
    <h3 className="eyebrow mb-3 flex items-center gap-2">
      <span className="text-cyan-glow">{code}</span>
      {children}
    </h3>
  )
}

function TreeList({ items }) {
  return (
    <ul className="space-y-2 text-sm leading-snug text-slate-300">
      {items.map((item, index) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="font-mono text-slate-600">
            {index === items.length - 1 ? '└─' : '├─'}
          </span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Floorplan({ project }) {
  const { blockDiagram, firmware, hardware, metrics, photo } = project

  return (
    <div className="die-floor grid min-w-0 gap-px md:grid-cols-12">
      <section className="die-block md:col-span-7">
        <Oscilloscope metrics={metrics} />
      </section>

      <section className="die-block md:col-span-5">
        <BlockLabel code="A">Block diagram</BlockLabel>
        <ol className="mb-4 font-mono text-xs">
          {blockDiagram.nodes.map((node, index) => (
            <li key={`${node}-${index}`}>
              <span className="block border border-line-bright bg-raised px-2.5 py-1.5 text-slate-200">{node}</span>
              {index < blockDiagram.nodes.length - 1 && (
                <span aria-hidden="true" className="ml-3 block h-3 w-px bg-emerald-glow" />
              )}
            </li>
          ))}
        </ol>
        <p className="text-sm leading-relaxed text-slate-400">{blockDiagram.description}</p>
      </section>

      <section className="die-block md:col-span-6">
        <BlockLabel code="B">Firmware layer</BlockLabel>
        <TreeList items={firmware} />
      </section>

      <section className="die-block md:col-span-6">
        <BlockLabel code="C">Hardware layer</BlockLabel>
        <TreeList items={hardware} />
      </section>

      {photo && (
        <figure className="die-block m-0 md:col-span-12">
          <BlockLabel code="D">On the bench</BlockLabel>
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            className="mx-auto max-h-[520px] w-auto max-w-full border border-line-bright object-contain"
          />
          <figcaption className="mt-2 text-center font-mono text-[11px] text-slate-400">{photo.caption}</figcaption>
        </figure>
      )}
    </div>
  )
}

export default function DieView({ project, onClose, onOpenProject }) {
  const panelRef = useRef(null)
  const { width } = useViewport()
  const wide = width >= WIDE_DIE

  const tab = tabs.find((item) => item.id === project.tab)
  const index = projects.indexOf(project)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target?.tagName === 'INPUT') return
      if (event.key === 'ArrowLeft') onOpenProject(previous.id)
      if (event.key === 'ArrowRight') onOpenProject(next.id)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previous, next, onOpenProject])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="die-title"
      tabIndex={-1}
      className="schematic-sheet animate-die-in thin-scroll fixed inset-0 z-40 overflow-y-auto outline-none"
    >
      <nav className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-ink/95 px-4 py-2.5 font-mono text-xs backdrop-blur sm:px-6">
        <button type="button" onClick={onClose} className="shrink-0 border border-line-bright px-2.5 py-1.5 text-cyan-glow transition-colors hover:bg-cyan-glow/10">
          ← Back to board
        </button>
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenProject(previous.id)}
            aria-label={`Previous chip, ${previous.title}`}
            className="border border-line px-2.5 py-1.5 text-slate-300 transition-colors hover:border-line-bright hover:text-white"
          >
            ◂<span className="hidden sm:inline"> {previous.title}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenProject(next.id)}
            aria-label={`Next chip, ${next.title}`}
            className="border border-line px-2.5 py-1.5 text-slate-300 transition-colors hover:border-line-bright hover:text-white"
          >
            <span className="hidden sm:inline">{next.title} </span>▸
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-[1420px] px-4 pt-7 pb-14 sm:px-6">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="min-w-0">
            <p className="eyebrow text-cyan-glow">
              [{tab.code}_{tab.label}] · {project.partNo} · {project.rev}
            </p>
            <h2 id="die-title" className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {project.title}
            </h2>
            <p className="mt-1.5 text-lg text-slate-300">{project.subtitle}</p>
          </div>
          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-slate-400">{project.summary}</p>
            <p className="mt-2 flex items-center gap-2 font-mono text-[11px] text-emerald-glow">
              <span className="led" />
              {project.status}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 font-mono text-xs text-cyan-glow">
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  View the source on GitHub ↗
                </a>
              )}
              {project.video && (
                <a href={project.video} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  Watch the demo video ↗
                </a>
              )}
            </div>
          </div>
        </header>

        <PinoutMap {...project.pinout}>{wide ? <Floorplan project={project} /> : null}</PinoutMap>
        {!wide && (
          <div className="mt-5">
            <Floorplan project={project} />
          </div>
        )}
      </div>
    </div>
  )
}

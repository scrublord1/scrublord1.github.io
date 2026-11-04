import { useEffect, useState } from 'react'
import { focusAreas } from '../data/projects'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const SAMPLES = 18

const stepLevel = (level) => Math.min(0.95, Math.max(0.08, level + (Math.random() - 0.5) * 0.42))

function seedTrace() {
  let level = 0.5
  return Array.from({ length: SAMPLES }, () => {
    level = stepLevel(level)
    return level
  })
}

function formatUptime(seconds) {
  const parts = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}

function Sparkline({ values }) {
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 60},${16 - value * 14}`).join(' ')
  return (
    <svg viewBox="0 0 60 16" className="h-3.5 w-12 shrink-0" aria-hidden="true">
      <polyline points={points} fill="none" stroke="var(--color-emerald-glow)" strokeOpacity="0.8" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

export default function LedBank({ compact, focusedZone, onFocusZone }) {
  const reducedMotion = usePrefersReducedMotion()
  const [uptime, setUptime] = useState(0)
  const [traces, setTraces] = useState(() => Object.fromEntries(focusAreas.map((area) => [area.id, seedTrace()])))

  useEffect(() => {
    const clock = setInterval(() => setUptime((seconds) => seconds + 1), 1000)
    return () => clearInterval(clock)
  }, [])

  useEffect(() => {
    if (reducedMotion || compact) return undefined
    const sampler = setInterval(() => {
      setTraces((current) =>
        Object.fromEntries(
          Object.entries(current).map(([id, values]) => [id, [...values.slice(1), stepLevel(values[values.length - 1])]]),
        ),
      )
    }, 700)
    return () => clearInterval(sampler)
  }, [reducedMotion, compact])

  return (
    <section aria-label="System status, core focus areas" className="h-full">
      {!compact && (
        <div className="mb-1 flex items-center justify-between font-mono text-[11px]">
          <h2 className="silk tracking-[0.12em] uppercase">System status</h2>
          <span className="text-slate-400 tabular-nums">UP {formatUptime(uptime)}</span>
        </div>
      )}
      <ul className={compact ? 'grid grid-cols-2 gap-x-2' : ''}>
        {focusAreas.map((area, index) => (
          <li key={area.id}>
            <button
              type="button"
              onClick={() => onFocusZone(area.tab)}
              className={`flex w-full items-center gap-2 px-1 text-left transition-colors hover:bg-white/5 ${
                compact ? 'h-6' : 'h-[23px]'
              } ${focusedZone === area.tab ? 'bg-cyan-glow/10' : ''}`}
            >
              <span
                className="led animate-led"
                style={{
                  '--led': area.state === 'ACTIVE' ? 'var(--color-emerald-glow)' : 'var(--color-amber-glow)',
                  animationDelay: `${index * 0.3}s`,
                }}
              />
              <span className={`min-w-0 flex-1 truncate text-slate-200 ${compact ? 'text-[11.5px]' : 'text-[13px]'}`}>
                {area.name}
              </span>
              {!compact && <Sparkline values={traces[area.id]} />}
              <span className="sr-only">{area.state}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

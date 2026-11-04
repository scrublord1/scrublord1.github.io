import { useEffect, useRef, useState } from 'react'
import { focusAreas, profile, projects, signalChain, tabs } from '../data/projects'

const PROMPT = `${profile.handle}@bench:~$`
const QUICK_COMMANDS = ['whoami', 'experience', 'projects', 'skills']

const BOOT_LINES = [
  { kind: 'dim', text: 'bench-os v2.4, serial link up at 115200' },
  { kind: 'ok', text: '[ ok ] rails stable, probes attached' },
  ...profile.bio.map((text) => ({ kind: 'out', text })),
  { kind: 'dim', text: "Type 'help' for commands." },
]

const LINE_STYLES = {
  in: 'text-white',
  out: 'text-slate-300',
  ok: 'text-emerald-glow',
  err: 'text-rose-400',
  dim: 'text-slate-500',
}

function runCommand(raw, { onFocusZone, onShowSkills, onShowExperience, onOpenProject }) {
  const [command, ...rest] = raw.trim().toLowerCase().split(/\s+/)
  const argument = rest.join(' ')

  switch (command) {
    case 'help':
      return [
        'whoami        who runs this bench',
        'focus         core ECE focus areas',
        'projects      list every chip on the board',
        'open <1-3>    highlight a board zone',
        'probe <name>  decap a chip, e.g. probe rail',
        'skills        show the signal chain layer',
        'experience    show my work history',
        'resume        download my resume',
        'clear         wipe the console',
      ].map((text) => ({ kind: 'out', text }))
    case 'whoami':
      return [
        { kind: 'ok', text: `${profile.name}, ${profile.role}` },
        ...profile.bio.map((text) => ({ kind: 'out', text })),
      ]
    case 'focus':
      return focusAreas.map((area) => ({ kind: 'out', text: `[${area.state.padEnd(7)}] ${area.name}` }))
    case 'projects':
    case 'ls':
      return projects.map((project, index) => ({ kind: 'out', text: `U${index + 1}  ${project.partNo}  ${project.title}` }))
    case 'open': {
      const zone = tabs[Number(argument) - 1]
      if (!zone) return [{ kind: 'err', text: 'usage: open <1-3>' }]
      onFocusZone(zone.id)
      return [{ kind: 'ok', text: `zone ${zone.code} toggled: ${zone.label}` }]
    }
    case 'probe': {
      const project = projects.find(
        (item) => argument && (item.id.startsWith(argument) || item.title.toLowerCase().startsWith(argument)),
      )
      if (!project) return [{ kind: 'err', text: "no such chip. Try 'projects'." }]
      onOpenProject(project.id)
      return [{ kind: 'ok', text: `decapping ${project.title}` }]
    }
    case 'skills': {
      const total = signalChain.stages.reduce((sum, stage) => sum + stage.skills.length, 0)
      onShowSkills()
      return [{ kind: 'ok', text: `inner layer exposed, ${total} nodes` }]
    }
    case 'experience':
      onShowExperience()
      return [{ kind: 'ok', text: 'silkscreen layer exposed' }]
    case 'resume': {
      const resume = profile.links.find((link) => link.download)
      const anchor = document.createElement('a')
      anchor.href = resume.href
      anchor.download = resume.download
      anchor.click()
      return [{ kind: 'ok', text: `sending ${resume.detail}` }]
    }
    case 'sudo':
      return [{ kind: 'err', text: 'permission denied: please do not hot-swap this bench' }]
    default:
      return [{ kind: 'err', text: `command not found: ${command}. Try 'help'.` }]
  }
}

/* The serial console, docked to the bottom corner of the screen. */
export default function TerminalBio({ open, onClose, onFocusZone, onShowSkills, onShowExperience, onOpenProject }) {
  const [lines, setLines] = useState(BOOT_LINES)
  const [draft, setDraft] = useState('')
  const historyRef = useRef([])
  const historyIndexRef = useRef(-1)
  const screenRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const screen = screenRef.current
    if (screen) screen.scrollTop = screen.scrollHeight
  }, [lines, open])

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  const execute = (raw) => {
    const value = raw.trim()
    if (!value) return
    historyRef.current = [value, ...historyRef.current]
    historyIndexRef.current = -1
    setDraft('')

    if (value.toLowerCase() === 'clear') {
      setLines([])
      return
    }
    const echo = { kind: 'in', text: `${PROMPT} ${value}` }
    const output = runCommand(value, { onFocusZone, onShowSkills, onShowExperience, onOpenProject })
    setLines((current) => [...current, echo, ...output])
  }

  const onKeyDown = (event) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    const history = historyRef.current
    const step = event.key === 'ArrowUp' ? 1 : -1
    const next = Math.min(history.length - 1, Math.max(-1, historyIndexRef.current + step))
    historyIndexRef.current = next
    setDraft(next === -1 ? '' : history[next])
  }

  return (
    <section
      aria-label="Serial console"
      inert={!open}
      className={`panel fixed right-0 bottom-0 z-50 flex h-[min(420px,70vh)] w-full flex-col shadow-[0_0_60px_rgb(0_0_0_/_0.8)] transition-transform duration-300 sm:right-4 sm:bottom-4 sm:w-[480px] ${
        open ? 'translate-y-0' : 'translate-y-[calc(100%+1.5rem)]'
      }`}
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <h2 className="eyebrow">/dev/ttyUSB0</h2>
        <button type="button" onClick={onClose} aria-label="Close console" className="px-1.5 font-mono text-xs text-slate-400 hover:text-white">
          close ✕
        </button>
      </div>

      <div
        ref={screenRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="thin-scroll min-h-0 flex-1 cursor-text overflow-y-auto px-3 py-2.5 font-mono text-xs leading-relaxed"
      >
        {lines.map((line, index) => (
          <p key={index} className={`break-words whitespace-pre-wrap ${LINE_STYLES[line.kind]}`}>
            {line.text}
          </p>
        ))}
      </div>

      <form
        className="flex items-center gap-2 border-t border-line px-3 py-2 font-mono"
        onSubmit={(event) => {
          event.preventDefault()
          execute(draft)
        }}
      >
        <label htmlFor="terminal-input" className="shrink-0 text-xs text-cyan-glow">
          {PROMPT}
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          enterKeyHint="send"
          className="min-w-0 flex-1 bg-transparent text-base text-white caret-cyan-glow outline-none sm:text-xs"
        />
      </form>

      <div className="flex flex-wrap gap-1.5 border-t border-line px-3 py-2">
        {QUICK_COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => execute(command)}
            className="border border-line px-2 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-cyan-glow/60 hover:text-cyan-glow"
          >
            {command}
          </button>
        ))}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { busColors } from '../data/projects'

function PinRow({ pin, number, side, dimmed, selected, onHover, onSelect }) {
  const isLeft = side === 'L'

  return (
    <button
      type="button"
      onMouseEnter={() => onHover(pin)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(pin)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(pin)}
      aria-pressed={selected}
      aria-label={`Pin ${number}, ${pin.signal} on ${pin.bus}, pad ${pin.pad}. ${pin.note}`}
      style={{ '--bus': busColors[pin.bus] }}
      className={`flex h-8 w-full min-w-0 items-center gap-1.5 font-mono text-[11px] transition-opacity sm:text-xs ${
        isLeft ? 'flex-row' : 'flex-row-reverse'
      } ${dimmed ? 'opacity-30' : 'opacity-100'}`}
    >
      <span className={`min-w-0 flex-[0_1_auto] truncate font-medium text-[var(--bus)] ${isLeft ? 'text-right' : 'text-left'}`}>
        {pin.signal}
      </span>
      <span className={`h-px min-w-2 flex-1 bg-[var(--bus)] ${selected ? 'shadow-[0_0_8px_var(--bus)]' : 'opacity-70'}`} />
      <span
        className={`flex h-5 w-6 shrink-0 items-center justify-center border text-[10px] tabular-nums ${
          selected ? 'border-[#c9a35a] bg-[#c9a35a] font-semibold text-ink' : 'border-[#c9a35a]/60 bg-raised text-[#e2c98f]'
        }`}
      >
        {number}
      </span>
    </button>
  )
}

/* Renders pins around a package. With children, the pins ring the open die instead. */
export default function PinoutMap({ chip, package: packageName, pins, children }) {
  const [hoveredPin, setHoveredPin] = useState(null)
  const [pinnedPin, setPinnedPin] = useState(null)
  const [hoveredBus, setHoveredBus] = useState(null)
  const [lockedBus, setLockedBus] = useState(null)

  const left = pins.filter((pin) => pin.side === 'L')
  const right = pins.filter((pin) => pin.side === 'R')
  const buses = [...new Set(pins.map((pin) => pin.bus))]

  const shownPin = hoveredPin ?? pinnedPin
  const activeBus = hoveredBus ?? lockedBus ?? shownPin?.bus ?? null
  const busPins = activeBus ? pins.filter((pin) => pin.bus === activeBus) : []

  const togglePin = (pin) => {
    const release = pinnedPin === pin
    setLockedBus(null)
    setPinnedPin(release ? null : pin)
    if (release) setHoveredPin(null)
  }

  const toggleBus = (bus) => {
    setPinnedPin(null)
    setLockedBus((current) => (current === bus ? null : bus))
  }

  const renderRow = (pin, number, side) => (
    <PinRow
      key={pin.signal}
      pin={pin}
      number={number}
      side={side}
      dimmed={Boolean(activeBus) && pin.bus !== activeBus}
      selected={shownPin === pin}
      onHover={setHoveredPin}
      onSelect={togglePin}
    />
  )

  return (
    <section aria-label={`Pinout and signal map for ${chip}`}>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Highlight a bus">
          {buses.map((bus) => (
            <button
              key={bus}
              type="button"
              aria-pressed={lockedBus === bus}
              onMouseEnter={() => setHoveredBus(bus)}
              onMouseLeave={() => setHoveredBus(null)}
              onClick={() => toggleBus(bus)}
              style={{ '--bus': busColors[bus] }}
              className={`border px-2 py-1 font-mono text-[11px] text-[var(--bus)] transition-colors ${
                lockedBus === bus ? 'border-[var(--bus)] bg-raised' : 'border-line hover:border-[var(--bus)]'
              }`}
            >
              {bus}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="min-h-9 min-w-0 flex-1 basis-64 font-mono text-[11.5px] leading-snug">
          {shownPin ? (
            <>
              <p style={{ color: busColors[shownPin.bus] }}>
                {shownPin.pad} → {shownPin.signal} [{shownPin.bus}]
              </p>
              <p className="text-slate-400">{shownPin.note}</p>
            </>
          ) : activeBus ? (
            <>
              <p style={{ color: busColors[activeBus] }}>
                {activeBus} net, {busPins.length} {busPins.length === 1 ? 'line' : 'lines'}
              </p>
              <p className="text-slate-400">{busPins.map((pin) => pin.signal).join(', ')}</p>
            </>
          ) : (
            <p className="pt-2 text-slate-500">
              {chip} · {packageName} · Probe a pin or bus to trace its net.
            </p>
          )}
        </div>
      </div>

      <div
        className={`grid items-stretch ${
          children
            ? 'grid-cols-[150px_minmax(0,1fr)_150px]'
            : 'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'
        }`}
      >
        <div className="flex flex-col justify-around py-4">{left.map((pin, index) => renderRow(pin, index + 1, 'L'))}</div>

        {children ? (
          <div className="die-seal min-w-0">{children}</div>
        ) : (
          <div className="relative flex min-h-52 items-center justify-center gap-1.5 border border-line-bright bg-raised px-2.5 shadow-[inset_0_0_24px_rgb(0_0_0_/_0.5)]">
            <span aria-hidden="true" className="absolute top-3 left-1.5 h-1 w-1 rounded-full bg-slate-500" />
            <span className="font-mono text-xs font-medium tracking-wider text-white [writing-mode:vertical-rl]">{chip}</span>
            <span className="font-mono text-[9px] tracking-wider text-slate-500 [writing-mode:vertical-rl]">{packageName}</span>
          </div>
        )}

        <div className="flex flex-col justify-around py-4">
          {right.map((pin, index) => renderRow(pin, pins.length - index, 'R'))}
        </div>
      </div>
    </section>
  )
}

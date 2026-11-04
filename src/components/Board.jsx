import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/projects'
import { buildBoard } from '../lib/boardLayout'
import { useViewport } from '../hooks/useViewport'
import BoardCopper from './BoardCopper'
import Chip from './Chip'
import OledBio from './OledBio'
import LedBank from './LedBank'
import EdgeConnector from './EdgeConnector'
import LayerSwitch from './LayerSwitch'

const place = (rect) => ({ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h })
const MIN_SCALE = 0.85
const MAX_PORTRAIT_SCALE = 1.5
const GUTTER = 16

export default function Board({
  openChipId,
  activeLayer,
  focusedZone,
  onOpenProject,
  onFocusZone,
  onOpenConsole,
  onSelectLayer,
}) {
  const { width, height } = useViewport()
  const orientation = width / height < 1 ? 'portrait' : 'landscape'
  const board = useMemo(() => buildBoard(orientation), [orientation])
  const wide = orientation === 'landscape'

  const gutter = wide ? GUTTER : 6
  const fitWidth = (width - gutter * 2) / board.W
  const fitHeight = (height - gutter * 2) / board.H
  // Wide screens fit the whole board. The tall phone footprint fits the width and scrolls.
  const scale = wide ? Math.min(fitWidth, Math.max(fitHeight, MIN_SCALE)) : Math.min(fitWidth, MAX_PORTRAIT_SCALE)

  const seatRef = useRef(null)
  const [camera, setCamera] = useState(null)
  const [hoveredNet, setHoveredNet] = useState(null)

  const openChip = board.chips.find((chip) => chip.project.id === openChipId)

  // Flies the camera to the opened chip, measured from where the board sits now.
  useLayoutEffect(() => {
    if (!openChip) {
      setCamera(null)
      return
    }
    const seat = seatRef.current.getBoundingClientRect()
    const { rect } = openChip
    const zoom = Math.min(width / rect.w, height / rect.h) * 1.1
    setCamera({
      x: width / 2 - seat.left - (rect.x + rect.w / 2) * zoom,
      y: height / 2 - seat.top - (rect.y + rect.h / 2) * zoom,
      zoom,
    })
  }, [openChip, width, height])

  const transform = camera
    ? `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`
    : `scale(${scale})`

  const activeNets = useMemo(() => {
    const nets = new Set()
    if (hoveredNet) nets.add(hoveredNet)
    if (focusedZone) {
      board.chips.filter((chip) => chip.zone.id === focusedZone).forEach((chip) => nets.add(chip.project.id))
    }
    return nets
  }, [hoveredNet, focusedZone, board])

  const overlayOpen = Boolean(openChipId) || activeLayer !== 'projects'

  return (
    <div
      inert={overlayOpen}
      className={`schematic-sheet fixed inset-0 flex ${camera ? 'overflow-hidden' : 'overflow-auto'} ${overlayOpen ? 'board-idle' : ''}`}
    >
      <div
        ref={seatRef}
        className="relative m-auto shrink-0"
        style={{ width: board.W * scale, height: board.H * scale }}
      >
        <main
          className="board-camera absolute top-0 left-0 origin-top-left"
          style={{ width: board.W, height: board.H, transform }}
        >
          <div aria-hidden="true" className="board-shadow absolute inset-0" />
          <BoardCopper board={board} activeNets={activeNets} />

          <header style={place(board.name)} className="flex flex-col justify-center">
            <h1
              className={`silk font-semibold tracking-[0.06em] uppercase ${wide ? 'text-[46px] leading-none whitespace-nowrap' : 'text-[32px] leading-none whitespace-nowrap'}`}
            >
              {profile.name}
            </h1>
            <p className={`mt-2 font-mono text-cyan-glow ${wide ? 'text-[14px]' : 'text-[12px]'}`}>{profile.role}</p>
            <p className={`mt-1.5 text-slate-400 ${wide ? 'text-[15px] leading-snug' : 'text-[12px] leading-snug'}`}>
              {profile.tagline}
            </p>
          </header>

          <div style={place(board.oled)}>
            <OledBio compact={!wide} onOpenConsole={onOpenConsole} />
          </div>

          <div style={place(board.leds)}>
            <LedBank compact={!wide} focusedZone={focusedZone} onFocusZone={onFocusZone} />
          </div>

          {board.zones.map((zone) => (
            <div key={zone.id} style={place(zone.rect)} className="pointer-events-none">
              <button
                type="button"
                aria-pressed={focusedZone === zone.id}
                onClick={() => onFocusZone(zone.id)}
                className={`pointer-events-auto absolute top-1.5 left-2 bg-[#0d1422] px-1.5 py-0.5 font-mono text-[12.5px] transition-colors ${
                  focusedZone === zone.id ? 'text-cyan-glow' : 'silk hover:text-cyan-glow'
                }`}
              >
                [{zone.code}_{zone.label}]
              </button>
            </div>
          ))}

          {board.chips.map((chip) => (
            <div key={chip.project.id} style={place(chip.rect)}>
              <Chip
                project={chip.project}
                refdes={`U${chip.index + 1}`}
                index={chip.index}
                dimmed={Boolean(focusedZone) && chip.zone.id !== focusedZone}
                onOpen={() => onOpenProject(chip.project.id)}
                onHover={setHoveredNet}
              />
            </div>
          ))}

          {profile.links.map((link, i) => (
            <div key={link.id} style={place(board.connectors[i])}>
              <EdgeConnector link={link} compact={!wide} />
            </div>
          ))}

          <div style={place(board.layers)}>
            <LayerSwitch compact={!wide} activeLayer={activeLayer} onSelect={onSelectLayer} />
          </div>
        </main>
      </div>
    </div>
  )
}

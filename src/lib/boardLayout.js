import { projects, tabs } from '../data/projects'
import { chamfer } from './traces'

/*
 * The board has two footprints, one for wide screens and one for phones.
 * All positions are in board units, and the board is scaled to fit the viewport.
 * Each zone holds up to four chips in a 2 x 2 grid.
 */
const FOOTPRINTS = {
  landscape: {
    W: 1200,
    H: 760,
    name: { x: 44, y: 36, w: 410, h: 170 },
    oled: { x: 470, y: 40, w: 390, h: 165 },
    leds: { x: 885, y: 40, w: 275, h: 165 },
    layers: { x: 760, y: 648, w: 400, h: 76 },
    zone: (i) => ({ x: 40 + i * 385, y: 232, w: 350, h: 300 }),
    chip: (zone, j) => ({
      x: zone.x + 16 + (j % 2) * 173,
      y: zone.y + 36 + Math.floor(j / 2) * 132,
      w: 145,
      h: 118,
    }),
    connector: (i) => ({ x: 44 + i * 226, y: 640, w: 210, h: 84 }),
  },
  portrait: {
    W: 420,
    H: 1352,
    name: { x: 20, y: 32, w: 380, h: 84 },
    oled: { x: 20, y: 120, w: 380, h: 92 },
    leds: { x: 20, y: 222, w: 380, h: 74 },
    layers: { x: 20, y: 1224, w: 380, h: 40 },
    zone: (i) => ({ x: 14, y: 306 + i * 306, w: 392, h: 298 }),
    chip: (zone, j) => ({
      x: zone.x + 14 + (j % 2) * 196,
      y: zone.y + 38 + Math.floor(j / 2) * 130,
      w: 168,
      h: 116,
    }),
    connector: (i) => ({ x: 20 + i * 130, y: 1280, w: 120, h: 64 }),
  },
}

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

const overlaps = (x, y, rect, pad = 6) =>
  x > rect.x - pad && x < rect.x + rect.w + pad && y > rect.y - pad && y < rect.y + rect.h + pad

export function buildBoard(orientation) {
  const footprint = FOOTPRINTS[orientation]
  const landscape = orientation === 'landscape'
  const zones = tabs.map((tab, i) => ({ ...tab, rect: footprint.zone(i) }))

  const chips = []
  zones.forEach((zone) => {
    projects
      .filter((project) => project.tab === zone.id)
      .forEach((project, j) => {
        chips.push({ project, zone, slot: j, index: chips.length, rect: footprint.chip(zone.rect, j) })
      })
  })

  const connectors = [0, 1, 2].map((i) => footprint.connector(i))
  const traces = []
  const vias = []
  const addTrace = (net, points, packet = false) => traces.push({ net, d: chamfer(points), packet })

  let ledIndex = 0
  chips.forEach((chip, k) => {
    const { rect, project, slot } = chip
    const net = project.id
    const bottom = rect.y + rect.h
    const target = connectors[k % 3]

    if (landscape) {
      ;[45, 100].forEach((offset, t) => {
        const x = rect.x + offset
        const rail = 540 + k * 8 + t * 4
        const targetX = target.x + 24 + ((k * 2 + t) % 12) * 14
        addTrace(net, [[x, bottom], [x, rail], [targetX, rail], [targetX, target.y]], t === 0 && k % 2 === 0)
        vias.push([x, rail])
      })
      // The top row of each zone reports up to the status LED bank.
      if (slot < 2) {
        const x = rect.x + 72
        const rail = 212 + ledIndex * 3
        const ledX = footprint.leds.x + 22 + ledIndex * 44
        addTrace(net, [[x, rect.y], [x, rail], [ledX, rail], [ledX, footprint.leds.y + footprint.leds.h]], ledIndex % 2 === 1)
        vias.push([x, rail])
        ledIndex += 1
      }
    } else {
      const isLeft = slot % 2 === 0
      const lane = Math.floor(k / 2)
      const railX = isLeft ? 3 + lane * 2 : footprint.W - 3 - lane * 2
      const startX = isLeft ? rect.x : rect.x + rect.w
      const y = rect.y + 58
      const targetX = target.x + 10 + (k % 8) * 13
      const entryY = footprint.layers.y + footprint.layers.h + 3 + lane * 2
      addTrace(net, [[startX, y], [railX, y], [railX, entryY], [targetX, entryY], [targetX, target.y]], k % 3 === 0)
      vias.push([railX, y])
    }
  })

  // Short parallel buses between the two chips in each row.
  chips
    .filter((chip) => chip.slot % 2 === 0)
    .forEach((a) => {
      const b = chips.find((chip) => chip.zone.id === a.zone.id && chip.slot === a.slot + 1)
      if (!b) return
      for (let n = 0; n < 4; n += 1) {
        const y = a.rect.y + 21 + n * 25
        traces.push({ net: a.project.id, link: b.project.id, d: `M${a.rect.x + a.rect.w} ${y} L${b.rect.x} ${y}` })
      }
    })

  // The display bus runs straight down into the chip below it.
  if (landscape) {
    const below = chips.find((chip) => chip.zone.id === zones[1].id && chip.slot === 1)
    for (let n = 0; n < 4; n += 1) {
      const x = below.rect.x + 8 + n * 11
      traces.push({ net: below.project.id, d: `M${x} ${footprint.oled.y + footprint.oled.h} L${x} ${below.rect.y}` })
    }
  }

  // Decoupling capacitors in the gap below each chip.
  const caps = chips.flatMap((chip, k) => [
    { x: chip.rect.x + 10, y: chip.rect.y + chip.rect.h + 3, label: `C${k * 2 + 1}` },
    { x: chip.rect.x + chip.rect.w - 28, y: chip.rect.y + chip.rect.h + 3, label: `C${k * 2 + 2}` },
  ])

  // Stitching vias, kept clear of anything mounted on the board.
  const random = seededRandom(landscape ? 42 : 7)
  const keepouts = [
    footprint.name,
    footprint.oled,
    footprint.leds,
    footprint.layers,
    ...connectors,
    ...chips.map((chip) => chip.rect),
    ...zones.map((zone) => ({ ...zone.rect, h: 26, w: 230 })),
  ]
  const stitches = []
  let attempts = 0
  const wanted = landscape ? 40 : 26
  while (stitches.length < wanted && attempts < 800) {
    attempts += 1
    const x = 22 + random() * (footprint.W - 44)
    const y = 22 + random() * (footprint.H - 44)
    if (!keepouts.some((rect) => overlaps(x, y, rect))) stitches.push([x, y])
  }

  return { orientation, ...footprint, zones, chips, connectors, traces, vias, caps, stitches }
}

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const CHANNEL_COLORS = ['#22d3ee', '#34d399', '#a3e635', '#38bdf8']
const DIVISIONS_X = 10
const DIVISIONS_Y = 8
const FRAME_MS = 1000 / 30

const frac = (value) => value - Math.floor(value)
const hiss = (x, t, amount) => amount * Math.sin(x * 913.7 + t * 47) * Math.sin(x * 271.3 - t * 31)

/* Each trace maps x (0 to 1) and time to a vertical position from -1 to 1. */
const WAVES = {
  sine: (x, t) => 0.68 * Math.sin(2 * Math.PI * (3 * x - t * 0.5)) + hiss(x, t, 0.03),
  clock: (x, t) => (frac(10 * x - t * 0.25) < 0.5 ? 0.6 : -0.6),
  square: (x, t) => {
    const duty = 0.5 + 0.36 * Math.sin(2 * Math.PI * (x - t * 0.08))
    return frac(14 * x) < duty ? 0.6 : -0.6
  },
  pulse: (x, t) => {
    const phase = frac(2.5 * x - t * 0.22)
    const spike = phase < 0.08 ? Math.sin((Math.PI * phase) / 0.08) * 1.45 : 0
    return -0.68 + spike + hiss(x, t, 0.025)
  },
  step: (x, t) => {
    const phase = frac(1.5 * x - t * 0.14)
    return -0.6 + 1.2 * (1 - Math.exp(-phase * 13) * Math.cos(phase * 48)) + hiss(x, t, 0.012)
  },
  ripple: (x, t) => {
    const phase = frac(7 * x - t * 0.5)
    const saw = phase < 0.72 ? phase / 0.72 : (1 - phase) / 0.28
    return 0.36 * (saw - 0.5) + hiss(x, t, 0.05)
  },
  burst: (x, t) => {
    const envelope = frac(1.5 * x - t * 0.14) < 0.42 ? 0.78 : 0.025
    return envelope * Math.sin(2 * Math.PI * 52 * x) + hiss(x, t, 0.02)
  },
  decay: (x, t) => {
    const phase = frac(1.4 * x - t * 0.14)
    return Math.exp(-phase * 5) * 0.88 * Math.sin(2 * Math.PI * phase * 18)
  },
  spectrum: (x, t) => {
    const peak = (center, height, width) => height * Math.exp(-((x - center) ** 2) / width)
    const floor = 0.05 * Math.abs(Math.sin(x * 811 + t * 19) * Math.sin(x * 2039 - t * 13))
    return (
      -0.84 +
      floor +
      peak(0.25, 1.62 + 0.03 * Math.sin(t * 5), 0.00008) +
      peak(0.5, 0.42, 0.00006) +
      peak(0.75, 0.21, 0.00006)
    )
  },
  ramp: (x, t) => -0.68 + 1.3 * (1 - Math.exp(-x * 3.6)) + hiss(x, t, 0.018),
}

function drawGraticule(ctx, width, height) {
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgb(148 163 184 / 0.13)'
  ctx.beginPath()
  for (let i = 1; i < DIVISIONS_X; i += 1) {
    const x = Math.round((i / DIVISIONS_X) * width) + 0.5
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let i = 1; i < DIVISIONS_Y; i += 1) {
    const y = Math.round((i / DIVISIONS_Y) * height) + 0.5
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()

  // Centre axes with minor ticks, as on a bench scope.
  const centerX = Math.round(width / 2) + 0.5
  const centerY = Math.round(height / 2) + 0.5
  ctx.strokeStyle = 'rgb(148 163 184 / 0.32)'
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(width, centerY)
  ctx.moveTo(centerX, 0)
  ctx.lineTo(centerX, height)
  for (let i = 0; i <= DIVISIONS_X * 5; i += 1) {
    const x = Math.round((i / (DIVISIONS_X * 5)) * width) + 0.5
    ctx.moveTo(x, centerY - 2.5)
    ctx.lineTo(x, centerY + 2.5)
  }
  for (let i = 0; i <= DIVISIONS_Y * 5; i += 1) {
    const y = Math.round((i / (DIVISIONS_Y * 5)) * height) + 0.5
    ctx.moveTo(centerX - 2.5, y)
    ctx.lineTo(centerX + 2.5, y)
  }
  ctx.stroke()
}

function drawTrace(ctx, wave, color, width, height, t, alpha, blur) {
  const amplitude = height * 0.5 * 0.9
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.lineJoin = 'round'
  ctx.shadowColor = color
  ctx.shadowBlur = blur
  ctx.beginPath()
  for (let px = 0; px <= width; px += 1) {
    const y = height / 2 - wave(px / width, t) * amplitude
    if (px === 0) ctx.moveTo(px, y)
    else ctx.lineTo(px, y)
  }
  ctx.stroke()
  ctx.restore()
}

function drawCursor(ctx, cursor, color, width, height) {
  ctx.save()
  ctx.strokeStyle = 'rgb(226 232 240 / 0.55)'
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(cursor.x + 0.5, 0)
  ctx.lineTo(cursor.x + 0.5, height)
  ctx.moveTo(0, cursor.y + 0.5)
  ctx.lineTo(width, cursor.y + 0.5)
  ctx.stroke()
  ctx.setLineDash([])

  const divX = ((cursor.x / width) * DIVISIONS_X - DIVISIONS_X / 2).toFixed(1)
  const divY = ((0.5 - cursor.y / height) * DIVISIONS_Y).toFixed(1)
  const label = `X ${divX} div  Y ${divY} div`
  ctx.font = '500 10px "IBM Plex Mono", monospace'
  const labelWidth = ctx.measureText(label).width + 10
  const labelX = Math.min(cursor.x + 8, width - labelWidth - 2)
  const labelY = cursor.y < 26 ? cursor.y + 8 : cursor.y - 24
  ctx.fillStyle = 'rgb(11 15 25 / 0.92)'
  ctx.fillRect(labelX, labelY, labelWidth, 16)
  ctx.fillStyle = color
  ctx.fillText(label, labelX + 5, labelY + 11.5)
  ctx.restore()
}

export default function Oscilloscope({ metrics }) {
  const reducedMotion = usePrefersReducedMotion()
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)
  const [channel, setChannel] = useState(0)
  const [running, setRunning] = useState(!reducedMotion)

  const metric = metrics[channel]
  const color = CHANNEL_COLORS[channel % CHANNEL_COLORS.length]

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const wave = WAVES[metric.wave] ?? WAVES.sine
    let frameId = 0
    let lastDraw = 0
    let clock = 0
    let visible = true
    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const render = () => {
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)
      drawGraticule(ctx, width, height)
      // Two faded ghosts stand in for phosphor persistence.
      drawTrace(ctx, wave, color, width, height, clock - 0.16, 0.12, 0)
      drawTrace(ctx, wave, color, width, height, clock - 0.08, 0.22, 0)
      drawTrace(ctx, wave, color, width, height, clock, 0.95, 9)
      if (cursorRef.current) drawCursor(ctx, cursorRef.current, color, width, height)
    }

    const loop = (now) => {
      frameId = requestAnimationFrame(loop)
      if (!visible || now - lastDraw < FRAME_MS) return
      if (running && lastDraw) clock += (now - lastDraw) / 1000
      lastDraw = now
      render()
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      render()
    })
    resizeObserver.observe(canvas)

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    visibilityObserver.observe(canvas)

    resize()
    render()
    frameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [metric.wave, color, running])

  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    cursorRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3">
        <h4 className="eyebrow">Performance / Oscilloscope</h4>
        <p className="font-mono text-[10px] text-slate-500">Traces illustrative, values real</p>
      </div>

      <div
        className="flex flex-1 flex-col border border-line-bright bg-[#070a12]"
        style={{ boxShadow: `0 0 26px ${color}1f, inset 0 0 34px ${color}0f` }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-3 py-2.5">
          <div className="min-w-0" aria-live="polite">
            <p className="truncate font-mono text-[11px]" style={{ color }}>
              CH{channel + 1} · {metric.label}
            </p>
            <p
              className="mt-0.5 font-mono text-2xl font-medium tabular-nums text-white sm:text-3xl"
              style={{ textShadow: `0 0 16px ${color}` }}
            >
              {metric.value}
              <span className="ml-1 text-sm font-normal text-slate-400">{metric.unit}</span>
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-400">{metric.detail}</p>
          </div>
          <button
            type="button"
            aria-pressed={running}
            onClick={() => setRunning((value) => !value)}
            className={`shrink-0 border px-2 py-1 font-mono text-[10px] font-medium transition-colors ${
              running
                ? 'border-emerald-glow/50 text-emerald-glow hover:bg-emerald-glow/10'
                : 'border-rose-400/50 text-rose-400 hover:bg-rose-400/10'
            }`}
          >
            {running ? 'RUN' : 'STOP'}
          </button>
        </div>

        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Illustrative trace for ${metric.label}: ${metric.value} ${metric.unit}`}
          onPointerMove={onPointerMove}
          onPointerLeave={() => {
            cursorRef.current = null
          }}
          className="block h-44 min-h-44 w-full flex-1 cursor-crosshair touch-pan-y"
        />

        <div className="grid grid-cols-2 border-t border-line" role="group" aria-label="Measurement channels">
          {metrics.map((item, index) => {
            const channelColor = CHANNEL_COLORS[index % CHANNEL_COLORS.length]
            const selected = index === channel
            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={selected}
                onMouseEnter={() => setChannel(index)}
                onFocus={() => setChannel(index)}
                onClick={() => setChannel(index)}
                className={`min-w-0 border-line px-3 py-2 text-left transition-colors odd:border-r [&:nth-child(-n+2)]:border-b ${
                  selected ? 'bg-raised' : 'hover:bg-raised/60'
                }`}
              >
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <span className="led" style={{ '--led': channelColor, opacity: selected ? 1 : 0.45 }} />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="mt-0.5 block font-mono text-sm tabular-nums text-white">
                  {item.value}
                  <span className="ml-1 text-[11px] text-slate-400">{item.unit}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

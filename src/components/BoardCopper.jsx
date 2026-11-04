import { memo } from 'react'

const MOUNT_INSET = 22

/* Everything that is fixed to the board: outline, pour, copper and passives. */
const StaticCopper = memo(function StaticCopper({ board }) {
  const { W, H, traces, vias, caps, stitches, zones, orientation } = board
  // On the phone footprint the bottom corners are taken by the connectors.
  const mounts = [
    [MOUNT_INSET, orientation === 'landscape' ? MOUNT_INSET : 16],
    [W - MOUNT_INSET, orientation === 'landscape' ? MOUNT_INSET : 16],
    ...(orientation === 'landscape'
      ? [
          [MOUNT_INSET, H - MOUNT_INSET],
          [W - MOUNT_INSET, H - MOUNT_INSET],
        ]
      : []),
  ]

  return (
    <>
      <defs>
        <pattern id="ground-pour" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0H9M0 0V9" stroke="#22d3ee" strokeOpacity="0.045" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="16" fill="#0d1422" stroke="#2a3a52" />
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="16" fill="url(#ground-pour)" />

      {zones.map((zone) => (
        <rect
          key={zone.id}
          x={zone.rect.x}
          y={zone.rect.y}
          width={zone.rect.w}
          height={zone.rect.h}
          fill="none"
          stroke="#55657f"
          strokeWidth="1"
          strokeDasharray="6 5"
        />
      ))}

      <g fill="none" stroke="#2c4158" strokeWidth={orientation === 'landscape' ? 1.6 : 1.2} strokeLinejoin="round">
        {traces.map((trace, index) => (
          <path key={index} d={trace.d} pathLength="1" className="trace-draw" />
        ))}
      </g>

      <g>
        {stitches.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="2.2" fill="#0b0f19" stroke="#3b4d66" strokeWidth="1" />
        ))}
        {vias.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="2.8" fill="#0b0f19" stroke="#c9a35a" strokeWidth="1.2" />
        ))}
      </g>

      <g>
        {caps.map((cap) => (
          <g key={cap.label}>
            <rect x={cap.x} y={cap.y} width="18" height="8" fill="#3a2f22" />
            <rect x={cap.x} y={cap.y} width="4" height="8" fill="#c9a35a" />
            <rect x={cap.x + 14} y={cap.y} width="4" height="8" fill="#c9a35a" />
          </g>
        ))}
      </g>

      {mounts.map(([x, y], index) => (
        <g key={index}>
          <circle cx={x} cy={y} r="8" fill="#070a12" stroke="#c9a35a" strokeWidth="2.4" />
        </g>
      ))}
    </>
  )
})

/* The packets and highlighted nets are drawn apart so that hovering stays cheap. */
export default function BoardCopper({ board, activeNets }) {
  const packets = board.traces.filter((trace) => trace.packet)

  return (
    <svg
      aria-hidden="true"
      width={board.W}
      height={board.H}
      viewBox={`0 0 ${board.W} ${board.H}`}
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      <StaticCopper board={board} />

      <g fill="none" strokeLinecap="round">
        {packets.map((trace, index) => (
          <path
            key={index}
            d={trace.d}
            pathLength="1"
            className="packet"
            stroke={index % 2 ? 'var(--color-emerald-glow)' : 'var(--color-cyan-glow)'}
            strokeWidth="2.2"
            style={{ animationDelay: `${index * 0.85}s`, animationDuration: `${5 + (index % 4)}s` }}
          />
        ))}

        {board.traces
          .filter((trace) => activeNets.has(trace.net) || activeNets.has(trace.link))
          .map((trace) => (
            <path
              key={trace.d}
              d={trace.d}
              stroke="var(--color-cyan-glow)"
              strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 4px var(--color-cyan-glow))' }}
            />
          ))}
      </g>
    </svg>
  )
}

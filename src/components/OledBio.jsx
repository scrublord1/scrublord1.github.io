import { profile } from '../data/projects'

export default function OledBio({ compact, onOpenConsole }) {
  return (
    <button
      type="button"
      onClick={onOpenConsole}
      aria-label="Open the serial console"
      className="oled group flex h-full w-full flex-col text-left font-mono"
    >
      {!compact && (
        <span className="mb-1.5 block text-[12px] text-emerald-glow">[ ok ] rails stable, probes attached</span>
      )}
      <span className={`block text-[#a5f3fc] ${compact ? 'text-[11px] leading-[1.35]' : 'text-[13px] leading-[1.45]'}`}>
        {profile.bio.join(' ')}
      </span>
      <span className={`mt-auto block text-slate-400 group-hover:text-cyan-glow ${compact ? 'text-[10.5px]' : 'text-[12px]'}`}>
        &gt; {compact ? 'tap a chip to open it, tap here for console' : 'click a chip to decap it. console: click here or press `'}
        <span aria-hidden="true" className="animate-caret ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.1em] bg-cyan-glow" />
      </span>
    </button>
  )
}

export default function EdgeConnector({ link, compact }) {
  return (
    <a
      href={link.href}
      {...(link.download ? { download: link.download } : { target: '_blank', rel: 'noopener noreferrer' })}
      aria-label={`${link.label}${link.download ? ', download' : ', opens in a new tab'}`}
      className="connector group flex h-full w-full flex-col justify-between"
    >
      <span className="flex items-center justify-between font-mono text-[11px] text-slate-400">
        {link.id}
        <span aria-hidden="true" className="text-[14px] text-emerald-glow">
          {link.download ? '↓' : '↗'}
        </span>
      </span>
      <span className="block min-w-0">
        <span className={`block font-semibold text-white group-hover:text-cyan-glow ${compact ? 'text-[14px]' : 'text-[17px]'}`}>
          {link.label}
        </span>
        {!compact && <span className="block truncate font-mono text-[11px] text-slate-400">{link.detail}</span>}
      </span>
    </a>
  )
}

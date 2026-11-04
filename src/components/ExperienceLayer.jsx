import { useEffect, useRef } from 'react'
import { certifications, education, experience, profile } from '../data/projects'

export default function ExperienceLayer({ onClose, onOpenProject }) {
  const panelRef = useRef(null)
  const resume = profile.links.find((link) => link.download)

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-title"
      tabIndex={-1}
      className="animate-layer-in thin-scroll fixed inset-0 z-40 overflow-y-auto bg-[#100e07]/92 outline-none backdrop-blur-sm"
    >
      <div className="mx-auto max-w-[1120px] px-4 py-5 sm:px-6">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
          <div>
            <p className="eyebrow flex items-center gap-2 text-amber-glow">
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-amber-glow" />
              F.Silk · Revision history
            </p>
            <h2 id="experience-title" className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Experience
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <a
              href={resume.href}
              download={resume.download}
              className="border border-emerald-glow/40 bg-ink px-2.5 py-1.5 text-emerald-glow transition-colors hover:bg-emerald-glow/10"
            >
              Resume ↓
            </a>
            <button
              type="button"
              onClick={onClose}
              className="border border-line-bright bg-ink px-2.5 py-1.5 text-cyan-glow transition-colors hover:bg-cyan-glow/10"
            >
              ← Back to board
            </button>
          </div>
        </header>

        <ol className="border-l border-amber-glow/40">
          {experience.map((job, index) => (
            <li key={job.org} className="relative pb-9 pl-6 sm:pl-8">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[5px] h-[9px] w-[9px] border border-amber-glow bg-ink"
                style={job.current ? { background: 'var(--color-amber-glow)', boxShadow: '0 0 10px var(--color-amber-glow)' } : undefined}
              />
              <p className="font-mono text-xs text-amber-glow">
                REV {String(experience.length - index).padStart(2, '0')} · {job.dates}
              </p>
              <h3 className="mt-1 text-lg leading-snug font-semibold text-white sm:text-xl">{job.role}</h3>
              <p className="text-sm text-slate-300">
                {job.org}, {job.place}
              </p>
              <ul className="mt-2.5 max-w-3xl space-y-1.5 text-sm leading-relaxed text-slate-400">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {job.project && (
                <button
                  type="button"
                  onClick={() => onOpenProject(job.project)}
                  className="mt-2.5 border border-emerald-glow/30 px-2 py-1 font-mono text-[11px] text-emerald-glow transition-colors hover:bg-emerald-glow/10"
                >
                  Open the chip →
                </button>
              )}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 md:grid-cols-2">
          <section aria-labelledby="education-title" className="panel p-5">
            <h3 id="education-title" className="eyebrow mb-3">
              Education
            </h3>
            <p className="font-semibold text-white">{education.degree}</p>
            <p className="mt-1 text-sm text-slate-300">{education.school}</p>
            <p className="mt-1 font-mono text-xs text-amber-glow">
              {education.dates} · {education.score}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{education.coursework}</p>
          </section>

          <section aria-labelledby="certs-title" className="panel p-5">
            <h3 id="certs-title" className="eyebrow mb-3">
              Certifications
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {certifications.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="font-mono text-amber-glow">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`bg-surface border border-line rounded-xl2 shadow-card ${
        hover ? 'transition-all duration-200 hover:shadow-pop hover:-translate-y-[2px] hover:border-line-soft' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, description, meta }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 flex-wrap">
      <div>
        {eyebrow && (
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-brass mb-3 flex items-center gap-2">
            <span className="w-5 h-px bg-brass/60" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[34px] leading-[1.1] font-semibold text-fg-hi tracking-tight">{title}</h1>
        {description && <p className="text-[14px] text-fg-mid mt-2.5 max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {meta && <div className="text-right">{meta}</div>}
    </div>
  )
}

export function MethodologyNote({ children }) {
  return (
    <div className="flex items-start gap-2.5 text-[11px] text-fg-low leading-relaxed mt-8 pt-5 border-t border-line">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="mt-[1px] shrink-0 text-brass/70">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
      </svg>
      <p className="max-w-3xl">{children}</p>
    </div>
  )
}

const levelStyles = {
  HIGH: 'text-danger bg-danger/10 border-danger/25',
  MEDIUM: 'text-amber bg-amber/10 border-amber/25',
  LOW: 'text-accent bg-accent/10 border-accent/25',
  CRITICAL: 'text-danger bg-danger/10 border-danger/25',
  MODERATE: 'text-amber bg-amber/10 border-amber/25'
}

export function LevelBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-semibold tracking-wide ${levelStyles[level] || ''}`}
    >
      {level}
    </span>
  )
}

const barColor = {
  HIGH: 'bg-danger',
  MEDIUM: 'bg-amber',
  LOW: 'bg-accent'
}

export function RiskBar({ level, score }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-line-soft overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor[level]}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-mono text-xs text-fg-low w-14 text-right tabular">{score}/100</span>
    </div>
  )
}

/* Ledger ticker — the ownable stat-strip motif used on the Dashboard */
export function StatTicker({ label, value, dotColor, delta, first = false }) {
  return (
    <div className={`flex-1 min-w-[150px] relative ${first ? '' : 'pl-8'}`}>
      {!first && (
        <span className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-transparent via-brass/40 to-transparent" />
      )}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-fg-low">{label}</span>
      </div>
      <div className="font-mono text-[26px] leading-none font-medium text-fg-hi tabular">{value}</div>
      {delta && <div className="text-[11px] text-accent mt-1.5 font-medium">{delta}</div>}
    </div>
  )
}

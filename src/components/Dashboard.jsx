import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { Card } from './ui.jsx'
import { inr } from '../utils/analysis.js'
import SWOTAnalysis from './SWOTAnalysis'
import FeasibilityCard from './FeasibilityCard'


export default function Dashboard({ market, readiness, risk,advancedRisk,swot,feasibility, submission }) {
  const readinessLabel = readiness.overall >= 70 ? 'Strong' : readiness.overall >= 45 ? 'Developing' : 'Early Stage'
  const growthLabel = market.tamGrowth >= market.samGrowth + 3 ? 'High' : market.tamGrowth >= market.samGrowth ? 'Steady' : 'Cautious'
  const competitionLabel = market.topShare >= 28 ? 'Concentrated' : market.topShare >= 18 ? 'Moderate' : 'Fragmented'
  const recommendation = risk.overallLevel === 'HIGH' ? 'Address Risks' : risk.overallLevel === 'MEDIUM' ? 'Proceed with Caution' : 'Proceed'

  return (
    <div className="h-full overflow-hidden px-6 py-4 fade-up">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-3">

        {/* Executive Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brass mb-1.5 flex items-center gap-2">
              <span className="w-4 h-px bg-brass/60" />
              Executive Dashboard
            </p>
            <h1 className="font-display text-[26px] leading-tight font-semibold text-fg-hi tracking-tight">
              {submission?.name || 'Startup'} <span className="text-fg-low font-normal">· Intelligence Report</span>
            </h1>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <StatusBadge title="Sector" value={market.sectorName} />
            <StatusBadge title="Risk" value={capitalize(risk.overallLevel)} />
            <StatusBadge title="Readiness" value={readinessLabel} />
            <StatusBadge title="Verdict" value={recommendation} />
          </div>
        </div>
        {/* Executive Summary */}

<div className="mb-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl">

    <div className="flex flex-col lg:flex-row justify-between gap-6">

        <div>

            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">

                Startup Health Score

            </p>

            <div className="mt-3 flex items-end gap-3">

                <span className="text-6xl font-bold text-white">

                    {feasibility?.score ?? readiness.overall}%

                </span>

                <span className="text-green-400 text-xl mb-2">

                    {feasibility?.grade}

                </span>

            </div>

            <div className="mt-3 h-3 rounded-full bg-slate-700 overflow-hidden">

                <div

                    className="h-full bg-gradient-to-r from-cyan-400 via-green-400 to-emerald-500 transition-all duration-1000"

                    style={{

                        width: `${feasibility?.score ?? readiness.overall}%`

                    }}

                />

            </div>

        </div>

        <div className="grid grid-cols-2 gap-4">

            <MetricCard

                title="Investment"

                value={feasibility?.investment}

                color="text-green-400"

            />

            <MetricCard

                title="Verdict"

                value={feasibility?.verdict}

                color="text-cyan-400"

            />

            <MetricCard

                title="Launch"

                value={feasibility?.readiness}

                color="text-yellow-400"

            />

            <MetricCard

                title="Risk"

                value={risk.overallLevel}

                color="text-red-400"

            />

        </div>

    </div>

</div>

        {/* Launch Score */}
        <div className="relative overflow-hidden rounded-xl2 border border-line bg-raised p-5 shrink-0 hover-card">
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-70"
            style={{ background: 'radial-gradient(circle, rgba(198,161,91,0.14) 0%, rgba(198,161,91,0) 70%)' }}
          />
          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-brass mb-2.5">
                Serviceable Obtainable Market
              </p>
              <div className="font-display text-[44px] leading-[0.9] font-medium text-fg-hi tabular tracking-tight">
                {inr(market.som)}
              </div>
            </div>
            <div className="flex gap-8 border-l border-line/70 pl-8">
              <MiniLedger label="TAM" value={inr(market.tam)} dot="#E1596A" />
              <MiniLedger label="SAM" value={inr(market.sam)} dot="#E3A23C" />
              <MiniLedger label="Top Share" value={`${market.topShare}%`} dot="#C6A15B" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3 flex-1 min-h-0">
          <Card className="glass hover-card p-5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="font-display font-semibold text-[14px] text-fg-hi">SOM Capture Trajectory</h2>
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-fg-low">₹ Crore · 2020–2026</span>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={market.trend} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="somFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DDBE84" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#8F7238" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1E2330" vertical={false} strokeDasharray="3 4" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#5B6274' }} axisLine={{ stroke: '#242938' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5B6274' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} width={44} />
                  <Tooltip
                    cursor={{ fill: 'rgba(198,161,91,0.06)' }}
                    formatter={(v) => [inr(v), 'SOM']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #2A3040', background: '#171B24', color: '#EDEFF3', fontSize: 11, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#9AA1B2', fontSize: 10, marginBottom: 2 }}
                  />
                  <Bar dataKey="som" name="SOM (₹ Cr)" fill="url(#somFill)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 shrink-0">
              <InsightCard title="Growth" value={growthLabel} />
              <InsightCard title="Competition" value={competitionLabel} />
              <InsightCard title="Market Fit" value={`${risk.marketFit}%`} />
            </div>
          </Card>

          <Card className="glass hover-card p-5 flex flex-col overflow-hidden">
            <h2 className="font-display font-semibold text-[14px] text-fg-hi mb-3 shrink-0">Launch Readiness</h2>
            <div className="shrink-0">
              <ReadinessGauge value={readiness.overall} />
            </div>
            <div className="space-y-2.5 mt-3 overflow-y-auto flex-1 min-h-0">
              {readiness.breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-fg-mid">{b.label}</span>
                    <span className="font-mono text-[10px] text-fg-low tabular">{b.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-line/80 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brass-light to-brass transition-all duration-500" style={{ width: `${b.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
     </div>

{/* SWOT Analysis */}

<SWOTAnalysis
    swot={swot}
/>

{/* Startup Feasibility */}

<FeasibilityCard
    feasibility={feasibility}
/>

</div>

)

}

function MiniLedger({ label, value, dot }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-fg-low">{label}</span>
      </div>
      <div className="font-mono text-base font-medium text-fg-hi tabular">{value}</div>
    </div>
  )
}

function StatusBadge({ title, value }) {
  return (
    <div className="rounded-lg border border-line bg-raised px-3 py-2 min-w-[92px]">
      <div className="text-[8.5px] uppercase tracking-[0.14em] text-fg-low font-mono mb-0.5">{title}</div>
      <div className="text-[12px] font-semibold text-fg-hi truncate">{value}</div>
    </div>
  )
}

function InsightCard({ title, value }) {
  return (
    <div className="rounded-lg border border-line bg-raised px-3 py-2 transition-colors duration-200 hover:border-line-soft">
      <div className="text-[8.5px] uppercase tracking-[0.14em] text-fg-low font-mono">{title}</div>
      <div className="mt-0.5 text-[12.5px] font-semibold text-fg-hi">{value}</div>
    </div>
  )
}

function capitalize(s) {
  if (s === 'MEDIUM') return 'Moderate'
  return s.charAt(0) + s.slice(1).toLowerCase()
}

function ReadinessGauge({ value }) {
  const size = 130
  const stroke = 11
  const radius = (size - stroke) / 2
  const circumference = Math.PI * radius
  const offset = circumference * (1 - value / 100)

  function MetricCard({ title, value, color }) {

    return (

        <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">

            <div className="text-xs uppercase tracking-widest text-slate-400">

                {title}

            </div>

            <div className={`mt-2 text-lg font-semibold ${color}`}>

                {value}

            </div>

        </div>

    );

}

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#242938"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#C6A15B"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="-mt-5 text-center">
        <div className="font-display text-xl font-semibold text-fg-hi tabular">{value}%</div>
        <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-fg-low">Ready</div>
      </div>
    </div>
  )
}

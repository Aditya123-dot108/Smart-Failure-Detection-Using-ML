import { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Card } from './ui.jsx'
import { SECTOR_NAMES, BUSINESS_MODELS } from '../data/sectors.js'
import { generateMarketData, inr } from '../utils/analysis.js'
import KPICards from "./KPICards";

const EMPTY = {
  name: '',
  sector: SECTOR_NAMES[0],
  businessModel: BUSINESS_MODELS[0],
  targetMarket: '',
  budgetLakh: '',
  description: ''
}

export default function ProjectInput({ onAnalyze, submission }) {
  const [form, setForm] = useState(submission || EMPTY)
  const [preview, setPreview] = useState(() =>
    generateMarketData(form.sector, Number(form.budgetLakh))
  )

  function update(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (field === 'sector' || field === 'budgetLakh') {
      setPreview(generateMarketData(next.sector, Number(next.budgetLakh)))
    }
  }

  function handleReset() {
    setForm(EMPTY)
    setPreview(generateMarketData(EMPTY.sector, 0))
  }

  function handleAnalyze(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onAnalyze(form)
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-4 fade-up">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="mb-3 shrink-0">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brass mb-1">
            Milestone 1 · Data Collection
          </p>
          <h1 className="font-display text-2xl font-semibold text-fg-hi tracking-tight">
            Project Input
          </h1>
        </div>

        <KPICards />

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
          {/* Submission form */}
          <Card className="glass hover-card p-5">
            <h2 className="font-display font-semibold text-sm text-fg-hi mb-3">Project Submission</h2>
            <form onSubmit={handleAnalyze} className="space-y-3">
              <Field label="Startup / Project Name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Flora"
                  className={inputClass}
                />
              </Field>

              <Field label="Industry / Sector">
                <select
                  value={form.sector}
                  onChange={(e) => update('sector', e.target.value)}
                  className={inputClass}
                >
                  {SECTOR_NAMES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Business Model">
                <select
                  value={form.businessModel}
                  onChange={(e) => update('businessModel', e.target.value)}
                  className={inputClass}
                >
                  {BUSINESS_MODELS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </Field>

              <Field label="Target Market">
                <input
                  value={form.targetMarket}
                  onChange={(e) => update('targetMarket', e.target.value)}
                  placeholder="e.g. Tier-1 urban working professionals"
                  className={inputClass}
                />
              </Field>

              <Field label="Budget (INR Lakh)">
                <input
                  type="number"
                  min="0"
                  value={form.budgetLakh}
                  onChange={(e) => update('budgetLakh', e.target.value)}
                  placeholder="25"
                  className={inputClass}
                />
              </Field>

              <Field label="Project Description">
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="What does the product do, and who is it for?"
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 rounded-lg text-[13px] font-medium text-fg-mid border border-line hover:bg-white/5 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg text-[13px] font-semibold text-canvas bg-gradient-to-r from-brass-light to-brass hover:shadow-brass transition-all"
                >
                  Analyze Project
                </button>
              </div>
            </form>
          </Card>

          {/* Market analysis + competitor landscape */}
          <div className="flex flex-col gap-4">
            <Card className="glass hover-card p-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-semibold text-sm text-fg-hi">Market Analysis</h2>
                <span className="font-mono text-[10px] text-fg-low">{preview.sectorName}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-1 mb-1">
                <MiniStat label="TAM" value={inr(preview.tam)} delta={`+${preview.tamGrowth.toFixed(1)}%`} />
                <MiniStat label="SAM" value={inr(preview.sam)} delta={`+${preview.samGrowth.toFixed(1)}%`} />
                <MiniStat label="SOM" value={inr(preview.som)} delta={`+${(preview.samGrowth / 4).toFixed(1)}%`} />
              </div>

              <div>
                <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-fg-low mb-1">
                  Historical Market Growth & Forecast
                </p>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
  <AreaChart
    data={preview.trend}
    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
  >
    <defs>
      <linearGradient id="tamGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#FF5A6A" stopOpacity={0.35} />
        <stop offset="95%" stopColor="#FF5A6A" stopOpacity={0} />
      </linearGradient>

      <linearGradient id="samGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#21D4C3" stopOpacity={0.30} />
        <stop offset="95%" stopColor="#21D4C3" stopOpacity={0} />
      </linearGradient>
    </defs>

    <CartesianGrid
      stroke="#2F3748"
      strokeDasharray="3 3"
      vertical={false}
      opacity={0.45}
    />

    <XAxis
      dataKey="year"
      tick={{ fill: "#8A93A8", fontSize: 12 }}
      axisLine={false}
      tickLine={false}
    />

    <YAxis
      domain={["auto", "auto"]}
      axisLine={false}
      tickLine={false}
      tick={{ fill: "#8A93A8", fontSize: 12 }}
      tickFormatter={(value) => {
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `${Math.round(value / 1000)}K`;
        return value;
      }}
    />

    <Tooltip
      formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")} Cr`]}
      labelStyle={{ color: "#ffffff" }}
      contentStyle={{
        background: "#141923",
        border: "1px solid #2C3445",
        borderRadius: 14,
        color: "#fff"
      }}
    />

    <Legend
      iconType="circle"
      wrapperStyle={{
        fontSize: 12,
        paddingTop: 10
      }}
    />

    <Area
      type="monotone"
      dataKey="tam"
      stroke="none"
      fill="url(#tamGradient)"
    />

    <Area
      type="monotone"
      dataKey="sam"
      stroke="none"
      fill="url(#samGradient)"
    />

    <Line
      type="monotone"
      dataKey="tam"
      name="TAM (₹ Cr)"
      stroke="#FF5A6A"
      strokeWidth={3}
      dot={false}
      activeDot={{
        r: 8,
        strokeWidth: 3
      }}
      animationDuration={1800}
      animationEasing="ease-out"
    />

    <Line
      type="monotone"
      dataKey="sam"
      name="SAM (₹ Cr)"
      stroke="#21D4C3"
      strokeWidth={3}
      dot={false}
      activeDot={{
        r: 8,
        strokeWidth: 3
      }}
      animationDuration={1800}
      animationEasing="ease-out"
    />
  </AreaChart>
</ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card className="glass hover-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display font-semibold text-sm text-fg-hi">Competitor Landscape</h2>
                <span className="font-mono text-[10px] text-fg-low">{preview.competitors.length} tracked</span>
              </div>
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {preview.competitors.map((c) => (
                  <div key={c.name} className="border border-line rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-semibold text-[13px] text-fg-hi">{c.name}</span>
                      <PositionBadge position={c.position} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-fg-low mb-1.5">
                      <span>Share {c.share}%</span>
                      <span>Rev {inr(c.revenueCr)}</span>
                      <span className={c.growth >= 0 ? 'text-success' : 'text-danger'}>
                        {c.growth >= 0 ? '+' : ''}{c.growth}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-line overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-brass-light to-brass" style={{ width: `${c.share * 2.6}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full px-3 py-1.5 rounded-lg border border-line bg-raised text-[13px] text-fg-hi placeholder:text-fg-low focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass/60 transition-shadow'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-fg-mid mb-1">{label}</span>
      {children}
    </label>
  )
}

function MiniStat({ label, value, delta }) {
  return (
    <div>
      <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-fg-low mb-0.5">{label}</div>
      <div className="font-mono text-[15px] font-semibold text-fg-hi tabular">{value}</div>
      <div className="text-[10px] text-success font-medium">{delta}</div>
    </div>
  )
}

const positionStyles = {
  Leader: 'bg-amber/10 text-amber border-amber/25',
  Direct: 'bg-danger/10 text-danger border-danger/25',
  Indirect: 'bg-brass/10 text-brass border-brass/25'
}

function PositionBadge({ position }) {
  return (
    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border ${positionStyles[position] || ''}`}>
      {position.toUpperCase()}
    </span>
  )
}
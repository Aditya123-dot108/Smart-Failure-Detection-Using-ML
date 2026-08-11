import { useRef } from 'react'

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
import { exportDashboardPDF } from '../utils/pdfReport.js'

export default function Dashboard({
  market,
  readiness,
  risk,
  advancedRisk,
  swot,
  feasibility,
  aiSummary,
  submission
}) {

  const reportRef = useRef(null)

  /*
   * ============================================================
   * SAFE VALUES
   * ============================================================
   */

  const healthScore = clamp(
    Number(
      readiness?.overall ??
      risk?.overall ??
      risk?.score ??
      0
    )
  )

  const riskScore = clamp(
    Number(
      advancedRisk?.overallScore ??
      advancedRisk?.score ??
      risk?.overallScore ??
      risk?.score ??
      0
    )
  )

  const riskLevel =
    advancedRisk?.overallLevel ||
    risk?.overallLevel ||
    getRiskLevel(riskScore)

  const readinessLabel =
    healthScore >= 70
      ? 'Strong'
      : healthScore >= 45
        ? 'Developing'
        : 'Early Stage'

  const recommendation =
    riskLevel === 'HIGH'
      ? 'Address Risks'
      : riskLevel === 'MEDIUM'
        ? 'Proceed with Caution'
        : 'Proceed'

  /*
   * Success prediction
   *
   * This is a rule-based prediction, not a claim of guaranteed
   * business success.
   */

  const successProbability = calculateSuccessProbability({
    readiness: healthScore,
    riskScore,
    feasibility
  })

  const successLabel =
    successProbability >= 75
      ? 'High Potential'
      : successProbability >= 55
        ? 'Promising'
        : successProbability >= 35
          ? 'Needs Validation'
          : 'High Uncertainty'

  /*
   * Investor recommendation
   */

  const investorRecommendation =
    successProbability >= 75 && riskLevel === 'LOW'
      ? 'Strong Candidate'
      : successProbability >= 60 && riskLevel !== 'HIGH'
        ? 'Consider with Conditions'
        : successProbability >= 45
          ? 'Monitor & Validate'
          : 'Not Recommended Yet'

  const growthLabel =
    Number(market?.tamGrowth || 0) >=
      Number(market?.samGrowth || 0) + 3
      ? 'High'
      : Number(market?.tamGrowth || 0) >=
          Number(market?.samGrowth || 0)
        ? 'Steady'
        : 'Cautious'

  const competitionLabel =
    Number(market?.topShare || 0) >= 28
      ? 'Concentrated'
      : Number(market?.topShare || 0) >= 18
        ? 'Moderate'
        : 'Fragmented'

  /*
   * ============================================================
   * SWOT NORMALIZATION
   * ============================================================
   */

  const strengths = normalizeItems(
    swot?.strengths,
    [
      'Strong initial funding',
      'Clear market opportunity'
    ]
  )

  const weaknesses = normalizeItems(
    swot?.weaknesses,
    [
      'Requires continuous improvement',
      'Early-stage validation'
    ]
  )

  const opportunities = normalizeItems(
    swot?.opportunities,
    [
      'Emerging business opportunities',
      'Potential market expansion'
    ]
  )

  const threats = normalizeItems(
    swot?.threats,
    [
      'Competitive pressure',
      'Market uncertainty'
    ]
  )

  /*
   * ============================================================
   * FEASIBILITY
   * ============================================================
   */

  const feasibilityOverall = clamp(
    Number(
      feasibility?.overall ??
      feasibility?.score ??
      Math.round(
        (
          getReadinessValue(readiness, 'Market Validation') +
          getReadinessValue(readiness, 'Financial Model') +
          getReadinessValue(readiness, 'Technical Readiness')
        ) / 3
      )
    )
  )

  /*
   * ============================================================
   * RISK DRIVERS
   * ============================================================
   */

  const riskDrivers = buildRiskDrivers(
    advancedRisk,
    risk,
    readiness
  )

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return (
    <div
      ref={reportRef}
      className="h-full overflow-y-auto px-5 md:px-8 py-6 dashboard-scroll print-report"
    >

      {/* ======================================================
          EXECUTIVE HEADER
          ====================================================== */}

      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">

        <div>

          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brass mb-2 flex items-center gap-2">
            <span className="w-5 h-px bg-brass/70" />
            Executive Dashboard
          </p>

          <h1 className="font-display text-[27px] md:text-[31px] leading-tight font-semibold text-fg-hi tracking-tight">
            {submission?.name || 'Startup'}
            <span className="text-fg-low font-normal">
              {' '}· Intelligence Report
            </span>
          </h1>

          <p className="text-xs text-fg-low mt-2">
            Integrated market, risk, feasibility and strategic intelligence.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

          <StatusBadge
            title="Sector"
            value={market?.sectorName || submission?.sector || '—'}
          />

          <StatusBadge
            title="Risk"
            value={capitalize(riskLevel)}
          />

          <StatusBadge
            title="Readiness"
            value={readinessLabel}
          />

          <StatusBadge
            title="Verdict"
            value={recommendation}
          />

        </div>

      </div>


      {/* ======================================================
          STARTUP HEALTH SCORE
          ORIGINAL DASHBOARD PRESERVED
          ====================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-line bg-raised p-5 md:p-6 mb-4 hover-card">

        <div
          className="pointer-events-none absolute -top-32 -right-20 w-96 h-96 rounded-full opacity-70"
          style={{
            background:
              'radial-gradient(circle, rgba(198,161,91,0.13) 0%, rgba(198,161,91,0) 70%)'
          }}
        />

        <div className="relative grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-6">

          {/* SCORE */}

          <div className="flex flex-col justify-center">

            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-brass mb-3">
              Startup Health Score
            </p>

            <div className="flex items-end gap-3">

              <span className="font-display text-[58px] leading-none font-medium text-fg-hi tabular">
                {healthScore}%
              </span>

              <span className={`text-xl font-semibold mb-1 ${scoreColor(healthScore)}`}>
                {getGrade(healthScore)}
              </span>

            </div>

            <div className="mt-4 h-2 rounded-full bg-line overflow-hidden max-w-md">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-brass transition-all duration-700"
                style={{
                  width: `${healthScore}%`
                }}
              />

            </div>

            <div className="flex items-center justify-between max-w-md mt-2">

              <span className="font-mono text-[9px] uppercase tracking-widest text-fg-low">
                Overall project health
              </span>

              <span className="font-mono text-[9px] text-fg-low">
                {healthScore}/100
              </span>

            </div>

          </div>


          {/* EXECUTIVE STATUS CARDS */}

          <div className="grid grid-cols-2 gap-3">

            <MetricCard
              title="Investment"
              value={
                investorRecommendation === 'Not Recommended Yet'
                  ? 'Not Recommended'
                  : investorRecommendation
              }
              color="text-emerald-400"
            />

            <MetricCard
              title="Verdict"
              value={
                successProbability >= 60
                  ? 'Promising'
                  : 'Needs Improvement'
              }
              color="text-cyan-400"
            />

            <MetricCard
              title="Launch"
              value={
                healthScore >= 75 && feasibilityOverall >= 70
                  ? 'Launch Ready'
                  : healthScore >= 55 && feasibilityOverall >= 55
                    ? 'Pilot Recommended'
                    : 'Needs More Validation'
              }
              color={
                healthScore >= 75 && feasibilityOverall >= 70
                  ? 'text-emerald-400'
                  : healthScore >= 55 && feasibilityOverall >= 55
                    ? 'text-amber-400'
                    : 'text-red-400'
              }
            />

            <MetricCard
              title="Risk"
              value={riskLevel}
              color={riskColor(riskLevel)}
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          MARKET SNAPSHOT
          ====================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-line bg-raised p-5 mb-4 hover-card">

        <div className="flex flex-wrap items-center justify-between gap-5">

          <div>

            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-brass mb-2">
              Serviceable Obtainable Market
            </p>

            <div className="font-display text-[42px] md:text-[48px] leading-none font-medium text-fg-hi">
              {inr(market?.som || 0)}
            </div>

            <p className="text-xs text-fg-low mt-3 max-w-xl">
              Estimated market opportunity that this project could
              realistically capture based on the current model.
            </p>

          </div>


          <div className="grid grid-cols-3 gap-7 border-l border-line/70 pl-7">

            <MiniLedger
              label="TAM"
              value={inr(market?.tam || 0)}
              dot="#E1596A"
            />

            <MiniLedger
              label="SAM"
              value={inr(market?.sam || 0)}
              dot="#E3A23C"
            />

            <MiniLedger
              label="Top Share"
              value={`${market?.topShare || 0}%`}
              dot="#C6A15B"
            />

          </div>

        </div>

      </section>


      {/* ======================================================
          MARKET + READINESS
          ORIGINAL DASHBOARD
          ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-4 mb-5">

        {/* MARKET CHART */}

        <Card className="glass hover-card p-5 flex flex-col min-h-[390px]">

          <div className="flex items-center justify-between mb-4">

            <h2 className="font-display font-semibold text-[16px] text-fg-hi">
              SOM Capture Trajectory
            </h2>

            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-fg-low">
              ₹ Crore · 2020–2026
            </span>

          </div>

          <div className="flex-1 min-h-[260px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={market?.trend || []}
                margin={{
                  top: 8,
                  right: 8,
                  left: -12,
                  bottom: 0
                }}
              >

                <defs>

                  <linearGradient
                    id="somFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#DDBE84"
                      stopOpacity={0.95}
                    />

                    <stop
                      offset="100%"
                      stopColor="#8F7238"
                      stopOpacity={0.85}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#1E2330"
                  vertical={false}
                  strokeDasharray="3 4"
                />

                <XAxis
                  dataKey="year"
                  tick={{
                    fontSize: 10,
                    fill: '#5B6274'
                  }}
                  axisLine={{
                    stroke: '#242938'
                  }}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: '#5B6274'
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                  width={44}
                />

                <Tooltip
                  cursor={{
                    fill: 'rgba(198,161,91,0.06)'
                  }}
                  formatter={(value) => [
                    inr(value),
                    'SOM'
                  ]}
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid #2A3040',
                    background: '#171B24',
                    color: '#EDEFF3',
                    fontSize: 11
                  }}
                />

                <Bar
                  dataKey="som"
                  name="SOM"
                  fill="url(#somFill)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">

            <InsightCard
              title="Growth"
              value={growthLabel}
            />

            <InsightCard
              title="Competition"
              value={competitionLabel}
            />

            <InsightCard
              title="Market Fit"
              value={`${risk?.marketFit ?? 0}%`}
            />

          </div>

        </Card>


        {/* READINESS */}

        <Card className="glass hover-card p-5 min-h-[390px]">

          <h2 className="font-display font-semibold text-[16px] text-fg-hi mb-4">
            Launch Readiness
          </h2>

          <div className="flex justify-center">

            <ReadinessGauge value={healthScore} />

          </div>

          <div className="space-y-3 mt-4">

            {(readiness?.breakdown || []).map((item) => (

              <div key={item.label}>

                <div className="flex justify-between mb-1">

                  <span className="text-[11px] text-fg-mid">
                    {item.label}
                  </span>

                  <span className="font-mono text-[10px] text-fg-low">
                    {item.value}%
                  </span>

                </div>

                <div className="h-1.5 rounded-full bg-line overflow-hidden">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brass-light to-brass transition-all duration-700"
                    style={{
                      width: `${clamp(item.value)}%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </Card>

      </div>


      {/* ======================================================
          MILESTONE 2 — RISK INTELLIGENCE
          ====================================================== */}

      <SectionHeading
        eyebrow="Milestone 2"
        title="Risk Intelligence"
        description="Automated risk scoring and decision-support analysis."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-5">

        <MetricCard
          title="Overall Risk Score"
          value={`${riskScore}/100`}
          color={riskColor(riskLevel)}
        />

        <MetricCard
          title="Risk Level"
          value={riskLevel}
          color={riskColor(riskLevel)}
        />

        <MetricCard
          title="Success Probability"
          value={`${successProbability}%`}
          color="text-emerald-400"
        />

        <MetricCard
          title="Decision"
          value={recommendation}
          color="text-amber-400"
        />

      </div>


      {/* RISK HEATMAP */}

      <Card className="glass hover-card p-5 mb-5">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="font-display text-[17px] font-semibold text-fg-hi">
              Risk Heatmap
            </h2>

            <p className="text-xs text-fg-low mt-1">
              Key risk dimensions identified from project inputs.
            </p>

          </div>

          <span className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${riskBadge(riskLevel)}`}>
            {riskLevel} RISK
          </span>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {riskDrivers.map((driver) => (

            <RiskHeatCard
              key={driver.label}
              label={driver.label}
              score={driver.score}
              description={driver.description}
            />

          ))}

        </div>

      </Card>


      {/* ======================================================
          SWOT
          ====================================================== */}

      <SectionHeading
        eyebrow="Strategic Analysis"
        title="SWOT Analysis"
        description="Automatically generated strategic assessment from the project profile."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

        <SwotCard
          title="Strengths"
          icon="S"
          items={strengths}
          tone="strength"
        />

        <SwotCard
          title="Weaknesses"
          icon="W"
          items={weaknesses}
          tone="weakness"
        />

        <SwotCard
          title="Opportunities"
          icon="O"
          items={opportunities}
          tone="opportunity"
        />

        <SwotCard
          title="Threats"
          icon="T"
          items={threats}
          tone="threat"
        />

      </div>


      {/* ======================================================
          FEASIBILITY
          ====================================================== */}

      <SectionHeading
        eyebrow="Project Viability"
        title="Feasibility Assessment"
        description="Multi-dimensional evaluation of whether the project is practical to launch."
      />

      <Card className="glass hover-card p-5 mb-5">

        <div className="flex flex-col md:flex-row md:items-center gap-6">

          <div className="md:w-56 shrink-0">

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg-low">
              Overall Feasibility
            </p>

            <div className="flex items-baseline gap-2 mt-2">

              <span className="font-display text-[46px] text-fg-hi">
                {feasibilityOverall}%
              </span>

              <span className={`text-sm font-semibold ${scoreColor(feasibilityOverall)}`}>
                {feasibilityLabel(feasibilityOverall)}
              </span>

            </div>

          </div>

          <div className="flex-1 space-y-3">

            <FeasibilityBar
              label="Market Feasibility"
              value={
                getFeasibilityValue(
                  feasibility,
                  'market',
                  getReadinessValue(readiness, 'Market Validation')
                )
              }
            />

            <FeasibilityBar
              label="Financial Feasibility"
              value={
                getFeasibilityValue(
                  feasibility,
                  'financial',
                  getReadinessValue(readiness, 'Financial Model')
                )
              }
            />

            <FeasibilityBar
              label="Technical Feasibility"
              value={
                getFeasibilityValue(
                  feasibility,
                  'technical',
                  getReadinessValue(readiness, 'Technical Readiness')
                )
              }
            />

            <FeasibilityBar
              label="Operational Feasibility"
              value={
                getFeasibilityValue(
                  feasibility,
                  'operational',
                  Math.round(feasibilityOverall)
                )
              }
            />

          </div>

        </div>

      </Card>


      {/* ======================================================
          AI EXECUTIVE SUMMARY
          ====================================================== */}

      <SectionHeading
        eyebrow="AI Intelligence"
        title="AI Executive Summary"
        description="Automated synthesis of market, risk, SWOT and feasibility signals."
      />

      <Card className="glass hover-card p-6 mb-5">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-xl border border-brass/30 bg-brass/10 flex items-center justify-center text-2xl shrink-0">
            🤖
          </div>

          <div className="flex-1 min-w-0">

            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">

              <div>

                <h2 className="font-display text-[18px] font-semibold text-fg-hi">
                  Executive Intelligence Brief
                </h2>

                <p className="text-xs text-fg-low mt-1">
                  Decision-oriented project interpretation
                </p>

              </div>

              <span className="font-mono text-[9px] uppercase tracking-widest text-accent border border-accent/20 rounded-full px-3 py-1">
                Generated
              </span>

            </div>

            <div className="rounded-xl border border-line bg-canvas/50 p-5">

              <p className="text-[14px] md:text-[15px] leading-7 text-fg-mid whitespace-pre-line">

                {aiSummary ||
                  'AI executive summary will be generated after the project analysis is completed.'}

              </p>

            </div>

          </div>

        </div>

      </Card>


      {/* ======================================================
          SUCCESS PREDICTION + INVESTOR RECOMMENDATION
          ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">

        {/* SUCCESS */}

        <Card className="glass hover-card p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
                Predictive Intelligence
              </p>

              <h2 className="font-display text-[19px] font-semibold text-fg-hi mt-2">
                Success Prediction
              </h2>

            </div>

            <div className="text-right">

              <div className="font-display text-[38px] text-fg-hi">
                {successProbability}%
              </div>

              <div className="text-xs text-emerald-400">
                {successLabel}
              </div>

            </div>

          </div>

          <div className="mt-5">

            <div className="h-2 rounded-full bg-line overflow-hidden">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-brass transition-all duration-1000"
                style={{
                  width: `${successProbability}%`
                }}
              />

            </div>

          </div>

          <p className="text-xs text-fg-low leading-6 mt-4">
            This score is a decision-support estimate based on readiness,
            project risk and feasibility signals. It is not a guarantee of
            commercial success.
          </p>

        </Card>


        {/* INVESTOR */}

        <Card className="glass hover-card p-6">

          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
            Capital Decision Support
          </p>

          <h2 className="font-display text-[19px] font-semibold text-fg-hi mt-2">
            Investor Recommendation
          </h2>

          <div className="mt-5 rounded-xl border border-line bg-canvas/50 p-5">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-xs text-fg-low uppercase tracking-wider">
                  Current Position
                </p>

                <p className={`text-xl font-semibold mt-2 ${investorColor(investorRecommendation)}`}>
                  {investorRecommendation}
                </p>

              </div>

              <div className="w-12 h-12 rounded-full border border-brass/30 flex items-center justify-center text-brass font-mono">
                {successProbability}
              </div>

            </div>

            <div className="mt-4 text-xs text-fg-low leading-6">

              {investorRecommendation === 'Strong Candidate' &&
                'Strong overall signals. The project demonstrates attractive readiness and manageable risk.'}

              {investorRecommendation === 'Consider with Conditions' &&
                'The project shows potential, but investment should be linked to measurable validation milestones.'}

              {investorRecommendation === 'Monitor & Validate' &&
                'The concept has potential but requires stronger market, financial or operational validation.'}

              {investorRecommendation === 'Not Recommended Yet' &&
                'Current risk and feasibility signals indicate that the project should improve before seeking major investment.'}

            </div>

          </div>

        </Card>

      </div>


      {/* ======================================================
          REPORT ACTIONS
          ====================================================== */}

      <Card className="glass hover-card p-5 mb-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
              Executive Report
            </p>

            <h2 className="font-display text-[18px] font-semibold text-fg-hi mt-1">
              Export Project Intelligence
            </h2>

            <p className="text-xs text-fg-low mt-1">
              Generate a print-ready report containing the complete dashboard analysis.
            </p>

          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                await exportDashboardPDF(
                  reportRef.current,
                  submission?.name || 'Startup Intelligence Report'
                )
              } catch (error) {
                console.error('PDF export failed:', error)
                alert('Unable to generate PDF report. Please try again.')
              }
            }}
            className="px-5 py-3 rounded-xl border border-brass/40 bg-brass/10 hover:bg-brass/20 text-brass font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
          >
            Download PDF Report
          </button>

        </div>

      </Card>

    </div>
  )
}


/* ==============================================================
   METRIC CARD
   ============================================================== */

function MetricCard({ title, value, color = 'text-fg-hi' }) {
  return (
    <div className="rounded-xl border border-line bg-canvas/50 p-4 min-h-[92px]">

      <div className="text-[9px] uppercase tracking-[0.16em] text-fg-low">
        {title}
      </div>

      <div className={`mt-2 text-[16px] md:text-[18px] font-semibold ${color}`}>
        {value}
      </div>

    </div>
  )
}


/* ==============================================================
   STATUS BADGE
   ============================================================== */

function StatusBadge({ title, value }) {
  return (
    <div className="rounded-xl border border-line bg-raised px-4 py-3 min-w-[120px]">

      <div className="font-mono text-[8px] uppercase tracking-[0.15em] text-fg-low">
        {title}
      </div>

      <div className="text-[12px] font-semibold text-fg-hi mt-1">
        {value}
      </div>

    </div>
  )
}


/* ==============================================================
   MARKET LEDGER
   ============================================================== */

function MiniLedger({ label, value, dot }) {
  return (
    <div>

      <div className="flex items-center gap-2">

        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: dot }}
        />

        <span className="font-mono text-[9px] uppercase tracking-widest text-fg-low">
          {label}
        </span>

      </div>

      <div className="font-display text-[17px] md:text-[19px] text-fg-hi mt-2 whitespace-nowrap">
        {value}
      </div>

    </div>
  )
}


/* ==============================================================
   INSIGHT CARD
   ============================================================== */

function InsightCard({ title, value }) {
  return (
    <div className="rounded-lg border border-line bg-canvas/40 px-3 py-3">

      <div className="font-mono text-[8px] uppercase tracking-widest text-fg-low">
        {title}
      </div>

      <div className="text-[12px] font-semibold text-fg-hi mt-1">
        {value}
      </div>

    </div>
  )
}


/* ==============================================================
   SECTION HEADING
   ============================================================== */

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-3 mt-7">

      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-brass">
        {eyebrow}
      </p>

      <h2 className="font-display text-[22px] font-semibold text-fg-hi mt-1">
        {title}
      </h2>

      <p className="text-xs text-fg-low mt-1">
        {description}
      </p>

    </div>
  )
}


/* ==============================================================
   RISK HEAT CARD
   ============================================================== */

function RiskHeatCard({ label, score, description }) {
  const level = getRiskLevel(score)

  return (
    <div className="rounded-xl border border-line bg-canvas/40 p-4">

      <div className="flex items-center justify-between">

        <span className="text-xs text-fg-mid">
          {label}
        </span>

        <span
          className={`w-2.5 h-2.5 rounded-full ${riskDot(level)}`}
        />

      </div>

      <div className="flex items-end gap-2 mt-4">

        <span className="font-display text-[28px] text-fg-hi">
          {score}
        </span>

        <span className="font-mono text-[9px] text-fg-low mb-1">
          /100
        </span>

      </div>

      <div className="h-1.5 rounded-full bg-line mt-3 overflow-hidden">

        <div
          className={`h-full rounded-full ${riskBar(level)} transition-all duration-700`}
          style={{
            width: `${score}%`
          }}
        />

      </div>

      <p className="text-[10px] text-fg-low leading-5 mt-3">
        {description}
      </p>

    </div>
  )
}


/* ==============================================================
   SWOT CARD
   ============================================================== */

function SwotCard({ title, icon, items, tone }) {
  const styles = {
    strength: {
      border: 'border-emerald-500/20',
      icon: 'bg-emerald-500/10 text-emerald-400'
    },

    weakness: {
      border: 'border-amber-500/20',
      icon: 'bg-amber-500/10 text-amber-400'
    },

    opportunity: {
      border: 'border-cyan-500/20',
      icon: 'bg-cyan-500/10 text-cyan-400'
    },

    threat: {
      border: 'border-red-500/20',
      icon: 'bg-red-500/10 text-red-400'
    }
  }

  const style = styles[tone] || styles.strength

  return (
    <Card className={`glass p-5 ${style.border}`}>

      <div className="flex items-center gap-3 mb-4">

        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center font-display font-semibold ${style.icon}`}
        >
          {icon}
        </div>

        <h3 className="font-display text-[16px] font-semibold text-fg-hi">
          {title}
        </h3>

      </div>

      <div className="space-y-3">

        {items.map((item, index) => (

          <div
            key={`${title}-${index}`}
            className="flex gap-3 text-xs text-fg-mid leading-5"
          >

            <span className="text-brass mt-0.5">
              •
            </span>

            <span>
              {item}
            </span>

          </div>

        ))}

      </div>

    </Card>
  )
}


/* ==============================================================
   FEASIBILITY BAR
   ============================================================== */

function FeasibilityBar({ label, value }) {
  const safeValue = clamp(Number(value))

  return (
    <div>

      <div className="flex justify-between mb-1">

        <span className="text-[11px] text-fg-mid">
          {label}
        </span>

        <span className="font-mono text-[10px] text-fg-low">
          {safeValue}%
        </span>

      </div>

      <div className="h-2 rounded-full bg-line overflow-hidden">

        <div
          className="h-full rounded-full bg-gradient-to-r from-brass-light to-brass transition-all duration-700"
          style={{
            width: `${safeValue}%`
          }}
        />

      </div>

    </div>
  )
}


/* ==============================================================
   READINESS GAUGE
   ============================================================== */

function ReadinessGauge({ value }) {
  const size = 150
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = Math.PI * radius
  const safeValue = clamp(Number(value))
  const offset = circumference * (1 - safeValue / 100)

  return (
    <div className="flex flex-col items-center">

      <svg
        width={size}
        height={size / 2 + 15}
        viewBox={`0 0 ${size} ${size / 2 + 15}`}
      >

        <path
          d={`M ${stroke / 2} ${size / 2}
              A ${radius} ${radius} 0 0 1
              ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#242938"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <path
          d={`M ${stroke / 2} ${size / 2}
              A ${radius} ${radius} 0 0 1
              ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#C6A15B"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />

        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          className="fill-fg-hi"
          fontSize="23"
          fontWeight="600"
        >
          {safeValue}%
        </text>

        <text
          x={size / 2}
          y={size / 2 + 15}
          textAnchor="middle"
          className="fill-fg-low"
          fontSize="10"
        >
          READY
        </text>

      </svg>

    </div>
  )
}


/* ==============================================================
   SUCCESS PROBABILITY
   ============================================================== */

function calculateSuccessProbability({
  readiness,
  riskScore,
  feasibility
}) {
  const feasibilityScore = clamp(
    Number(
      feasibility?.overall ??
      feasibility?.score ??
      readiness
    )
  )

  /*
   * Weighted decision-support model:
   *
   * Readiness       45%
   * Feasibility     35%
   * Risk inverse    20%
   */

  const result =
    readiness * 0.45 +
    feasibilityScore * 0.35 +
    (100 - riskScore) * 0.20

  return clamp(Math.round(result))
}


/* ==============================================================
   RISK DRIVERS
   ============================================================== */

function buildRiskDrivers(advancedRisk, risk, readiness) {
  const advanced = advancedRisk?.dimensions || advancedRisk?.categories

  if (Array.isArray(advanced) && advanced.length >= 4) {
    return advanced.slice(0, 4).map((item, index) => ({
      label: item.label || item.name || `Risk ${index + 1}`,
      score: clamp(Number(item.score ?? item.value ?? 50)),
      description:
        item.description ||
        'Risk dimension requiring monitoring.'
    }))
  }

  return [
    {
      label: 'Market',
      score: clamp(
        100 - Number(risk?.marketFit ?? 60)
      ),
      description:
        'Market demand and competitive positioning.'
    },

    {
      label: 'Financial',
      score: clamp(
        100 - getReadinessValue(
          readiness,
          'Financial Model'
        )
      ),
      description:
        'Funding strength and financial sustainability.'
    },

    {
      label: 'Technical',
      score: clamp(
        100 - getReadinessValue(
          readiness,
          'Technical Readiness'
        )
      ),
      description:
        'Technology implementation and delivery readiness.'
    },

    {
      label: 'Execution',
      score: clamp(
        100 - Number(
          readiness?.overall ?? 55
        )
      ),
      description:
        'Operational and execution uncertainty.'
    }
  ]
}


/* ==============================================================
   READINESS VALUE
   ============================================================== */

function getReadinessValue(readiness, label) {
  const item = readiness?.breakdown?.find(
    (entry) => entry.label === label
  )

  return clamp(Number(item?.value ?? 50))
}


/* ==============================================================
   FEASIBILITY VALUE
   ============================================================== */

function getFeasibilityValue(
  feasibility,
  key,
  fallback
) {
  if (!feasibility) {
    return clamp(Number(fallback))
  }

  const possibleValues = [
    feasibility[key],
    feasibility[`${key}Score`],
    feasibility?.breakdown?.find(
      (item) =>
        String(item.label || '')
          .toLowerCase()
          .includes(key)
    )?.value
  ]

  const found = possibleValues.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      !Number.isNaN(Number(value))
  )

  return clamp(
    Number(found ?? fallback)
  )
}


/* ==============================================================
   SWOT NORMALIZATION
   ============================================================== */

function normalizeItems(value, fallback) {
  if (Array.isArray(value) && value.length) {
    return value.map((item) => {
      if (typeof item === 'string') return item

      return (
        item?.text ||
        item?.description ||
        item?.title ||
        String(item)
      )
    })
  }

  if (typeof value === 'string' && value.trim()) {
    return [value]
  }

  return fallback
}


/* ==============================================================
   HELPERS
   ============================================================== */

function clamp(value) {
  const number = Number(value)

  if (Number.isNaN(number)) {
    return 0
  }

  return Math.max(
    0,
    Math.min(100, Math.round(number))
  )
}


function getRiskLevel(score) {
  if (score >= 70) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}


function getGrade(score) {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'E'
}


function scoreColor(score) {
  if (score >= 70) return 'text-emerald-400'
  if (score >= 45) return 'text-amber-400'
  return 'text-red-400'
}


function riskColor(level) {
  if (level === 'HIGH') return 'text-red-400'
  if (level === 'MEDIUM') return 'text-amber-400'
  return 'text-emerald-400'
}


function investorColor(value) {
  if (value === 'Strong Candidate') {
    return 'text-emerald-400'
  }

  if (value === 'Consider with Conditions') {
    return 'text-cyan-400'
  }

  if (value === 'Monitor & Validate') {
    return 'text-amber-400'
  }

  return 'text-red-400'
}


function riskBadge(level) {
  if (level === 'HIGH') {
    return 'border-red-500/30 text-red-400 bg-red-500/10'
  }

  if (level === 'MEDIUM') {
    return 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  }

  return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
}


function riskDot(level) {
  if (level === 'HIGH') return 'bg-red-400'
  if (level === 'MEDIUM') return 'bg-amber-400'
  return 'bg-emerald-400'
}


function riskBar(level) {
  if (level === 'HIGH') return 'bg-red-400'
  if (level === 'MEDIUM') return 'bg-amber-400'
  return 'bg-emerald-400'
}


function feasibilityLabel(score) {
  if (score >= 75) return 'Highly Feasible'
  if (score >= 55) return 'Conditionally Feasible'
  if (score >= 35) return 'Needs Validation'
  return 'Low Feasibility'
}


function capitalize(value) {
  if (!value) return 'Unknown'

  if (value === 'MEDIUM') return 'Moderate'

  return (
    String(value).charAt(0).toUpperCase() +
    String(value).slice(1).toLowerCase()
  )
}
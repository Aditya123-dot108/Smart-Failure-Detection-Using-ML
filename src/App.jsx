import { useMemo, useState } from 'react'

import Sidebar from './components/Sidebar.jsx'
import ProjectInput from './components/ProjectInput.jsx'
import RiskAssessment from './components/RiskAssessment.jsx'
import Recommendations from './components/Recommendations.jsx'
import Dashboard from './components/Dashboard.jsx'

import {
  generateMarketData,
  computeRisk,
  computeRecommendations,
  computeReadiness,
  analyzeProject
} from './utils/analysis.js'

import { saveProject } from './utils/api.js'
import { generateAISummary } from './utils/aiSummary.js'

export default function App() {
  const [tab, setTab] = useState('input')
  const [submission, setSubmission] = useState(null)

  const [saveState, setSaveState] = useState('idle')
  const [saveError, setSaveError] = useState(null)

  /*
   * ============================================================
   * CORE MARKET ANALYSIS
   * ============================================================
   */

  const market = useMemo(() => {
    if (!submission) return null

    return generateMarketData(
      submission.sector,
      Number(submission.budgetLakh)
    )
  }, [submission])

  /*
   * ============================================================
   * CORE RISK ANALYSIS
   * ============================================================
   */

  const risk = useMemo(() => {
    if (!submission || !market) return null

    return computeRisk(submission, market)
  }, [submission, market])

  /*
   * ============================================================
   * RECOMMENDATIONS
   * ============================================================
   */

  const recommendations = useMemo(() => {
    if (!submission || !market || !risk) return null

    return computeRecommendations(
      risk,
      market,
      submission
    )
  }, [submission, market, risk])

  /*
   * ============================================================
   * LAUNCH READINESS
   * ============================================================
   */

  const readiness = useMemo(() => {
    if (!risk) return null

    return computeReadiness(risk)
  }, [risk])

  /*
   * ============================================================
   * MILESTONE 2 ANALYSIS
   *
   * This produces:
   *
   * advancedRisk
   * SWOT
   * Feasibility
   * ============================================================
   */

  const analysis = useMemo(() => {
    if (!submission) return null

    return analyzeProject(submission)
  }, [submission])

  /*
   * ============================================================
   * AI EXECUTIVE SUMMARY
   * ============================================================
   *
   * We use the advanced analysis when available.
   * We also fall back to the existing market/risk calculations.
   * This prevents the dashboard from crashing if one optional
   * property is not returned by analyzeProject().
   */

  const aiSummary = useMemo(() => {
    if (!submission || !analysis) return ''

    const summaryMarket = analysis.market || market
    const summaryRisk = analysis.risk || risk

    if (
      !analysis.feasibility ||
      !summaryMarket ||
      !summaryRisk ||
      !analysis.swot
    ) {
      return ''
    }

    try {
      return generateAISummary({
        feasibility: analysis.feasibility,
        risk: summaryRisk,
        market: summaryMarket,
        swot: analysis.swot
      })
    } catch (error) {
      console.error('AI summary generation failed:', error)
      return ''
    }
  }, [submission, analysis, market, risk])

  /*
   * ============================================================
   * PROJECT ANALYSIS / DATABASE SAVE
   * ============================================================
   */

  async function handleAnalyze(form) {
    /*
     * Store the submitted project.
     */
    setSubmission(form)

    /*
     * Move directly to Risk Assessment.
     */
    setTab('risk')

    /*
     * Calculate the same snapshot that the dashboard will use.
     */
    const computedMarket = generateMarketData(
      form.sector,
      Number(form.budgetLakh)
    )

    const computedRisk = computeRisk(
      form,
      computedMarket
    )

    const computedRecommendations = computeRecommendations(
      computedRisk,
      computedMarket,
      form
    )

    const computedReadiness = computeReadiness(
      computedRisk
    )

    /*
     * Milestone 2 analysis.
     */
    const computedAnalysis = analyzeProject(form)

    setSaveState('saving')
    setSaveError(null)

    try {
      await saveProject({
        name: form.name,
        sector: form.sector,
        businessModel: form.businessModel,
        targetMarket: form.targetMarket,
        budgetLakh: form.budgetLakh || null,
        description: form.description,

        market: computedMarket,
        risk: computedRisk,
        recommendations: computedRecommendations,
        readiness: computedReadiness,

        /*
         * Store Milestone 2 intelligence as well.
         */
        advancedRisk: computedAnalysis?.advancedRisk || null,
        swot: computedAnalysis?.swot || null,
        feasibility: computedAnalysis?.feasibility || null
      })

      setSaveState('saved')
    } catch (error) {
      console.error('Project save failed:', error)

      setSaveState('error')
      setSaveError(error.message)
    }
  }

  /*
   * ============================================================
   * TOP NAVIGATION / STEP INFORMATION
   * ============================================================
   */

  const STEP_META = {
    input: {
      eyebrow: 'Step 01 · Data Collection',
      label: 'Project Input'
    },

    risk: {
      eyebrow: 'Step 02 · Automated Assessment',
      label: 'Risk Assessment'
    },

    recommendations: {
      eyebrow: 'Step 03 · Suggested Actions',
      label: 'Recommendations'
    },

    dashboard: {
      eyebrow: 'Step 04 · Summary',
      label: 'Dashboard'
    }
  }

  /*
   * ============================================================
   * APPLICATION UI
   * ============================================================
   */

  return (
    <div className="h-screen w-screen flex bg-canvas overflow-hidden">

      <Sidebar
        active={tab}
        onChange={setTab}
        hasData={!!submission}
      />

      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">

        {/* Gold application accent */}
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-brass via-brass-light to-brass" />

        {/* Top step bar */}
        <div className="shrink-0 h-11 flex items-center px-8 border-b border-line-soft bg-canvas/90 backdrop-blur-sm">

          <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-fg-low">
            {STEP_META[tab]?.eyebrow}
          </span>

          <span className="mx-2.5 text-line">
            /
          </span>

          <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-brass">
            {STEP_META[tab]?.label}
          </span>

          <SaveStatus
            state={saveState}
            error={saveError}
          />

        </div>

        {/* Main application content */}
        <div className="flex-1 min-h-0 overflow-hidden">

          {/* ==================================================
              PROJECT INPUT
              ================================================== */}

          {tab === 'input' && (
            <ProjectInput
              onAnalyze={handleAnalyze}
              submission={submission}
            />
          )}

          {/* ==================================================
              RISK ASSESSMENT
              ================================================== */}

          {tab === 'risk' && risk && (
            <RiskAssessment
              risk={risk}
              market={market}
            />
          )}

          {/* ==================================================
              RECOMMENDATIONS
              ================================================== */}

          {tab === 'recommendations' && recommendations && (
            <Recommendations
              recommendations={recommendations}
            />
          )}

          {/* ==================================================
              EXECUTIVE DASHBOARD
              ================================================== */}

          {tab === 'dashboard' &&
            market &&
            readiness &&
            risk &&
            analysis && (

              <Dashboard
                market={market}
                readiness={readiness}
                risk={risk}

                /*
                 * Milestone 2
                 */
                advancedRisk={analysis.advancedRisk}
                swot={analysis.swot}
                feasibility={analysis.feasibility}

                /*
                 * AI Executive Summary
                 */
                aiSummary={aiSummary}

                /*
                 * Original project information
                 */
                submission={submission}
              />

            )}

          {/* ==================================================
              EMPTY STATE
              ================================================== */}

          {tab !== 'input' && !submission && (
            <div className="h-full flex items-center justify-center text-center text-fg-low text-sm px-6">

              Submit a project on the Project Input tab
              to generate this view.

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

/*
 * ==============================================================
 * DATABASE SAVE STATUS
 * ==============================================================
 */

function SaveStatus({ state, error }) {
  if (state === 'idle') return null

  const config = {
    saving: {
      text: 'Saving to database…',
      className: 'text-fg-low'
    },

    saved: {
      text: 'Saved to database',
      className: 'text-accent'
    },

    error: {
      text: `Save failed${error ? `: ${error}` : ''}`,
      className: 'text-danger'
    }
  }[state]

  if (!config) return null

  return (
    <span
      className={`ml-auto font-mono text-[10px] tracking-[0.1em] uppercase ${config.className}`}
    >
      {config.text}
    </span>
  )
}
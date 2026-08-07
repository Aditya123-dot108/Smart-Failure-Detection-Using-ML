import { SECTORS } from '../data/sectors.js'
import { calculateRisk } from './riskEngine'
import { generateSWOT } from './swotEngine'
import { calculateFeasibility } from './feasibilityEngine'

const currentYear = new Date().getFullYear();

const YEARS = [
  { label: "5 Years Ago", year: currentYear - 5 },
  { label: "4 Years Ago", year: currentYear - 4 },
  { label: "3 Years Ago", year: currentYear - 3 },
  { label: "2 Years Ago", year: currentYear - 2 },
  { label: "1 Year Ago", year: currentYear - 1 },
  { label: "Current Year", year: currentYear },
  { label: "Next Year", year: currentYear + 1 }
];

// INR-crore formatter, e.g. 18500 -> ₹18,500 Cr ; 92 -> ₹92 Cr
export function inr(value) {
  if (value == null || isNaN(value)) return '—'
  const rounded = Math.round(value)
  return `₹${rounded.toLocaleString('en-IN')} Cr`
}

export function generateMarketData(sectorName, budgetLakh) {
  const sector = SECTORS[sectorName] || Object.values(SECTORS)[0]
  const tam = sector.tamCr
  const sam = tam * sector.samShare
  // Budget nudges SOM slightly — more capital, faster initial capture
  const budgetFactor = budgetLakh ? Math.min(1.6, Math.max(0.6, budgetLakh / 25)) : 1
  const som = sam * sector.somShare * budgetFactor

  // Build a 7-year SOM capture trajectory: early years modest, ramping up,
  // with one deliberate soft year to mirror real acquisition-funnel drag.
const trend = YEARS.map((item) => {

  const yearsBack = currentYear - item.year;

  // Historical growth adjustment (older years had slightly slower growth)
  const historicalFactor =
    yearsBack === 5 ? 0.82 :
    yearsBack === 4 ? 0.86 :
    yearsBack === 3 ? 0.90 :
    yearsBack === 2 ? 0.95 :
    yearsBack === 1 ? 0.98 :
    yearsBack === 0 ? 1.00 :
    1 + sector.tamGrowth / 100;

  let tamValue;
  let samValue;

  if (item.year <= currentYear) {
    // Historical values
    tamValue = tam * historicalFactor;
    samValue = sam * (
      yearsBack === 5 ? 0.76 :
      yearsBack === 4 ? 0.82 :
      yearsBack === 3 ? 0.88 :
      yearsBack === 2 ? 0.94 :
      yearsBack === 1 ? 0.98 :
      1.00
    );
  } else {
    // Next year's projection
    tamValue = tam * (1 + sector.tamGrowth / 100);
    samValue = sam * (1 + sector.samGrowth / 100);
  }

  const somValue = samValue * sector.somShare * budgetFactor;

  return {
    year: item.label,
    tam: Math.round(tamValue),
    sam: Math.round(samValue),
    som: Math.round(somValue)
  };

});

  const competitors = [...sector.competitors].sort((a, b) => b.share - a.share)
  const topShare = competitors[0]?.share ?? 0

  return {
    sectorName,
    tam,
    sam,
    som,
    tamGrowth: sector.tamGrowth,
    samGrowth: sector.samGrowth,
    trend,
    competitors,
    topShare
  }
}

export function computeRisk(input, market) {
  const budget = Number(input.budgetLakh) || 0
  const budgetCr = budget / 100

  // Market risk: rises when SOM trajectory dips or TAM growth outpaces SAM growth
  const growthGap = market.tamGrowth - market.samGrowth
  const somDip = market.trend.some((t, i) => i > 0 && t.som < market.trend[i - 1].som)
  const marketScore = clamp(
    45 + growthGap * 2.4 + (somDip ? 15 : -5),
    18,
    92
  )

  // Competitive risk: rises with leader's market share concentration
  const competitiveScore = clamp(30 + market.topShare * 1.3, 20, 90)

  // Financial risk: rises when budget is small relative to SAM capture needed
  const samToBudgetRatio = budgetCr > 0 ? market.sam / budgetCr : 999
  const financialScore = clamp(20 + Math.log10(Math.max(samToBudgetRatio, 1)) * 22, 15, 88)

  // Technical risk: business-model dependent baseline
  const modelRiskMap = {
    Marketplace: 42,
    Services: 30,
    'Subscription / SaaS': 38,
    'D2C / Direct Sales': 28,
    'On-Demand': 46,
    Freemium: 36
  }
  const technicalScore = clamp((modelRiskMap[input.businessModel] ?? 35) + 5, 15, 80)

  // Regulatory risk: sector-dependent baseline
  const sectorRegMap = {
    FinTech: 68,
    HealthTech: 60,
    EdTech: 32,
    'E-commerce': 30,
    'SaaS / B2B': 20,
    Logistics: 34
  }
  const regulatoryScore = clamp((sectorRegMap[market.sectorName] ?? 25), 10, 85)

  const categories = [
    {
      key: 'market',
      label: 'Market Risk',
      level: levelFor(marketScore),
      score: Math.round(marketScore),
      message: somDip
        ? 'SOM growth softens in at least one year even as TAM keeps expanding — an early signal that customer acquisition is harder than the headline market size suggests.'
        : 'SOM trajectory tracks TAM/SAM growth closely with no material acquisition drag detected in the model.'
    },
    {
      key: 'competitive',
      label: 'Competitive Risk',
      level: levelFor(competitiveScore),
      score: Math.round(competitiveScore),
      message: `The category leader holds roughly ${market.topShare}% market share in this sector. A direct feature-for-feature entry will face steep headwinds without clear differentiation.`
    },
    {
      key: 'financial',
      label: 'Financial Risk',
      level: levelFor(financialScore),
      score: Math.round(financialScore),
      message: 'Budget assumptions depend heavily on SAM capture rate; a small slip in conversion meaningfully extends the runway needed before break-even.'
    },
    {
      key: 'technical',
      label: 'Technical Risk',
      level: levelFor(technicalScore),
      score: Math.round(technicalScore),
      message: 'The chosen business model is well understood in the Indian market; the main exposure is integration complexity with existing regional tooling.'
    },
    {
      key: 'regulatory',
      label: 'Regulatory Risk',
      level: levelFor(regulatoryScore),
      score: Math.round(regulatoryScore),
      message: regulatoryScore >= 55
        ? 'This sector carries active compliance obligations (data, licensing, or consumer-protection rules) that should be scoped before launch.'
        : 'No material sector-specific compliance blockers identified for most business models and target markets in the current environment.'
    }
  ]

  const overallScore = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length
  )
  const criticalFlags = categories.filter((c) => c.level === 'HIGH').length
  const marketFit = clamp(Math.round(100 - growthGap * 1.5 - (somDip ? 8 : 0)), 45, 96)

  return {
    categories,
    overallScore,
    overallLevel: levelFor(overallScore),
    criticalFlags,
    marketFit
  }
}

export function computeRecommendations(risk, market, input) {
  const items = []

  const marketCat = risk.categories.find((c) => c.key === 'market')
  const competitiveCat = risk.categories.find((c) => c.key === 'competitive')

  items.push({
    title: 'Re-anchor SOM assumptions',
    body: 'SOM can dip even against a growing TAM/SAM — validate the acquisition funnel before committing further spend, not just the headline market size.',
    impact: 'High',
    effort: 'Low',
    priority: marketCat.level === 'HIGH' ? 'CRITICAL' : 'HIGH'
  })

  items.push({
    title: 'Differentiate from the category leader',
    body: `India's market leaders in most sectors already hold 25–35% share. Compete on a specific underserved workflow rather than head-to-head feature parity with ${market.competitors[0]?.name ?? 'the leader'}.`,
    impact: 'High',
    effort: 'Medium',
    priority: competitiveCat.level === 'HIGH' ? 'CRITICAL' : 'HIGH'
  })

  items.push({
    title: 'Lock in early SAM capture',
    body: 'Serviceable market growth compounds quickly. Moving fast on beachhead accounts secures an advantage that narrows as competitors respond.',
    impact: 'Medium',
    effort: 'Medium',
    priority: 'HIGH'
  })

  items.push({
    title: 'Simplify regional integrations',
    body: 'Indian SMB and enterprise buyers often run older or fragmented tech stacks. A lightweight integration layer removes the single biggest sales-cycle friction point.',
    impact: 'Medium',
    effort: 'Low',
    priority: 'MODERATE'
  })

  const financialCat = risk.categories.find((c) => c.key === 'financial')
  if (financialCat.level !== 'LOW') {
    items.push({
      title: 'Stage the budget against milestones',
      body: `The current budget of ₹${input.budgetLakh || '—'} Lakh implies a tight runway relative to SAM capture needs. Tie spend releases to validated demand milestones rather than a fixed calendar.`,
      impact: 'High',
      effort: 'Low',
      priority: financialCat.level === 'HIGH' ? 'CRITICAL' : 'HIGH'
    })
  }

  const regulatoryCat = risk.categories.find((c) => c.key === 'regulatory')
  if (regulatoryCat.level !== 'LOW') {
    items.push({
      title: 'Front-load compliance scoping',
      body: `${market.sectorName} carries sector-specific regulatory obligations. Resolve licensing and data-handling requirements before, not after, pilot launch.`,
      impact: 'Medium',
      effort: 'Medium',
      priority: 'MODERATE'
    })
  }

  return items
}

export function computeReadiness(risk) {
  const marketValidation = clamp(100 - risk.categories.find((c) => c.key === 'market').score + 20, 30, 95)
  const competitivePosition = clamp(100 - risk.categories.find((c) => c.key === 'competitive').score + 10, 25, 90)
  const financialModel = clamp(100 - risk.categories.find((c) => c.key === 'financial').score + 15, 25, 92)
  const technicalReadiness = clamp(100 - risk.categories.find((c) => c.key === 'technical').score + 25, 35, 96)

  const overall = Math.round(
    (marketValidation + competitivePosition + financialModel + technicalReadiness) / 4
  )

  return {
    overall,
    breakdown: [
      { label: 'Market Validation', value: Math.round(marketValidation) },
      { label: 'Competitive Position', value: Math.round(competitivePosition) },
      { label: 'Financial Model', value: Math.round(financialModel) },
      { label: 'Technical Readiness', value: Math.round(technicalReadiness) }
    ]
  }
}

function levelFor(score) {
  if (score >= 60) return 'HIGH'
  if (score >= 38) return 'MEDIUM'
  return 'LOW'
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
export function analyzeProject(input) {

    // Existing Market Analysis
    const market = generateMarketData(
        input.sector,
        Number(input.budgetLakh)
    );

    // Existing Risk Engine
    const risk = computeRisk(input, market);

    // New Risk Engine
    const advancedRisk = calculateRisk({
        sector: input.sector,
        businessModel: input.businessModel,
        budgetLakh: Number(input.budgetLakh),
        competitors: market.competitors.length
    });

    // SWOT
    const swot = generateSWOT({
        sector: input.sector,
        businessModel: input.businessModel,
        budgetLakh: Number(input.budgetLakh),
        competitors: market.competitors.length
    });

    // Feasibility
    const feasibility = calculateFeasibility(
        {
            sector: input.sector,
            businessModel: input.businessModel,
            budgetLakh: Number(input.budgetLakh),
            competitors: market.competitors.length
        },
        advancedRisk
    );

    // Existing Recommendations
    const recommendations =
        computeRecommendations(
            risk,
            market,
            input
        );

    // Existing Readiness
    const readiness =
        computeReadiness(risk);

    return {

        market,

        risk,

        advancedRisk,

        swot,

        feasibility,

        recommendations,

        readiness

    };

}

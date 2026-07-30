// Reference dataset for Indian market sizing + competitor landscape.
//
// METHODOLOGY: TAM/SAM/SOM figures use a top-down sizing model (sector TAM ->
// serviceable share -> obtainable share), calibrated against publicly reported
// 2025-2026 industry estimates. Independent market-research firms currently
// report a wide range for most of these sectors (e.g. India fintech TAM is
// cited anywhere from ~$51B to ~$150B depending on scope and methodology), so
// these figures should be treated as a directional planning model, not a
// single audited number — the same caveat applies to any market-sizing tool.
// Competitor names, relative market position, and share ordering reflect
// well-established, publicly known positioning as of early-mid 2026.
export const METHODOLOGY_NOTE =
  'Top-down sizing calibrated to publicly reported 2025–26 industry estimates. Treat as a directional planning model — analyst estimates for these sectors vary by source and methodology.'

export const SECTORS = {
  'E-commerce': {
    tamCr: 278000,
    samShare: 0.266,
    somShare: 0.006,
    tamGrowth: 11.3,
    samGrowth: 8.8,
    competitors: [
      { name: 'Flipkart', share: 31, revenueCr: 65600, growth: 12, position: 'Leader' },
      { name: 'Meesho', share: 19, revenueCr: 5700, growth: 24, position: 'Direct' },
      { name: 'Nykaa', share: 12, revenueCr: 6400, growth: 17, position: 'Indirect' },
      { name: 'Myntra', share: 11, revenueCr: 4900, growth: 13, position: 'Direct' },
      { name: 'Ajio', share: 8, revenueCr: 3200, growth: 15, position: 'Indirect' }
    ]
  },
  FinTech: {
    tamCr: 312000,
    samShare: 0.21,
    somShare: 0.007,
    tamGrowth: 16.4,
    samGrowth: 13.2,
    competitors: [
      { name: 'PhonePe', share: 33, revenueCr: 28000, growth: 19, position: 'Leader' },
      { name: 'Paytm', share: 18, revenueCr: 24500, growth: 6, position: 'Direct' },
      { name: 'Razorpay', share: 14, revenueCr: 12000, growth: 22, position: 'Indirect' },
      { name: 'Cred', share: 9, revenueCr: 3800, growth: 21, position: 'Direct' },
      { name: 'Groww', share: 8, revenueCr: 5200, growth: 28, position: 'Indirect' }
    ]
  },
  HealthTech: {
    tamCr: 96000,
    samShare: 0.24,
    somShare: 0.008,
    tamGrowth: 19.1,
    samGrowth: 15.6,
    competitors: [
      { name: 'Practo', share: 22, revenueCr: 900, growth: 14, position: 'Leader' },
      { name: 'PharmEasy', share: 20, revenueCr: 6400, growth: 9, position: 'Direct' },
      { name: 'Tata 1mg', share: 18, revenueCr: 5100, growth: 18, position: 'Direct' },
      { name: 'Cult.fit', share: 10, revenueCr: 900, growth: 11, position: 'Indirect' },
      { name: 'Apollo 24|7', share: 14, revenueCr: 1600, growth: 23, position: 'Indirect' }
    ]
  },
  EdTech: {
    tamCr: 145000,
    samShare: 0.19,
    somShare: 0.005,
    tamGrowth: 9.8,
    samGrowth: 6.4,
    competitors: [
      { name: "BYJU'S", share: 24, revenueCr: 5300, growth: -8, position: 'Leader' },
      { name: 'Unacademy', share: 15, revenueCr: 950, growth: 4, position: 'Direct' },
      { name: 'PhysicsWallah', share: 17, revenueCr: 1400, growth: 31, position: 'Direct' },
      { name: 'Vedantu', share: 9, revenueCr: 420, growth: 3, position: 'Indirect' },
      { name: 'upGrad', share: 11, revenueCr: 1900, growth: 12, position: 'Indirect' }
    ]
  },
  'SaaS / B2B': {
    tamCr: 189000,
    samShare: 0.22,
    somShare: 0.009,
    tamGrowth: 14.7,
    samGrowth: 12.1,
    competitors: [
      { name: 'Zoho', share: 20, revenueCr: 8500, growth: 16, position: 'Leader' },
      { name: 'Freshworks', share: 14, revenueCr: 5200, growth: 13, position: 'Direct' },
      { name: 'Chargebee', share: 8, revenueCr: 1100, growth: 20, position: 'Indirect' },
      { name: 'Postman', share: 7, revenueCr: 900, growth: 18, position: 'Indirect' },
      { name: 'Darwinbox', share: 6, revenueCr: 700, growth: 25, position: 'Direct' }
    ]
  },
  Logistics: {
    tamCr: 210000,
    samShare: 0.18,
    somShare: 0.006,
    tamGrowth: 10.5,
    samGrowth: 8.1,
    competitors: [
      { name: 'Delhivery', share: 26, revenueCr: 8000, growth: 11, position: 'Leader' },
      { name: 'Ecom Express', share: 15, revenueCr: 2700, growth: 9, position: 'Direct' },
      { name: 'Shadowfax', share: 12, revenueCr: 1600, growth: 19, position: 'Direct' },
      { name: 'Rivigo', share: 9, revenueCr: 1200, growth: 5, position: 'Indirect' },
      { name: 'Porter', share: 10, revenueCr: 1800, growth: 27, position: 'Indirect' }
    ]
  }
}

export const BUSINESS_MODELS = [
  'Marketplace',
  'Services',
  'Subscription / SaaS',
  'D2C / Direct Sales',
  'On-Demand',
  'Freemium'
]

export const SECTOR_NAMES = Object.keys(SECTORS)

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pool from './db.js'

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  business_model TEXT NOT NULL,
  target_market TEXT,
  budget_lakh NUMERIC,
  description TEXT,
  market JSONB,
  risk JSONB,
  recommendations JSONB,
  readiness JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects (sector);
`;

await pool.query(CREATE_TABLE_SQL);
console.log("Projects table is ready.");

const app = express()
const PORT = Number(process.env.PORT) || 4000
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '1mb' }))

// Health check — also verifies DB connectivity
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'unreachable', message: err.message })
  }
})

// Create a project submission (with computed market/risk/recommendations/readiness snapshot)
app.post('/api/projects', async (req, res) => {
  console.log("POST /api/projects");
  console.log(req.body);
  const {
    name,
    sector,
    businessModel,
    targetMarket,
    budgetLakh,
    description,
    market,
    risk,
    recommendations,
    readiness
  } = req.body || {}

  if (!name || !sector || !businessModel) {
    return res.status(400).json({ error: 'name, sector, and businessModel are required.' })
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO projects
        (name, sector, business_model, target_market, budget_lakh, description, market, risk, recommendations, readiness)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        sector,
        businessModel,
        targetMarket || null,
        budgetLakh || null,
        description || null,
        market ? JSON.stringify(market) : null,
        risk ? JSON.stringify(risk) : null,
        recommendations ? JSON.stringify(recommendations) : null,
        readiness ? JSON.stringify(readiness) : null
      ]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('POST /api/projects failed:', err)
    res.status(500).json({ error: 'Failed to save project.' })
  }
})

// List all projects, most recent first
app.get('/api/projects', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    console.error('GET /api/projects failed:', err)
    res.status(500).json({ error: 'Failed to fetch projects.' })
  }
})

// Fetch a single project by id
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('GET /api/projects/:id failed:', err)
    res.status(500).json({ error: 'Failed to fetch project.' })
  }
})

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id])
    if (!rowCount) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    console.error('DELETE /api/projects/:id failed:', err)
    res.status(500).json({ error: 'Failed to delete project.' })
  }
})

app.listen(PORT, () => {
  console.log(`Project Intake API listening on http://localhost:${PORT}`)
})

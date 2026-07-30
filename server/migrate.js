import pool from './db.js'

const SQL = `
CREATE TABLE IF NOT EXISTS projects (
  id               BIGSERIAL PRIMARY KEY,
  name             TEXT NOT NULL,
  sector           TEXT NOT NULL,
  business_model   TEXT NOT NULL,
  target_market    TEXT,
  budget_lakh      NUMERIC,
  description      TEXT,
  market           JSONB,
  risk             JSONB,
  recommendations  JSONB,
  readiness        JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects (sector);
`

async function main() {
  console.log('Running migration...')
  await pool.query(SQL)
  console.log('Done — "projects" table is ready.')
  await pool.end()
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})

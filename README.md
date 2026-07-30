# ProjectIntake — Smart Failure Detection: Market Intelligence Module

Milestone 1 deliverable: **Data Collection & Market Intelligence**.

- Startup / project submission form (name, sector, business model, target market, budget, description)
- Live market analysis (TAM / SAM / SOM sizing + growth trend chart) that updates as you fill the form
- Competitor landscape module (market share, revenue, growth, position) per sector
- Automated Risk Assessment (Market / Competitive / Financial / Technical / Regulatory)
- Recommendations engine driven by the risk output
- Dashboard summary with SOM capture trajectory and a launch-readiness gauge

## Stack

React 18 + Vite + Tailwind CSS + Recharts on the frontend. Market intelligence (TAM/SAM/SOM,
risk scoring, recommendations, readiness) is generated from a local reference dataset in
`src/data/sectors.js` and an analysis engine in `src/utils/analysis.js` — no API keys needed for that part.

Project submissions (along with their computed market/risk/recommendations/readiness snapshot)
are persisted to **PostgreSQL** via a small Express API in `server/`.

## Run it

### 1. Backend (API + Postgres)

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and set `DATABASE_URL` to your existing Postgres connection string, e.g.:

```
DATABASE_URL=postgresql://myuser:mypassword@myhost:5432/mydatabase
```

(If your provider requires SSL — Neon, Supabase, RDS, etc. — set `PGSSL=true` in that file.)

Create the `projects` table (safe to re-run — uses `CREATE TABLE IF NOT EXISTS`):

```bash
npm run migrate
```

Start the API:

```bash
npm start
```

It listens on `http://localhost:4000` by default (`PORT` in `.env` to change it) and exposes:

| Method | Path                | Description                          |
|--------|---------------------|---------------------------------------|
| GET    | `/api/health`       | Checks the server and DB connection   |
| POST   | `/api/projects`     | Save a new project submission         |
| GET    | `/api/projects`     | List all saved projects (newest first)|
| GET    | `/api/projects/:id` | Fetch one project by id               |
| DELETE | `/api/projects/:id` | Delete a project                      |

### 2. Frontend

In the project root (not `server/`):

```bash
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:4000, adjust if needed
npm run dev
```

Then open the URL Vite prints (defaults to `http://localhost:5173`). Submitting the "Project Input"
form now saves the submission and its computed analysis to Postgres in the background — a status
indicator in the top bar shows "Saving to database…" → "Saved to database" (or an error if the API
is unreachable).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  data/sectors.js         Reference TAM/SAM/SOM + competitor data per sector
  utils/analysis.js       Turns a submission into market data, risk, recommendations, readiness
  utils/api.js             Frontend client for the Postgres-backed API (save/list/get/delete)
  components/
    NavBar.jsx             Top nav + tab switcher
    ProjectInput.jsx        Submission form + live market analysis + competitor landscape
    RiskAssessment.jsx      Automated risk flags
    Recommendations.jsx     Suggested next actions
    Dashboard.jsx            Summary stats, SOM trajectory chart, readiness gauge
    ui.jsx                   Shared UI primitives (Card, badges, bars)
  App.jsx                  Wires the pipeline: submission -> market -> risk -> recommendations -> readiness -> save to DB
server/
  index.js                 Express API (projects CRUD)
  db.js                    Postgres connection pool (reads DATABASE_URL or PG* env vars)
  migrate.js               Creates the "projects" table
  .env.example             Copy to .env and fill in your Postgres credentials
```

## Extending for later milestones

Everything downstream of the form (`risk`, `recommendations`, `readiness`) is derived purely from
`src/utils/analysis.js`. To swap in a real ML model or live market API for a later milestone,
replace `generateMarketData` / `computeRisk` with real calls — the components don't need to change
since they only consume the shape of the returned objects.

To add a sector, add an entry to `SECTORS` in `src/data/sectors.js` with `tamCr`, `samShare`,
`somShare`, `tamGrowth`, `samGrowth`, and a `competitors` array.

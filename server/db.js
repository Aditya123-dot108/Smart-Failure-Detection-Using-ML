import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

const useConnectionString = !!process.env.DATABASE_URL

const pool = new Pool(
  useConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.PGDATABASE || 'project_intake',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '',
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
      }
)

pool.on('error', (err) => {
  console.error('Unexpected Postgres pool error', err)
})

export default pool

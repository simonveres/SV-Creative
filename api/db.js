import pg from 'pg';

const { Pool } = pg;
let pool;

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      allowExitOnIdle: true
    });
  }

  return pool;
}

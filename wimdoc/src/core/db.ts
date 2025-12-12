// src/core/db.ts
import pg, { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import dotenv from "dotenv";
dotenv.config();

/* -------------------------------------------------------
   DATABASE CONFIG
-------------------------------------------------------- */

const pool: Pool = new pg.Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT || 5432),
  ssl: { rejectUnauthorized: false },
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

/* -------------------------------------------------------
   SAFE TYPED QUERY WRAPPER
-------------------------------------------------------- */
export async function query<
  T extends QueryResultRow = QueryResultRow
>(
  text: string,
  params?: any[],
  timeoutMs: number = 8000
): Promise<QueryResult<T>> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("DB Query Timeout")), timeoutMs)
  );

  try {
    const raw = await Promise.race([pool.query(text, params), timeout]);
    return raw as QueryResult<T>;
  } catch (err: any) {
    console.error("[DB ERROR] Query failed:", err?.message ?? err);
    throw err;
  }
}

/* -------------------------------------------------------
   CHECK CONNECTION
-------------------------------------------------------- */
export async function checkDBConnection(timeoutMs = 2500): Promise<boolean> {
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB Health Timeout")), timeoutMs)
    );

    await Promise.race([pool.query("SELECT NOW()"), timeout]);

    console.log("[DB] Connection OK");
    return true;
  } catch (err: any) {
    console.error("[DB ERROR] Connection failed:", err.message);
    return false;
  }
}

/* -------------------------------------------------------
   POOL STATS
-------------------------------------------------------- */
export async function getPoolStats() {
  return {
    totalClients: (pool as any).totalCount,
    idleClients: (pool as any).idleCount,
    waitingClients: (pool as any).waitingCount,
  };
}

export async function ping(): Promise<string> {
  const result = await query<{ now: string }>("SELECT NOW() as now");
  return result.rows[0]?.now ?? "";
}

/* -------------------------------------------------------
   TRANSACTION CLIENT
-------------------------------------------------------- */
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

/* -------------------------------------------------------
   SHUTDOWN
-------------------------------------------------------- */
export async function shutdownPool(): Promise<void> {
  try {
    console.log("[DB] Closing pool...");
    await pool.end();
    console.log("[DB] Closed.");
  } catch (err: any) {
    console.error("[DB ERROR] Failed closing pool:", err.message);
  }
}

/* -------------------------------------------------------
   EXPORT
-------------------------------------------------------- */
export const db = {
  query,
  connect: getClient,
  ping,
  health: checkDBConnection,
  stats: getPoolStats,
  end: shutdownPool,
  pool,
};
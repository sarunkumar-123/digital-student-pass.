import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Database client is OPTIONAL.
 * The MTC Digital Student Pass demo runs entirely in the browser
 * (localStorage + mock data) and does not require PostgreSQL.
 *
 * Set DATABASE_URL only if you want to use the optional Drizzle schema
 * against a real database. The demo UI never imports this module.
 */
const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  databaseUrl
    ? globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({ connectionString: databaseUrl })
    : undefined;

if (databaseUrl && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = pool ? drizzle(pool) : undefined;

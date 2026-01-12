
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

// Basic connection string fix for common copy-paste errors (e.g. &pgbouncer instead of ?pgbouncer)
let connectionString = process.env.DATABASE_URL;
if (
  connectionString &&
  connectionString.includes("&pgbouncer=true") &&
  !connectionString.includes("?")
) {
  connectionString = connectionString.replace("&pgbouncer=true", "?pgbouncer=true");
}

if (!connectionString) {
  // Fail fast with a clear error in environments where the DB URL isn't configured
  // (for example, a misconfigured Vercel deployment).
  throw new Error(
    "DATABASE_URL is not set. Set it in your environment (e.g. Vercel Project Settings) before starting the server.",
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

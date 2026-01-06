
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Basic connection string fix for common copy-paste errors (e.g. &pgbouncer instead of ?pgbouncer)
let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.includes("&pgbouncer=true") && !connectionString.includes("?")) {
  connectionString = connectionString.replace("&pgbouncer=true", "?pgbouncer=true");
}

if (!connectionString) {
  console.error("DATABASE_URL is not set. Database operations will fail.");
  // Use a placeholder to allow the app to boot for non-DB health checks
  connectionString = "postgres://username:password@localhost:5432/postgres";
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

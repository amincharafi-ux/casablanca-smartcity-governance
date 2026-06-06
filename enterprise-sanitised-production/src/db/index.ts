import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema.ts";

export const createPool = () => {
  const isConfigured = !!(
    process.env.SQL_HOST &&
    process.env.SQL_USER &&
    process.env.SQL_PASSWORD &&
    process.env.SQL_DB_NAME
  );

  // Fallback to empty details to prevent server crash during initialization
  return new Pool({
    host: process.env.SQL_HOST || "localhost",
    user: process.env.SQL_USER || "postgres",
    password: process.env.SQL_PASSWORD || "postgres",
    database: process.env.SQL_DB_NAME || "postgres",
    connectionTimeoutMillis: 5000,
    max: 10,
    idleTimeoutMillis: 10000,
  });
};

const pool = createPool();

pool.on("error", (err) => {
  console.error("Unexpected error on idle SQL pool client:", err);
});

export const db = drizzle(pool, { schema });
export const isDbConnected = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    return false;
  }
};

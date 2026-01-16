import pg from "pg";
import "dotenv/config";

const { Pool } = pg;
const isRender = process.env.DATABASE_URL?.includes("render.com");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRender ? { rejectUnauthorized: false } : false,
});

export default db;

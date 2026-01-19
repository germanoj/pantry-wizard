import Database from "better-sqlite3";

export const db = new Database("local.db");

// Create users table if it doesn't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT
  )
`
).run();

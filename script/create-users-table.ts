import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "../.local/db.sqlite");
const db = new Database(dbPath);

console.log("Creating users table...");

try {
    // Create users table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

    console.log("✓ Users table created successfully!");

    // Check if table exists
    const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    console.log("Table info:", tableInfo);

    db.close();
} catch (error) {
    console.error("Error creating users table:", error);
    db.close();
    process.exit(1);
}

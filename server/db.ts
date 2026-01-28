import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create .local directory if it doesn't exist
const dbPath = join(__dirname, "..", ".local", "db.sqlite");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
export const rawDb = sqlite; // Export raw sqlite instance for direct queries

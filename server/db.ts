import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { existsSync, mkdirSync } from "fs";

// Ensure .local directory exists in the current working directory
const localDir = join(process.cwd(), ".local");
if (!existsSync(localDir)) {
    mkdirSync(localDir, { recursive: true });
}

const dbPath = join(localDir, "db.sqlite");
console.log(`[Database] Using SQLite at: ${dbPath}`);

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
export const rawDb = sqlite; // Export raw sqlite instance for direct queries

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { existsSync, mkdirSync } from "fs";

// Determine __dirname in both ESM and CJS environments
let _dirname: string;
try {
    const __filename = fileURLToPath(import.meta.url);
    _dirname = dirname(__filename);
} catch (e) {
    // Fallback for CommonJS (bundled production)
    _dirname = __dirname;
}

// Create .local directory if it doesn't exist in the project root
const localDir = join(process.cwd(), ".local");

if (!existsSync(localDir)) {
    mkdirSync(localDir, { recursive: true });
}

const dbPath = join(localDir, "db.sqlite");
console.log(`[Database] Using SQLite at: ${dbPath}`);

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
export const rawDb = sqlite; // Export raw sqlite instance for direct queries

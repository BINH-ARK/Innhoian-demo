import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
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

// Run migrations on startup
try {
    console.log("[Database] Running migrations...");
    const migrationsFolder = join(process.cwd(), "migrations");
    // In production, migrations are in dist/migrations if running from project root
    // Wait, if running from root with dist/index.cjs, we need to decide where migrations are.
    // I copied them to dist/migrations. So if cwd is root, they are at ./migrations (dev) or ./dist/migrations (prod)?
    // Actually, better to check both.
    const targetMigrations = existsSync(join(process.cwd(), "dist", "migrations"))
        ? join(process.cwd(), "dist", "migrations")
        : join(process.cwd(), "migrations");

    migrate(db, { migrationsFolder: targetMigrations });
    console.log("[Database] Migrations completed successfully.");
} catch (error) {
    console.error("[Database] Migration failed:", error);
}

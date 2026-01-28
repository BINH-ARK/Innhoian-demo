import { defineConfig } from "drizzle-kit";
import path from "path";

export default defineConfig({
  out: "./migrations",
  schema: path.resolve(process.cwd(), "shared/schema.ts"),
  dialect: "sqlite",
  dbCredentials: {
    url: path.resolve(process.cwd(), ".local/db.sqlite"),
  },
});

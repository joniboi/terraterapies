import { defineConfig } from "drizzle-kit";

// REMOVE the dotenv.config code entirely.
// Our package.json scripts now handle this for us.

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Drizzle will simply look at the DATABASE_URL currently in memory
    url: process.env.DATABASE_URL!,
  },
});

// db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === "production") {
  throw new Error(
    "DATABASE_URL is missing in production environment variables.",
  );
}

// If connectionString is missing during build, we use a dummy string to prevent
// the postgres client from crashing before the build finishes.
const client = postgres(connectionString || "postgres://localhost:5432/dummy", {
  prepare: false,
});

export const db = drizzle(client, { schema });

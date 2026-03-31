// db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

// Force load the env variables immediately
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

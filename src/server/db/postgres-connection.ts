import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "@/lib/env";
import { personnel, personnelZoneBook } from "./schemas/personnel";

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  ssl: false,
});

export const db = drizzle({
  client: pool,
  logger: true,
  schema: {
    personnel,
    personnelZoneBook,
  },
});

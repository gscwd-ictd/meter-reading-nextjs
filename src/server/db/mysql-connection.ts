import env from "@/lib/env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const hrmsPool = mysql.createPool({
  host: env.HRMS_DB_HOST,
  port: env.HRMS_DB_PORT,
  user: env.HRMS_DB_USER,
  password: env.HRMS_DB_PASS,
  database: env.HRMS_DB_NAME,
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
});

export const hrmsDb = drizzle({
  client: hrmsPool,
  logger: true,
});

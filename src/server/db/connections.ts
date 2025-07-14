import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "@mr/lib/env";
import sql from "mssql";

const pool = new Pool({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASS,
  database: env.POSTGRES_NAME,
  ssl: false,
});

const pgConn = drizzle({
  client: pool,
  logger: true,
});

const sqlConfig: sql.config = {
  server: env.MSSQL_HOST,
  user: env.MSSQL_USER,
  password: env.MSSQL_PASS,
  database: env.MSSQL_NAME,
  port: env.MSSQL_PORT,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

const mssqlConn = await sql.connect(sqlConfig);

export default { pgConn, mssqlConn };

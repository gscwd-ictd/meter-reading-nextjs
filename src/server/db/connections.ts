import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "@mr/lib/env";
import sql from "mssql";
import { area } from "./schemas/area";
import { viewZoneBookArea, zoneBook } from "./schemas/zone-book";
import {
  meterReaders,
  meterReaderZoneBook,
  viewMeterReaderZoneBook,
  viewZoneBookAssignment,
} from "./schemas/meter-readers";
import { schedules, scheduleZoneBooks, viewScheduleReading } from "./schemas/schedules";

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
  schema: {
    area,
    zoneBook,
    meterReaders,
    meterReaderZoneBook,
    schedules,
    scheduleZoneBooks,

    viewZoneBookArea,
    viewMeterReaderZoneBook,
    viewScheduleReading,
    viewZoneBookAssignment,

    // scheduleReaderZoneBookView,
    // scheduleZoneBookView,
    // consumerDetailsView,
  },
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

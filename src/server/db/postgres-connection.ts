import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "@/lib/env";
import { meterReaders, meterReaderZoneBook, viewMeterReaderZoneBook } from "./schemas/meter-readers";
import { viewZoneBookArea, zoneBook } from "./schemas/zone-book";
import { area } from "./schemas/area";
import {
  scheduleReaderZoneBookView,
  schedules,
  scheduleZoneBooks,
  scheduleZoneBookView,
} from "./schemas/schedules";
import { consumerDetailsView } from "./schemas/consumer";

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
    area,
    zoneBook,
    meterReaders,
    meterReaderZoneBook,
    schedules,
    scheduleZoneBooks,
    scheduleReaderZoneBookView,
    scheduleZoneBookView,
    consumerDetailsView,
    viewZoneBookArea,
    viewMeterReaderZoneBook,
  },
});

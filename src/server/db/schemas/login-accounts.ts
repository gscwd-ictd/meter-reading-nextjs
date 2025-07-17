import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";
import z4 from "zod/v4";
import { meterReaders } from "./meter-readers";

export const loginAccounts = pgTable("login_accounts", {
  id: varchar("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  meterReaderId: varchar("meter_reader_id").references(() => meterReaders.meterReaderId),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  positionTitle: varchar("position_title").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const LoginSchema = z4.object({
  username: z4.string(),
  password: z4.string(),
});

export const AuthSchema = z4.object({
  username: z4.string(),
  password: z4.string(),
  positionTitle: z4.string(),
  image: z4.url().optional(),
});

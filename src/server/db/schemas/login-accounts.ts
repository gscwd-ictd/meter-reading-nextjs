import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import z4 from "zod/v4";
import { meterReaders } from "./meter-readers";
import { relations } from "drizzle-orm";

export const loginAccounts = pgTable("login_accounts", {
  id: varchar("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  meterReaderId: uuid("meter_reader_id")
    .references(() => meterReaders.id, {
      onDelete: "cascade",
    })
    .notNull(),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const loginAccountRelations = relations(loginAccounts, ({ one }) => ({
  meterReader: one(meterReaders, {
    fields: [loginAccounts.meterReaderId],
    references: [meterReaders.id],
  }),
}));

export const LoginSchema = z4.object({
  username: z4.string(),
  password: z4.string(),
});

export const AuthSchema = z4.object({
  meterReaderId: z4.string(),
  username: z4.string(),
  password: z4.string(),
  positionTitle: z4.string(),
  image: z4.url().optional(),
});

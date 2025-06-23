import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import z4 from "zod/v4";

export const loginAccounts = pgTable("login_accounts", {
  id: varchar("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  number: varchar("number").notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp({ mode: "date" }).defaultNow(),
  updatedAt: timestamp({ mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const AuthSchema = z4.object({
  number: z4.string(),
  password: z4.string(),
});

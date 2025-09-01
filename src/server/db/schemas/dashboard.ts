import { sql } from "drizzle-orm";
import { integer, pgView } from "drizzle-orm/pg-core";

export const countConsumerByStatusView = pgView("view_count_consumer_by_status", {
  active: integer("active").notNull(),
  disconnected: integer("disconnected").notNull(),
  writeOff: integer("write_off").notNull(),
  total: integer("total").notNull(),
}).as(sql`
    select
        count(*) filter (where status = 'ACTIVE') as active,
        count(*) filter (where status = 'DISCONNECTED') as disconnected,
        count(*) filter (where status = 'WRITE-OFF') as "write_off",
        count(*) as total
    from 
    "ViewCountConsumer"`);

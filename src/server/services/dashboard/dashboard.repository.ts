import { IDashboardRepository } from "@mr/server/interfaces/dashboard/dashboard.interface.repository";
import {
  ConsumerCount,
  MonthlyReadingCounts,
  MonthlyReadingCountsSchema,
} from "@mr/server/types/dashboard.type";
import db from "@mr/server/db/connections";
import { countConsumerByStatusView } from "@mr/server/db/schemas/dashboard";
import { sql } from "drizzle-orm";

export class DashboardRepository implements IDashboardRepository {
  async countConsumer(): Promise<ConsumerCount> {
    const [result] = await db.pgConn.select().from(countConsumerByStatusView);

    return result;
  }

  async getMonthlyReadingCounts(): Promise<MonthlyReadingCounts> {
    const result = await db.pgConn.execute(sql`
      select
        count(*) filter (where is_read = true  and is_posted = true) as billed,
        count(*) filter (where is_read = false and is_posted = true) as unbilled,
        count(*) filter (where remarks != 'Normal Reading' and remarks is not null and remarks != '' and is_posted = true) as remarks
      from reading_details
      where created_at >= date_trunc('month', current_date)
        and created_at < date_trunc('month', current_date) + interval '1 month'
    `);

    const newMeters = await db.pgConn.execute(sql`
      select 
        count(*) 
      from 
        new_meters 
      where 
        is_committed = true 
        and date_time >= date_trunc('month', current_date)
        and date_time < date_trunc('month', current_date) + interval '1 month';
      `);

    const raw = {
      ...result.rows[0],
      newMeters: newMeters.rows[0].count,
    };

    return MonthlyReadingCountsSchema.parse(raw);
  }
}

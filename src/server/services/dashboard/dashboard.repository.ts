import { IDashboardRepository } from "@mr/server/interfaces/dashboard/dashboard.interface.repository";
import { ConsumerCount, ConsumerCountSchema } from "@mr/server/types/dashboard.type";
import { sql } from "drizzle-orm";
import db from "@mr/server/db/connections";

export class DashboardRepository implements IDashboardRepository {
  async countConsumer(): Promise<ConsumerCount> {
    const result = await db.pgConn.execute<ConsumerCount>(sql`
        select
            count(*) filter (where status = 'ACTIVE') as active,
            count(*) filter (where status = 'DISCONNECTED') as disconnected,
            count(*) filter (where status = 'WRITE-OFF') as "writeOff",
            count(*) as total
        from "ViewCountConsumer";`);

    return ConsumerCountSchema.parse(result.rows[0]);
  }
}

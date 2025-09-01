import { IDashboardRepository } from "@mr/server/interfaces/dashboard/dashboard.interface.repository";
import { ConsumerCount } from "@mr/server/types/dashboard.type";
import db from "@mr/server/db/connections";
import { countConsumerByStatusView } from "@mr/server/db/schemas/dashboard";

export class DashboardRepository implements IDashboardRepository {
  async countConsumer(): Promise<ConsumerCount> {
    const [result] = await db.pgConn.select().from(countConsumerByStatusView);

    return result;
  }
}

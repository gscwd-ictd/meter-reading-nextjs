import { IDashboardService } from "@mr/server/interfaces/dashboard/dashboard.interface.service";
import { ConsumerCount } from "@mr/server/types/dashboard.type";
import { DashboardRepository } from "./dashboard.repository";

export class DashboardService implements IDashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  async countConsumer(): Promise<ConsumerCount> {
    return this.repository.countConsumer();
  }
}

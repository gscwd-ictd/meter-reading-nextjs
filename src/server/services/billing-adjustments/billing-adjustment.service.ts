import { IBillingAdjustmentService } from "@mr/server/interfaces/billing-adjustments/billing-adjustment.interface.sevice";
import {
  BillingAdjustment,
  CreateBillingAdjustment,
  UpdateBillingAdjustment,
} from "@mr/server/types/billing-adjustment.type";
import { BillingAdjustmentRepository } from "./billing-adjustment.repository";

export class BillingAdjustmentService implements IBillingAdjustmentService {
  constructor(private readonly repository: BillingAdjustmentRepository) {}

  async getAll(): Promise<BillingAdjustment[]> {
    return await this.repository.findAll();
  }

  async add(data: CreateBillingAdjustment): Promise<BillingAdjustment> {
    return await this.repository.create(data);
  }

  async getById(id: string): Promise<BillingAdjustment> {
    return await this.repository.findById(id);
  }

  async update(id: string, data: UpdateBillingAdjustment): Promise<BillingAdjustment> {
    return await this.repository.update(id, data);
  }

  async remove(id: string): Promise<BillingAdjustment> {
    return await this.repository.delete(id);
  }
}

import {
  BillingAdjustment,
  CreateBillingAdjustment,
  UpdateBillingAdjustment,
} from "@mr/server/types/billing-adjustment.type";

export interface IBillingAdjustmentRepository {
  findAll(): Promise<BillingAdjustment[]>;
  create(data: CreateBillingAdjustment): Promise<BillingAdjustment>;
  findById(id: string): Promise<BillingAdjustment>;
  update(id: string, data: UpdateBillingAdjustment): Promise<BillingAdjustment>;
  delete(id: string): Promise<BillingAdjustment>;
}

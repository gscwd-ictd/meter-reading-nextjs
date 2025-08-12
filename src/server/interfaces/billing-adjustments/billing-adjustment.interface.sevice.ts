import {
  BillingAdjustment,
  CreateBillingAdjustment,
  UpdateBillingAdjustment,
} from "@mr/server/types/billing-adjustment.type";

export interface IBillingAdjustmentService {
  getAll(): Promise<BillingAdjustment[]>;
  add(data: CreateBillingAdjustment): Promise<BillingAdjustment>;
  getById(id: string): Promise<BillingAdjustment>;
  update(id: string, data: UpdateBillingAdjustment): Promise<BillingAdjustment>;
  remove(id: string): Promise<BillingAdjustment>;
}

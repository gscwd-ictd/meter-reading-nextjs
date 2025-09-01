import { IBillingAdjustmentRepository } from "@mr/server/interfaces/billing-adjustments/billing-adjustment.interface.repository";
import {
  BillingAdjustment,
  CreateBillingAdjustment,
  UpdateBillingAdjustment,
} from "@mr/server/types/billing-adjustment.type";
import db from "@mr/server/db/connections";
import { billingAdjustments } from "@mr/server/db/schemas/billing-adjustments";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

export class BillingAdjustmentRepository implements IBillingAdjustmentRepository {
  async findAll(): Promise<BillingAdjustment[]> {
    const result = await db.pgConn.select().from(billingAdjustments);
    return result;
  }

  async create(data: CreateBillingAdjustment): Promise<BillingAdjustment> {
    try {
      const [result] = await db.pgConn
        .insert(billingAdjustments)
        .values({
          name: data.name,
          percentage: data.percentage,
        })
        .returning();

      return result;
    } catch (error: any) {
      if (error.cause.code === "23505") {
        // Unique constraint violation
        throw new HTTPException(409, { message: "Billing adjustment name already exists" });
      }
      throw error; // Let service handle other errors
    }
  }

  async findById(id: string): Promise<BillingAdjustment> {
    const [result] = await db.pgConn.select().from(billingAdjustments).where(eq(billingAdjustments.id, id));

    if (!result) {
      throw new HTTPException(404, { message: "Billing adjustment not found" });
    }

    return result;
  }

  async update(id: string, data: UpdateBillingAdjustment): Promise<BillingAdjustment> {
    try {
      const [result] = await db.pgConn
        .update(billingAdjustments)
        .set(data)
        .where(eq(billingAdjustments.id, id))
        .returning();

      if (!result) {
        throw new HTTPException(404, { message: "Billing adjustment not found" });
      }

      return result;
    } catch (error: any) {
      if (error instanceof HTTPException) {
        throw error;
      }
      if (error.cause.code === "23505") {
        // Unique constraint violation
        throw new HTTPException(409, { message: "Billing adjustment name already exists" });
      }
      throw error; // Let service handle other errors
    }
  }

  async delete(id: string): Promise<BillingAdjustment> {
    const [result] = await db.pgConn
      .delete(billingAdjustments)
      .where(eq(billingAdjustments.id, id))
      .returning();

    if (!result) {
      throw new HTTPException(404, { message: "Billing adjustment not found" });
    }

    return result;
  }
}

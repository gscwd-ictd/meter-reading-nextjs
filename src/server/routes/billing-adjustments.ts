import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import {
  CreateBillingAdjustmentSchema,
  UpdateBillingAdjustmentSchema,
} from "../types/billing-adjustment.type";

const billingAdjustmentService = meterReadingContext.getBillingAdjustmentService();

export const billingAdjustmentHandler = new Hono()
  .basePath("billing-adjustments")

  .get("/", async (c) => {
    const result = await billingAdjustmentService.getAll();
    return c.json(result);
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await billingAdjustmentService.getById(id);
    return c.json(result);
  })

  .post("/", zValidator("json", CreateBillingAdjustmentSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await billingAdjustmentService.add(body);
    return c.json(result, 201);
  })

  .patch("/:id", zValidator("json", UpdateBillingAdjustmentSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const result = await billingAdjustmentService.update(id, body);
    return c.json(result);
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await billingAdjustmentService.remove(id);
    return c.json(result);
  });

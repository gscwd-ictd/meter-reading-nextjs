import { Hono } from "hono";
import { meterReadingContext } from "../context";

const consumerService = meterReadingContext.getConsumerService();

const consumerRoutes = new Hono().get("/:id/schedule-reading", async (c) => {
  const meterReaderId = c.req.param("id");
  const result = await consumerService.getConsumerDetails(meterReaderId);

  return c.json(result);
});

export const consumerHandler = new Hono().route("meter-readers", consumerRoutes);

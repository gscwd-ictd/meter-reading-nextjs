import { Hono } from "hono";
import { meterReadingContext } from "../context";

const consumerService = meterReadingContext.getConsumerService();

const consumerRoutes = new Hono().get("/:account-number", async (c) => {
  const accountNumber = c.req.param("account-number");

  const result = await consumerService.getConsumerDetails(accountNumber);

  return c.json(result);
});

export const consumerHandler = new Hono().route("consumers", consumerRoutes);

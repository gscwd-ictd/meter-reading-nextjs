import { Hono } from "hono";
import { meterReadingContext } from "../context";

const dashboardService = meterReadingContext.getDashboardService();

export const dashboardHandler = new Hono()
  .basePath("dashboard")

  .get("/consumer-counts", async (c) => {
    const result = await dashboardService.countConsumer();
    return c.json(result);
  });

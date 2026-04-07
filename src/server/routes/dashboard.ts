import { Hono } from "hono";
import { meterReadingContext } from "../context";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const dashboardService = meterReadingContext.getDashboardService();

export const dashboardHandler = new Hono()
  .basePath("dashboard")

  .get("/consumer-counts", async (c) => {
    const result = await dashboardService.countConsumer();
    return c.json(result);
  })

  .get("/monthly-reading-counts", async (c) => {
    const result = await dashboardService.getMonthlyReadingCounts();
    return c.json(result);
  })

  .get(
    "/mobile/reading-counts",
    zValidator("query", z.object({ meterReaderId: z.string(), zone: z.string(), book: z.string() })),
    async (c) => {
      const { meterReaderId, zone, book } = c.req.valid("query");
      const result = await dashboardService.getReadingsByReaderZoneBookCounts(meterReaderId, zone, book);
      return c.json(result);
    },
  );
